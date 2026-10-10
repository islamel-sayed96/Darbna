<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MaterialPageController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $data = $this->validateData($request);

        $material->pages()->create([
            ...$data,
            'position' => $material->pages()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة الصفحة.');
    }

    public function update(Request $request, MaterialPage $materialPage): RedirectResponse
    {
        $materialPage->update($this->validateData($request));

        return back()->with('success', 'تم تحديث الصفحة.');
    }

    public function destroy(MaterialPage $materialPage): RedirectResponse
    {
        $materialPage->delete();

        return back()->with('success', 'تم حذف الصفحة.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);
    }
}
