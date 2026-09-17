<?php

namespace App\Http\Controllers;

use App\Models\LearningPath;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('LearningPaths/Index', [
            'paths' => LearningPath::where('is_published', true)
                ->withCount('publishedCourses as courses_count')
                ->orderBy('position')
                ->orderBy('title')
                ->get(),
        ]);
    }

    public function show(LearningPath $learningPath): Response
    {
        abort_unless($learningPath->is_published, 404);

        $learningPath->load(['publishedCourses.instructor:id,name', 'publishedCourses.category:id,name']);

        return Inertia::render('LearningPaths/Show', [
            'path' => $learningPath,
        ]);
    }
}
