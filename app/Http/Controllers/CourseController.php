<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = Course::query()
            ->where('status', 'published')
            ->with('instructor:id,name', 'category:id,name')
            ->withCount('reviews')
            ->when($request->filled('category'), fn ($q) => $q->where('category_id', $request->integer('category')))
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function show(Course $course): Response
    {
        abort_unless($course->status === 'published', 404);

        $course->load(['instructor:id,name,headline,bio', 'category:id,name', 'sections.lessons']);

        $user = auth()->user();
        $isEnrolled = $user
            ? $course->enrollments()->where('user_id', $user->id)->exists()
            : false;

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'hasActiveSubscription' => $user ? $user->hasAccessToCourse($course) : false,
        ]);
    }
}
