<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Enrollments/Index', [
            'courses' => Course::query()
                ->where('status', 'published')
                ->orderBy('title')
                ->get(['id', 'title', 'slug', 'is_free']),
            'manualEnrollments' => Enrollment::query()
                ->where('source', 'manual')
                ->with(['user:id,name,email', 'course:id,title'])
                ->latest('enrolled_at')
                ->limit(50)
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $student = User::where('email', $validated['email'])->firstOrFail();
        abort_unless($student->hasRole('student'), 422, 'الحساب ده مش حساب طالب.');

        $course = Course::findOrFail($validated['course_id']);

        if ($course->enrollments()->where('user_id', $student->id)->exists()) {
            return back()->with('success', 'الطالب ده مسجل بالفعل في الكورس ده.');
        }

        $course->enrollments()->create([
            'user_id' => $student->id,
            'source' => 'manual',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', "تم تسجيل {$student->name} في الكورس بنجاح.");
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        abort_unless($enrollment->source === 'manual', 422, 'الإجراء ده متاح بس للتسجيلات اليدوية.');

        $enrollment->delete();

        return back()->with('success', 'تم إلغاء التسجيل.');
    }
}
