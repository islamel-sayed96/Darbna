<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourseSectionController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        abort_unless($course->instructor_id === auth()->id(), 403);

        $data = $request->validate(['title' => ['required', 'string', 'max:255']]);

        $course->sections()->create([
            'title' => $data['title'],
            'position' => $course->sections()->max('position') + 1,
        ]);

        return back()->with('success', 'تمت إضافة القسم.');
    }

    public function update(Request $request, CourseSection $section): RedirectResponse
    {
        abort_unless($section->course->instructor_id === auth()->id(), 403);

        $data = $request->validate(['title' => ['required', 'string', 'max:255']]);

        $section->update($data);

        return back()->with('success', 'تم تحديث القسم.');
    }

    public function destroy(CourseSection $section): RedirectResponse
    {
        abort_unless($section->course->instructor_id === auth()->id(), 403);

        $section->delete();

        return back()->with('success', 'تم حذف القسم.');
    }
}
