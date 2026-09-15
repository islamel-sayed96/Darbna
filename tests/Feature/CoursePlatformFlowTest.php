<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoursePlatformFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    public function test_instructor_can_create_course_and_submit_for_review(): void
    {
        $instructor = User::role('instructor')->first();

        $response = $this->actingAs($instructor)->post(route('instructor.courses.store'), [
            'title' => 'كورس لارافيل من الصفر',
            'description' => 'وصف الكورس',
            'category_id' => null,
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
        ]);

        $course = $instructor->coursesTaught()->latest('id')->first();

        $response->assertRedirect(route('instructor.courses.edit', $course));
        $this->assertSame('draft', $course->status);

        $this->actingAs($instructor)->post(route('instructor.sections.store', $course), [
            'title' => 'القسم الأول',
        ]);

        $section = $course->sections()->first();

        $this->actingAs($instructor)->post(route('instructor.lessons.store', $section), [
            'title' => 'الدرس الأول',
            'type' => 'video',
        ]);

        $submitResponse = $this->actingAs($instructor)->post(route('instructor.courses.submit', $course));
        $submitResponse->assertRedirect();

        $course->refresh();
        $this->assertSame('pending_review', $course->status);
    }

    public function test_admin_can_approve_pending_course_and_it_becomes_visible_publicly(): void
    {
        $admin = User::role('admin')->first();
        $instructor = User::role('instructor')->first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس تجريبي',
            'slug' => 'kors-tjrbi',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'pending_review',
            'submitted_at' => now(),
        ]);
        $section = $course->sections()->create(['title' => 'قسم', 'position' => 1]);
        $section->lessons()->create(['title' => 'درس', 'type' => 'video', 'position' => 1]);

        $response = $this->actingAs($admin)->post(route('admin.courses.approve', $course));
        $response->assertRedirect();

        $course->refresh();
        $this->assertSame('published', $course->status);
        $this->assertNotNull($course->published_at);

        $this->get(route('courses.show', $course->slug))->assertOk();
    }

    public function test_admin_can_reject_pending_course_with_reason(): void
    {
        $admin = User::role('admin')->first();
        $instructor = User::role('instructor')->first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس آخر',
            'slug' => 'kors-akher',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'pending_review',
            'submitted_at' => now(),
        ]);

        $response = $this->actingAs($admin)->post(route('admin.courses.reject', $course), [
            'rejection_reason' => 'محتوى ناقص',
        ]);
        $response->assertRedirect();

        $course->refresh();
        $this->assertSame('rejected', $course->status);
        $this->assertSame('محتوى ناقص', $course->rejection_reason);
    }

    public function test_student_can_enroll_in_free_published_course(): void
    {
        $student = User::role('student')->first();
        $instructor = User::role('instructor')->first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس مجاني',
            'slug' => 'kors-magany',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->actingAs($student)->post(route('courses.enroll', $course));
        $response->assertRedirect();

        $this->assertTrue($course->enrollments()->where('user_id', $student->id)->exists());
    }

    public function test_student_cannot_enroll_in_paid_course_without_subscription(): void
    {
        $student = User::role('student')->first();
        $instructor = User::role('instructor')->first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس مدفوع',
            'slug' => 'kors-madfoo',
            'price' => 500,
            'is_free' => false,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $this->actingAs($student)->post(route('courses.enroll', $course))->assertForbidden();

        $this->assertFalse($course->enrollments()->where('user_id', $student->id)->exists());
    }

    public function test_instructor_cannot_edit_another_instructors_course(): void
    {
        $instructor = User::role('instructor')->first();
        $otherInstructor = User::factory()->create();
        $otherInstructor->assignRole('instructor');

        $course = $otherInstructor->coursesTaught()->create([
            'title' => 'كورس المحاضر الآخر',
            'slug' => 'kors-el-akhar',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'draft',
        ]);

        $this->actingAs($instructor)
            ->put(route('instructor.courses.update', $course), ['title' => 'محاولة تعديل'])
            ->assertForbidden();
    }
}
