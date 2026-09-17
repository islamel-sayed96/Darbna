<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\LearningPath;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString() ?: 'pending_review';

        $courses = Course::query()
            ->with('instructor:id,name', 'category:id,name')
            ->when($status !== 'all', fn ($query) => $query->where('status', $status))
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'filters' => ['status' => $status],
        ]);
    }

    public function show(Course $course): Response
    {
        $course->load(['instructor:id,name,email,headline', 'category:id,name', 'learningPath:id,title', 'sections.lessons']);

        return Inertia::render('Admin/Courses/Show', [
            'course' => $course,
            'learningPaths' => LearningPath::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function assignLearningPath(Request $request, Course $course): RedirectResponse
    {
        $data = $request->validate([
            'learning_path_id' => ['nullable', 'exists:learning_paths,id'],
        ]);

        $course->update($data);

        return back()->with('success', 'تم تحديث مسار الكورس.');
    }

    public function approve(Course $course): RedirectResponse
    {
        $course->update([
            'status' => 'published',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'published_at' => $course->published_at ?? now(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'تم قبول الكورس ونشره بنجاح.');
    }

    public function reject(Request $request, Course $course): RedirectResponse
    {
        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:2000'],
        ]);

        $course->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'rejection_reason' => $data['rejection_reason'],
        ]);

        return back()->with('success', 'تم رفض الكورس مع إرسال السبب للمحاضر.');
    }

    public function unpublish(Course $course): RedirectResponse
    {
        $course->update(['status' => 'unpublished']);

        return back()->with('success', 'تم إلغاء نشر الكورس.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'تم حذف الكورس نهائيًا.');
    }
}
