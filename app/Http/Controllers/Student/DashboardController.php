<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\Material;
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

        $cycles = $user->contentAccesses()
            ->where('accessible_type', Cycle::class)
            ->with('accessible')
            ->latest('granted_at')
            ->get()
            ->pluck('accessible')
            ->filter();

        $materials = $user->contentAccesses()
            ->where('accessible_type', Material::class)
            ->with('accessible')
            ->latest('granted_at')
            ->get()
            ->pluck('accessible')
            ->filter();

        return Inertia::render('Student/Dashboard', [
            'enrollments' => $enrollments,
            'cycles' => $cycles->values(),
            'materials' => $materials->values(),
            'activeSubscription' => $user->activeSubscription(),
            'certificatesCount' => $user->certificates()->count(),
        ]);
    }
}
