<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'students' => User::role('student')->count(),
                'instructors' => User::role('instructor')->count(),
                'publishedCourses' => Course::where('status', 'published')->count(),
                'pendingCourses' => Course::where('status', 'pending_review')->count(),
                'activeSubscriptions' => Subscription::where('status', 'active')->where('ends_at', '>', now())->count(),
                'totalRevenue' => Payment::where('status', 'paid')->sum('amount'),
            ],
        ]);
    }
}
