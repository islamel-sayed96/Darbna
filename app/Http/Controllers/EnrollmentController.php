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

        $hasActiveSubscription = (bool) $user->activeSubscription();

        abort_unless(
            $course->is_free || $hasActiveSubscription,
            403,
            'هذا الكورس يتطلب اشتراك فعّال أو شراء منفصل.'
        );

        $course->enrollments()->create([
            'user_id' => $user->id,
            'source' => $course->is_free ? 'free' : 'subscription',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', 'تم تسجيلك في الكورس بنجاح.');
    }
}
