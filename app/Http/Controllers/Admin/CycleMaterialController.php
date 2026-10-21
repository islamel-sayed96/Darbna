<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\CycleMaterial;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CycleMaterialController extends Controller
{
    public function store(Request $request, Cycle $cycle): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:link,material'],
            'title' => ['required_if:type,link', 'nullable', 'string', 'max:255'],
            'url' => ['required_if:type,link', 'nullable', 'url', 'max:500'],
            'material_id' => ['required_if:type,material', 'nullable', 'exists:materials,id'],
        ]);

        if ($data['type'] === 'material') {
            $data['title'] = ($data['title'] ?? null) ?: Material::find($data['material_id'])->title;
            $data['url'] = null;
        } else {
            $data['material_id'] = null;
        }

        $cycle->materialEntries()->create([
            ...$data,
            'position' => $cycle->materialEntries()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة المادة العلمية.');
    }

    public function destroy(CycleMaterial $cycleMaterial): RedirectResponse
    {
        $cycleMaterial->delete();

        return back()->with('success', 'تم حذف المادة العلمية.');
    }
}
