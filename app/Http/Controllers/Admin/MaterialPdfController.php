<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Smalot\PdfParser\Parser;

class MaterialPdfController extends Controller
{
    public function store(Request $request, Material $material): RedirectResponse
    {
        $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:20480'],
        ]);

        try {
            $pdfPages = (new Parser)->parseFile($request->file('pdf')->getRealPath())->getPages();
        } catch (\Exception) {
            return back()->with('error', 'معرفنا نقرا الملف ده، تأكد إنه ملف PDF سليم.');
        }

        $position = (int) $material->pages()->max('position');
        $createdCount = 0;

        foreach ($pdfPages as $index => $pdfPage) {
            $text = trim($pdfPage->getText());

            if ($text === '') {
                continue;
            }

            $material->pages()->create([
                'title' => 'صفحة '.($index + 1),
                'content' => $text,
                'position' => ++$position,
            ]);

            $createdCount++;
        }

        if ($createdCount === 0) {
            return back()->with('error', 'معرفنا نستخرج نص من الملف ده — جرّب ملف PDF فيه نص مكتوب مش صور بس.');
        }

        return back()->with('success', "تم استخراج {$createdCount} صفحة من الملف وإضافتها للمادة.");
    }
}
