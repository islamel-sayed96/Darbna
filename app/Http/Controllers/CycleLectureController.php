<?php

namespace App\Http\Controllers;

use App\Models\CycleLecture;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CycleLectureController extends Controller
{
    public function show(CycleLecture $cycleLecture): Response|RedirectResponse
    {
        $cycleLecture->load('cycle');
        $cycle = $cycleLecture->cycle;

        abort_unless($cycle->is_published, 404);

        $user = auth()->user();

        if (! $user) {
            return redirect()->route('login', ['redirect' => route('cycles.show', $cycle)])
                ->with('error', 'سجّل دخولك الأول عشان تشوف المحاضرة دي — ممكن يكون عندك صلاحية وصول بالفعل.');
        }

        if (! $user->hasAccessToCycle($cycle)) {
            return redirect()->route('cycles.show', $cycle)
                ->with('success', 'لازم تكون مسجل في السايكل الأول عشان تشوف المحاضرة دي.');
        }

        $lectures = $cycle->lectures()->orderBy('position')->get(['id', 'cycle_id', 'title', 'position']);
        $currentIndex = $lectures->search(fn ($l) => $l->id === $cycleLecture->id);

        return Inertia::render('CycleLectures/Show', [
            'cycle' => $cycle->only('id', 'title', 'slug'),
            'lecture' => $cycleLecture,
            'lectures' => $lectures,
            'currentIndex' => $currentIndex,
        ]);
    }
}
