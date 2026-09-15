<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\CourseSection;
use App\Models\Lesson;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LessonController extends Controller
{
    public function store(Request $request, CourseSection $section): RedirectResponse
    {
        abort_unless($section->course->instructor_id === auth()->id(), 403);

        $data = $this->withVideoProvider($this->validateData($request));

        $section->lessons()->create([
            ...$data,
            'position' => $section->lessons()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة الدرس.');
    }

    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->section->course->instructor_id === auth()->id(), 403);

        $lesson->update($this->withVideoProvider($this->validateData($request)));

        return back()->with('success', 'تم تحديث الدرس.');
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->section->course->instructor_id === auth()->id(), 403);

        $lesson->delete();

        return back()->with('success', 'تم حذف الدرس.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => [Rule::in(['video', 'text', 'quiz', 'live'])],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'duration_seconds' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['boolean'],
        ]);
    }

    /**
     * Video hosting is YouTube (unlisted) for now to keep the platform free
     * during development — swappable for Bunny.net/Cloudflare Stream later
     * without a schema change, since we already store provider + id.
     */
    private function withVideoProvider(array $data): array
    {
        if (($data['type'] ?? null) === 'video' && ! empty($data['video_url'])) {
            $data['video_provider'] = 'youtube';
            $data['video_id'] = Lesson::extractYoutubeId($data['video_url']);
        }

        return $data;
    }
}
