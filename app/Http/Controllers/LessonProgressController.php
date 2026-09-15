<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\RedirectResponse;

class LessonProgressController extends Controller
{
    public function store(Lesson $lesson): RedirectResponse
    {
        $lesson->load('section.course');
        $course = $lesson->section->course;
        $user = auth()->user();

        $enrollment = $course->enrollments()->where('user_id', $user->id)->first();
        abort_unless($enrollment, 403, 'لازم تكون مشترك في الكورس عشان تسجل تقدمك.');

        $lesson->progress()->updateOrCreate(
            ['user_id' => $user->id],
            ['completed_at' => now()]
        );

        $lessonIds = Lesson::whereIn('section_id', $course->sections()->pluck('id'))->pluck('id');

        $totalLessons = $lessonIds->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->whereNotNull('completed_at')
            ->count();

        $progress = $totalLessons > 0 ? (int) round(($completedLessons / $totalLessons) * 100) : 0;

        $enrollment->update([
            'progress_percent' => $progress,
            'completed_at' => $progress >= 100 ? ($enrollment->completed_at ?? now()) : null,
        ]);

        return back()->with('success', 'تم تسجيل إتمام الدرس.');
    }
}
