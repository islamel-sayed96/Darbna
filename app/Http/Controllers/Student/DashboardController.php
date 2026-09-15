<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $enrollments = $user->enrollments()
            ->with('course:id,title,slug,thumbnail_path')
            ->latest('enrolled_at')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments,
            'activeSubscription' => $user->activeSubscription(),
            'certificatesCount' => $user->certificates()->count(),
        ]);
    }
}
