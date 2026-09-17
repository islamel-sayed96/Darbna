<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\LearningPath;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * The stats bar only goes live once the platform has real numbers to
     * show — showing "0 learners" undercuts trust more than showing nothing.
     */
    private const MIN_STUDENTS_FOR_STATS = 500;

    public function index(): Response
    {
        // whereHas (not the role() scope) so a fresh database with no
        // "student" role row yet just counts zero instead of throwing.
        $studentsCount = User::whereHas('roles', fn ($q) => $q->where('name', 'student'))->count();
        $showStats = $studentsCount >= self::MIN_STUDENTS_FOR_STATS;

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'categories' => Category::withCount('courses')->orderBy('name')->limit(8)->get(),
            'learningPaths' => LearningPath::where('is_published', true)
                ->withCount('publishedCourses as courses_count')
                ->orderBy('position')
                ->limit(3)
                ->get(),
            'stats' => $showStats ? [
                'students' => $studentsCount,
                'courses' => Course::where('status', 'published')->count(),
                'certificates' => Certificate::count(),
                'watchMinutes' => (int) round(LessonProgress::sum('watched_seconds') / 60),
            ] : null,
        ]);
    }
}
