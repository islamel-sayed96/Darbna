<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LearningPath;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/LearningPaths/Index', [
            'paths' => LearningPath::withCount('courses')->orderBy('position')->orderBy('title')->get(),
        ]);
    }

    public function show(LearningPath $learningPath): Response
    {
        $learningPath->load('courses:id,title,learning_path_id,status,instructor_id');
        $learningPath->load('courses.instructor:id,name');

        return Inertia::render('Admin/LearningPaths/Show', [
            'path' => $learningPath,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        LearningPath::create([
            ...$data,
            'slug' => $this->uniqueSlug($data['title']),
        ]);

        return back()->with('success', 'تم إنشاء المسار.');
    }

    public function update(Request $request, LearningPath $learningPath): RedirectResponse
    {
        $learningPath->update($this->validateData($request));

        return back()->with('success', 'تم تحديث المسار.');
    }

    public function destroy(LearningPath $learningPath): RedirectResponse
    {
        $learningPath->courses()->update(['learning_path_id' => null]);
        $learningPath->delete();

        return redirect()->route('admin.learning-paths.index')->with('success', 'تم حذف المسار.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_published' => ['boolean'],
        ]);
    }

    private function uniqueSlug(string $title): string
    {
        $slug = Str::slug($title) ?: Str::random(8);
        $original = $slug;
        $i = 1;

        while (LearningPath::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
