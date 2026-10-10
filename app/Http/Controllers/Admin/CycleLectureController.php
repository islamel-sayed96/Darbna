<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Models\CycleLecture;
use App\Support\VideoUrl;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CycleLectureController extends Controller
{
    public function store(Request $request, Cycle $cycle): RedirectResponse
    {
        $data = $this->withVideoProvider($this->validateData($request));

        $cycle->lectures()->create([
            ...$data,
            'position' => $cycle->lectures()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة المحاضرة.');
    }

    public function update(Request $request, CycleLecture $cycleLecture): RedirectResponse
    {
        $cycleLecture->update($this->withVideoProvider($this->validateData($request)));

        return back()->with('success', 'تم تحديث المحاضرة.');
    }

    public function destroy(CycleLecture $cycleLecture): RedirectResponse
    {
        $cycleLecture->delete();

        return back()->with('success', 'تم حذف المحاضرة.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'video_url' => ['required', 'string', 'max:500'],
        ]);
    }

    private function withVideoProvider(array $data): array
    {
        $data['video_provider'] = 'youtube';
        $data['video_id'] = VideoUrl::extractYoutubeId($data['video_url']);

        return $data;
    }
}
