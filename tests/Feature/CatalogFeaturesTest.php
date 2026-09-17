<?php

namespace Tests\Feature;

use App\Models\InstructorApplication;
use App\Models\LearningPath;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogFeaturesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_admin_can_create_edit_and_delete_a_category(): void
    {
        $admin = User::role('admin')->first();

        $this->actingAs($admin)->post(route('admin.categories.store'), ['name' => 'تصميم'])
            ->assertRedirect();
        $category = \App\Models\Category::where('name', 'تصميم')->first();
        $this->assertNotNull($category);

        $this->actingAs($admin)->put(route('admin.categories.update', $category), ['name' => 'تصميم جرافيك'])
            ->assertRedirect();
        $this->assertSame('تصميم جرافيك', $category->fresh()->name);

        $this->actingAs($admin)->delete(route('admin.categories.destroy', $category))
            ->assertRedirect();
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_category_with_courses_cannot_be_deleted(): void
    {
        $admin = User::role('admin')->first();
        $category = \App\Models\Category::first();

        $this->actingAs($admin)->delete(route('admin.categories.destroy', $category))
            ->assertStatus(422);

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_admin_can_create_a_learning_path_and_instructor_can_assign_a_course_to_it(): void
    {
        $admin = User::role('admin')->first();
        $instructor = User::role('instructor')->first();

        $this->actingAs($admin)->post(route('admin.learning-paths.store'), [
            'title' => 'مسار تجريبي',
            'description' => 'وصف',
        ])->assertRedirect();
        $path = LearningPath::where('title', 'مسار تجريبي')->first();
        $this->assertNotNull($path);

        $this->actingAs($instructor)->post(route('instructor.courses.store'), [
            'title' => 'كورس داخل مسار',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'learning_path_id' => $path->id,
        ])->assertRedirect();

        $course = $instructor->coursesTaught()->where('title', 'كورس داخل مسار')->first();
        $this->assertSame($path->id, $course->learning_path_id);
    }

    public function test_admin_can_reassign_a_courses_learning_path_from_review_page(): void
    {
        $admin = User::role('admin')->first();
        $instructor = User::role('instructor')->first();
        $path = LearningPath::first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس', 'slug' => 'kors-path-reassign', 'price' => 0, 'is_free' => true,
            'level' => 'beginner', 'language' => 'ar', 'status' => 'draft',
        ]);

        $this->actingAs($admin)->post(route('admin.courses.assign-learning-path', $course), [
            'learning_path_id' => $path->id,
        ])->assertRedirect();

        $this->assertSame($path->id, $course->fresh()->learning_path_id);
    }

    public function test_unpublished_learning_path_is_not_publicly_visible(): void
    {
        $path = LearningPath::first();
        $path->update(['is_published' => false]);

        $this->get(route('learning-paths.show', $path->slug))->assertNotFound();
    }

    public function test_guest_can_submit_instructor_application_and_admin_can_approve_it(): void
    {
        $response = $this->post(route('instructor-application.store'), [
            'name' => 'مرشح محاضر',
            'email' => 'candidate@darbna.test',
            'message' => 'خبرة 5 سنين في التسويق',
        ]);
        $response->assertRedirect();

        $application = InstructorApplication::where('email', 'candidate@darbna.test')->first();
        $this->assertNotNull($application);
        $this->assertSame('pending', $application->status);

        $admin = User::role('admin')->first();
        $this->actingAs($admin)->post(route('admin.instructor-applications.approve', $application))
            ->assertRedirect();

        $application->refresh();
        $this->assertSame('approved', $application->status);
        $this->assertNotNull($application->created_user_id);

        $newInstructor = User::find($application->created_user_id);
        $this->assertTrue($newInstructor->hasRole('instructor'));
    }

    public function test_admin_can_reject_instructor_application(): void
    {
        $application = InstructorApplication::create([
            'name' => 'مرشح مرفوض', 'email' => 'rejected@darbna.test',
        ]);

        $admin = User::role('admin')->first();
        $this->actingAs($admin)->post(route('admin.instructor-applications.reject', $application))
            ->assertRedirect();

        $this->assertSame('rejected', $application->fresh()->status);
        $this->assertNull($application->fresh()->created_user_id);
    }

    public function test_homepage_stats_are_hidden_below_the_500_student_threshold(): void
    {
        $response = $this->get(route('home'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->where('stats', null));
    }

    public function test_homepage_stats_appear_once_500_students_are_reached(): void
    {
        User::factory()->count(500)->create()->each(fn ($u) => $u->assignRole('student'));

        $response = $this->get(route('home'));
        $response->assertInertia(fn ($page) => $page->where('stats.students', fn ($count) => $count >= 500));
    }
}
