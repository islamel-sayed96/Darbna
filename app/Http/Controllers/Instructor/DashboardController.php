<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $instructor = auth()->user();

        $courses = $instructor->coursesTaught()->withCount('enrollments')->latest()->get();

        return Inertia::render('Instructor/Dashboard', [
            'courses' => $courses,
            'stats' => [
                'totalCourses' => $courses->count(),
                'publishedCourses' => $courses->where('status', 'published')->count(),
                'pendingCourses' => $courses->where('status', 'pending_review')->count(),
                'totalStudents' => Enrollment::whereIn('course_id', $courses->pluck('id'))->distinct('user_id')->count('user_id'),
            ],
        ]);
    }
}
