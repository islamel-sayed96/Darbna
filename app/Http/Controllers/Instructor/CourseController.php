<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = auth()->user()->coursesTaught()
            ->with('category:id,name')
            ->withCount('enrollments')
            ->latest()
            ->get();

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Instructor/Courses/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $course = auth()->user()->coursesTaught()->create([
            ...$data,
            'slug' => $this->uniqueSlug($data['title']),
            'status' => 'draft',
        ]);

        return redirect()->route('instructor.courses.edit', $course)
            ->with('success', 'تم إنشاء الكورس كمسودة. أضف الأقسام والدروس ثم أرسله للمراجعة.');
    }

    public function edit(Course $course): Response
    {
        $this->authorizeOwner($course);

        $course->load('sections.lessons');

        return Inertia::render('Instructor/Courses/Edit', [
            'course' => $course,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeOwner($course);

        $data = $this->validateData($request);

        $course->update($data);

        return back()->with('success', 'تم حفظ التعديلات.');
    }

    public function submit(Course $course): RedirectResponse
    {
        $this->authorizeOwner($course);

        abort_if($course->sections()->doesntExist(), 422, 'أضف قسم ودرس واحد على الأقل قبل إرسال الكورس للمراجعة.');

        $course->update([
            'status' => 'pending_review',
            'submitted_at' => now(),
            'rejection_reason' => null,
        ]);

        return back()->with('success', 'تم إرسال الكورس للمراجعة، هيتراجع من فريق الإدارة قريبًا.');
    }

    private function authorizeOwner(Course $course): void
    {
        abort_unless($course->instructor_id === auth()->id(), 403);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_free' => ['boolean'],
            'level' => [Rule::in(['beginner', 'intermediate', 'advanced'])],
            'language' => ['nullable', 'string', 'max:10'],
        ]);
    }

    private function uniqueSlug(string $title): string
    {
        $slug = Str::slug($title) ?: Str::random(8);
        $original = $slug;
        $i = 1;

        while (Course::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
