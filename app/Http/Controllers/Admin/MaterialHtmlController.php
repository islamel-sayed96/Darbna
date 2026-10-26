<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialHtmlController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $request->validate([
            'html' => ['required', 'file', 'extensions:html,htm', 'max:20480'],
        ]);

        if ($material->html_path) {
            Storage::disk('local')->delete($material->html_path);
        }

        $path = $request->file('html')->storeAs(
            'materials-html',
            $material->id.'-'.now()->timestamp.'.html',
            'local',
        );

        $material->update(['html_path' => $path]);

        return back()->with('success', 'تم رفع الصفحة التفاعلية. أي رفع جديد هيستبدلها.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        if ($material->html_path) {
            Storage::disk('local')->delete($material->html_path);
            $material->update(['html_path' => null]);
        }

        return back()->with('success', 'تم حذف الصفحة التفاعلية.');
    }
}
