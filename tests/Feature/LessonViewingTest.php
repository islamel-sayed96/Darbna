<?php

namespace Tests\Feature;

use App\Models\Lesson;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LessonViewingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function publishedCourseWithLesson(array $lessonAttributes = [])
    {
        $instructor = User::role('instructor')->first();

        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس فيديو',
            'slug' => 'kors-video',
            'price' => 0,
            'is_free' => true,
            'level' => 'beginner',
            'language' => 'ar',
            'status' => 'published',
            'published_at' => now(),
        ]);

        $section = $course->sections()->create(['title' => 'قسم', 'position' => 1]);
        $lesson = $section->lessons()->create(array_merge([
            'title' => 'درس الفيديو',
            'type' => 'video',
            'position' => 1,
            'is_preview' => false,
        ], $lessonAttributes));

        return [$course, $lesson];
    }

    public function test_youtube_id_is_extracted_when_instructor_adds_a_video_lesson(): void
    {
        $instructor = User::role('instructor')->first();
        $course = $instructor->coursesTaught()->create([
            'title' => 'كورس', 'slug' => 'kors-yt', 'price' => 0, 'is_free' => true,
            'level' => 'beginner', 'language' => 'ar', 'status' => 'draft',
        ]);
        $section = $course->sections()->create(['title' => 'قسم', 'position' => 1]);

        $this->actingAs($instructor)->post(route('instructor.lessons.store', $section), [
            'title' => 'درس',
            'type' => 'video',
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);

        $lesson = $section->lessons()->first();

        $this->assertSame('youtube', $lesson->video_provider);
        $this->assertSame('dQw4w9WgXcQ', $lesson->video_id);
    }

    public function test_guest_can_view_a_preview_lesson_but_not_a_locked_one(): void
    {
        [$course, $lesson] = $this->publishedCourseWithLesson(['is_preview' => false]);

        $this->get(route('lessons.show', $lesson))->assertRedirect(route('courses.show', $course->slug));

        $lesson->update(['is_preview' => true]);
        $this->get(route('lessons.show', $lesson))->assertOk();
    }

    public function test_enrolled_student_can_view_lesson_and_mark_it_complete(): void
    {
        [$course, $lesson] = $this->publishedCourseWithLesson();
        $student = User::role('student')->first();

        $this->actingAs($student)->post(route('courses.enroll', $course));
        $this->actingAs($student)->get(route('lessons.show', $lesson))->assertOk();

        $this->actingAs($student)->post(route('lessons.complete', $lesson))->assertRedirect();

        $enrollment = $course->enrollments()->where('user_id', $student->id)->first();
        $this->assertSame(100, $enrollment->progress_percent);
        $this->assertNotNull($enrollment->completed_at);
    }

    public function test_non_enrolled_student_cannot_mark_lesson_complete(): void
    {
        [$course, $lesson] = $this->publishedCourseWithLesson();
        $student = User::role('student')->first();

        $this->actingAs($student)->post(route('lessons.complete', $lesson))->assertForbidden();
    }
}
