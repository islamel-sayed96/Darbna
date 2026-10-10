<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use Inertia\Inertia;
use Inertia\Response;

class CycleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Cycles/Index', [
            'cycles' => Cycle::where('is_published', true)
                ->with('category:id,name')
                ->latest('published_at')
                ->get(),
        ]);
    }

    public function show(Cycle $cycle): Response
    {
        abort_unless($cycle->is_published, 404);

        $cycle->load('category:id,name', 'lectures:id,cycle_id,title,position');

        $user = auth()->user();

        return Inertia::render('Cycles/Show', [
            'cycle' => $cycle,
            'hasAccess' => $user ? $user->hasAccessToCycle($cycle) : false,
        ]);
    }
}
