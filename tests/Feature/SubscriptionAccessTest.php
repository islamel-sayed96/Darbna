<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\LearningPath;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function makeCourse(array $overrides = []): Course
    {
        $instructor = User::role('instructor')->first();

        return Course::create([
            'instructor_id' => $instructor->id,
            'title' => 'كورس تجريبي '.uniqid(),
            'slug' => 'course-'.uniqid(),
            'price' => 99,
            'is_free' => false,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'published',
            'published_at' => now(),
            ...$overrides,
        ]);
    }

    private function makeLearningPath(): LearningPath
    {
        return LearningPath::create([
            'title' => 'مسار تجريبي '.uniqid(),
            'slug' => 'path-'.uniqid(),
            'is_published' => true,
        ]);
    }

    public function test_all_access_plan_grants_access_to_any_course_without_selection(): void
    {
        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'all_access-1m')->first();
        $course = $this->makeCourse();

        $subscription = Subscription::create([
            'user_id' => $student->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->assertFalse($subscription->needsSelection());
        $this->assertTrue($student->hasAccessToCourse($course));
    }

    public function test_limited_courses_plan_requires_selection_and_grants_access_only_to_selected_courses(): void
    {
        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'limited_courses-1m')->first();
        [$courseA, $courseB, $courseC, $courseD] = [
            $this->makeCourse(), $this->makeCourse(), $this->makeCourse(), $this->makeCourse(),
        ];

        $subscription = Subscription::create([
            'user_id' => $student->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->assertTrue($subscription->needsSelection());
        $this->assertFalse($student->hasAccessToCourse($courseA));

        $response = $this->actingAs($student)->get(route('subscriptions.select.edit', $subscription));
        $response->assertOk();

        $this->actingAs($student)->post(route('subscriptions.select.update', $subscription), [
            'ids' => [$courseA->id, $courseB->id, $courseC->id],
        ])->assertRedirect(route('student.dashboard'));

        $subscription->refresh();
        $student->refresh();

        $this->assertFalse($subscription->needsSelection());
        $this->assertTrue($student->hasAccessToCourse($courseA));
        $this->assertTrue($student->hasAccessToCourse($courseB));
        $this->assertTrue($student->hasAccessToCourse($courseC));
        $this->assertFalse($student->hasAccessToCourse($courseD));
    }

    public function test_limited_courses_selection_rejects_wrong_count(): void
    {
        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'limited_courses-1m')->first();
        $course = $this->makeCourse();

        $subscription = Subscription::create([
            'user_id' => $student->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->actingAs($student)->post(route('subscriptions.select.update', $subscription), [
            'ids' => [$course->id],
        ])->assertSessionHasErrors('ids');
    }

    public function test_single_path_plan_grants_access_to_all_courses_in_the_selected_path_only(): void
    {
        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'single_path-1m')->first();

        $pathOne = $this->makeLearningPath();
        $pathTwo = $this->makeLearningPath();
        $courseInPathOne = $this->makeCourse(['learning_path_id' => $pathOne->id]);
        $courseInPathTwo = $this->makeCourse(['learning_path_id' => $pathTwo->id]);

        $subscription = Subscription::create([
            'user_id' => $student->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->actingAs($student)->post(route('subscriptions.select.update', $subscription), [
            'ids' => [$pathOne->id],
        ])->assertRedirect(route('student.dashboard'));

        $student->refresh();

        $this->assertTrue($student->hasAccessToCourse($courseInPathOne));
        $this->assertFalse($student->hasAccessToCourse($courseInPathTwo));
    }

    public function test_free_courses_are_always_accessible_without_a_subscription(): void
    {
        $student = User::role('student')->first();
        $freeCourse = $this->makeCourse(['is_free' => true, 'price' => 0]);

        $this->assertTrue($student->hasAccessToCourse($freeCourse));
    }

    public function test_enrollment_is_blocked_for_a_paid_course_outside_the_subscribed_scope(): void
    {
        $student = User::role('student')->first();
        $plan = SubscriptionPlan::where('slug', 'limited_courses-1m')->first();
        $course = $this->makeCourse();

        Subscription::create([
            'user_id' => $student->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);

        $this->actingAs($student)->post(route('courses.enroll', $course))->assertForbidden();
    }

    public function test_admin_can_manually_enroll_a_student_into_a_course(): void
    {
        $admin = User::role('admin')->first();
        $student = User::role('student')->first();
        $course = $this->makeCourse();

        $response = $this->actingAs($admin)->post(route('admin.enrollments.store'), [
            'email' => $student->email,
            'course_id' => $course->id,
        ]);

        $response->assertRedirect();
        $this->assertTrue($course->enrollments()->where('user_id', $student->id)->where('source', 'manual')->exists());
    }

    public function test_non_admin_cannot_manually_enroll_students(): void
    {
        $student = User::role('student')->first();
        $course = $this->makeCourse();

        $this->actingAs($student)->post(route('admin.enrollments.store'), [
            'email' => $student->email,
            'course_id' => $course->id,
        ])->assertForbidden();
    }

    public function test_admin_can_manage_subscription_plans(): void
    {
        $admin = User::role('admin')->first();

        $response = $this->actingAs($admin)->post(route('admin.subscription-plans.store'), [
            'name' => 'خطة خاصة',
            'price' => 199,
            'currency' => 'AED',
            'duration_months' => 3,
            'access_type' => SubscriptionPlan::ACCESS_ALL,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('subscription_plans', ['name' => 'خطة خاصة', 'price' => 199]);
    }
}
