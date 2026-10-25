<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\CycleMaterial;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CycleMaterialController extends Controller
{
    public function store(Request $request, Cycle $cycle): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:link,material,pdf'],
            'title' => ['required_if:type,link,pdf', 'nullable', 'string', 'max:255'],
            'url' => ['required_if:type,link', 'nullable', 'url', 'max:500'],
            'material_id' => ['required_if:type,material', 'nullable', 'exists:materials,id'],
            'pdf' => ['required_if:type,pdf', 'nullable', 'file', 'mimes:pdf', 'max:102400'],
        ]);

        $data['material_id'] = null;
        $data['url'] = null;
        $data['file_path'] = null;

        if ($data['type'] === 'material') {
            $data['material_id'] = $request->input('material_id');
            $data['title'] = ($data['title'] ?? null) ?: Material::find($data['material_id'])->title;
        } elseif ($data['type'] === 'pdf') {
            $data['file_path'] = $request->file('pdf')->store('cycle-materials/'.$cycle->id, 'local');
        } else {
            $data['url'] = $request->input('url');
        }

        unset($data['pdf']);

        $cycle->materialEntries()->create([
            ...$data,
            'position' => $cycle->materialEntries()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة المادة العلمية.');
    }

    public function destroy(CycleMaterial $cycleMaterial): RedirectResponse
    {
        if ($cycleMaterial->file_path) {
            Storage::disk('local')->delete($cycleMaterial->file_path);
        }

        $cycleMaterial->delete();

        return back()->with('success', 'تم حذف المادة العلمية.');
    }
}
