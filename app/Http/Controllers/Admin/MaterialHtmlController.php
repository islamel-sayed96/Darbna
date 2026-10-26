<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class MaterialHtmlController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'extensions:html,htm,zip', 'max:102400'],
        ]);

        $uploaded = $request->file('file');
        $extension = strtolower($uploaded->getClientOriginalExtension());
        $disk = Storage::disk('local');
        $dir = 'materials-html/'.$material->id;

        if ($material->html_path) {
            $disk->deleteDirectory($material->html_path);
        }
        $disk->deleteDirectory($dir);
        $disk->makeDirectory($dir);

        if ($extension === 'zip') {
            $zip = new ZipArchive;

            if ($zip->open($uploaded->getRealPath()) !== true) {
                $disk->deleteDirectory($dir);

                return back()->withErrors(['file' => 'الملف ده مش أرشيف ZIP سليم.']);
            }

            $zip->extractTo($disk->path($dir));
            $zip->close();

            $this->flattenSingleTopLevelDirectory($disk->path($dir));

            if (! $disk->exists($dir.'/index.html')) {
                $disk->deleteDirectory($dir);

                return back()->withErrors(['file' => 'ملف الـ ZIP لازم يحتوي على index.html في الجذر (أو جوه فولدر واحد بس).']);
            }
        } else {
            $uploaded->storeAs($dir, 'index.html', 'local');
        }

        $material->update(['html_path' => $dir]);

        return back()->with('success', 'تم رفع الصفحة التفاعلية. أي رفع جديد هيستبدلها بالكامل.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        if ($material->html_path) {
            Storage::disk('local')->deleteDirectory($material->html_path);
            $material->update(['html_path' => null]);
        }

        return back()->with('success', 'تم حذف الصفحة التفاعلية.');
    }

    /**
     * Zipping a folder commonly wraps everything in one top-level directory
     * matching the folder's name (project/index.html, project/style.css…).
     * If that's all we extracted, lift its contents up to the material's
     * own root so index.html ends up directly where we expect it.
     */
    private function flattenSingleTopLevelDirectory(string $absoluteDir): void
    {
        $entries = array_values(array_filter(
            scandir($absoluteDir) ?: [],
            fn (string $name) => ! in_array($name, ['.', '..', '__MACOSX'], true) && ! str_starts_with($name, '.'),
        ));

        if (count($entries) !== 1 || ! is_dir($absoluteDir.'/'.$entries[0])) {
            return;
        }

        $nested = $absoluteDir.'/'.$entries[0];

        foreach (scandir($nested) ?: [] as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            rename($nested.'/'.$item, $absoluteDir.'/'.$item);
        }

        rmdir($nested);
    }
}
