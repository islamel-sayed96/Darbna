<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonViewController extends Controller
{
    public function show(Lesson $lesson): Response|RedirectResponse
    {
        $lesson->load('section.course.sections.lessons');
        $course = $lesson->section->course;
        $user = auth()->user();

        $isOwner = $user && $course->instructor_id === $user->id;
        $isEnrolled = $user && $course->enrollments()->where('user_id', $user->id)->exists();
        $canView = $lesson->is_preview || $isOwner || $isEnrolled || $user?->hasRole('admin');

        if (! $canView) {
            return redirect()->route('courses.show', $course->slug)
                ->with('success', 'لازم تشترك في الكورس الأول عشان تشوف الدرس ده.');
        }

        $allLessons = $course->sections->flatMap(fn ($section) => $section->lessons->map(
            fn ($l) => ['id' => $l->id, 'title' => $l->title, 'section_title' => $section->title]
        ))->values();

        $currentIndex = $allLessons->search(fn ($l) => $l['id'] === $lesson->id);

        $isCompleted = $user
            ? $lesson->progress()->where('user_id', $user->id)->whereNotNull('completed_at')->exists()
            : false;

        return Inertia::render('Lessons/Show', [
            'course' => $course->only('id', 'title', 'slug'),
            'lesson' => $lesson,
            'allLessons' => $allLessons,
            'currentIndex' => $currentIndex,
            'prevLesson' => $currentIndex > 0 ? $allLessons[$currentIndex - 1] : null,
            'nextLesson' => $currentIndex < $allLessons->count() - 1 ? $allLessons[$currentIndex + 1] : null,
            'isCompleted' => $isCompleted,
            'canView' => true,
        ]);
    }
}
