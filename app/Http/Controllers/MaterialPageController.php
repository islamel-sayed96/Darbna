<?php

namespace App\Http\Controllers;

use App\Models\MaterialPage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MaterialPageController extends Controller
{
    public function show(MaterialPage $materialPage): Response|RedirectResponse
    {
        $materialPage->load('material');
        $material = $materialPage->material;

        abort_unless($material->is_published, 404);

        $user = auth()->user();

        if (! $user || ! $user->hasAccessToMaterial($material)) {
            return redirect()->route('materials.show', $material)
                ->with('success', 'لازم تشتري المادة العلمية الأول عشان تشوف الصفحة دي.');
        }

        $pages = $material->pages()->orderBy('position')->get(['id', 'title', 'position']);
        $currentIndex = $pages->search(fn ($p) => $p->id === $materialPage->id);

        return Inertia::render('MaterialPages/Show', [
            'material' => $material->only('id', 'title', 'slug'),
            'page' => $materialPage,
            'pages' => $pages,
            'currentIndex' => $currentIndex,
        ]);
    }
}
