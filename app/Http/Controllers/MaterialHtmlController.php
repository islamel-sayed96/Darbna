<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class MaterialHtmlController extends Controller
{
    public function show(Material $material, string $path = 'index.html'): BinaryFileResponse|RedirectResponse
    {
        abort_unless($material->is_published, 404);
        abort_unless($material->html_path, 404);

        $user = auth()->user();

        if (! $user) {
            return redirect()->route('login', ['redirect' => route('materials.show', $material)])
                ->with('error', 'سجّل دخولك الأول عشان تشوف المادة دي — ممكن يكون عندك صلاحية وصول بالفعل.');
        }

        abort_unless($user->hasAccessToMaterial($material), 403);

        $disk = Storage::disk('local');
        $relative = $material->html_path.'/'.ltrim($path, '/');

        $root = realpath($disk->path($material->html_path));
        $target = realpath($disk->path($relative));

        abort_unless($root && $target && str_starts_with($target, $root), 404);
        abort_unless(is_file($target), 404);

        return response()->file($target);
    }
}
