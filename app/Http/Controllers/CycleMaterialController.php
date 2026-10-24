<?php

namespace App\Http\Controllers;

use App\Models\CycleMaterial;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CycleMaterialController extends Controller
{
    public function show(CycleMaterial $cycleMaterial): BinaryFileResponse
    {
        abort_unless($cycleMaterial->type === CycleMaterial::TYPE_PDF, 404);

        $cycle = $cycleMaterial->cycle;
        $user = auth()->user();

        abort_unless($user && $user->hasAccessToCycle($cycle), 403);
        abort_unless($cycleMaterial->file_path && Storage::disk('local')->exists($cycleMaterial->file_path), 404);

        return response()->file(
            Storage::disk('local')->path($cycleMaterial->file_path),
            ['Content-Disposition' => 'inline; filename="'.addslashes($cycleMaterial->title).'.pdf"'],
        );
    }
}
