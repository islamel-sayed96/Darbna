<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Materials/Index', [
            'materials' => Material::where('is_published', true)
                ->with('category:id,name')
                ->latest('published_at')
                ->get(),
        ]);
    }

    public function show(Material $material): Response
    {
        abort_unless($material->is_published, 404);

        $material->load('category:id,name', 'course:id,title,slug', 'pages:id,material_id,title,position');

        $user = auth()->user();

        return Inertia::render('Materials/Show', [
            'material' => $material,
            'hasAccess' => $user ? $user->hasAccessToMaterial($material) : false,
        ]);
    }
}
