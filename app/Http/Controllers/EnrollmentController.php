<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\RedirectResponse;

class EnrollmentController extends Controller
{
    public function store(Course $course): RedirectResponse
    {
        abort_unless($course->status === 'published', 404);

        $user = auth()->user();

        if ($course->enrollments()->where('user_id', $user->id)->exists()) {
            return back()->with('success', 'أنت مشترك بالفعل في هذا الكورس.');
        }

        $hasAccess = $user->hasAccessToCourse($course);

        abort_unless(
            $hasAccess,
            403,
            'هذا الكورس مش مشمول باشتراكك الحالي.'
        );

        $course->enrollments()->create([
            'user_id' => $user->id,
            'source' => $course->is_free ? 'free' : 'subscription',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', 'تم تسجيلك في الكورس بنجاح.');
    }
}
