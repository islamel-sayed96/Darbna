<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Materials/Index', [
            'materials' => Material::query()
                ->with('category:id,name', 'course:id,title')
                ->withCount('pages')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Materials/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'courses' => Course::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $material = Material::create([
            ...$data,
            'slug' => $this->uniqueSlug($data['title']),
        ]);

        return redirect()->route('admin.materials.edit', $material)
            ->with('success', 'تم إنشاء المادة العلمية. أضف الصفحات ثم انشرها.');
    }

    public function edit(Material $material): Response
    {
        $material->load('pages');

        return Inertia::render('Admin/Materials/Edit', [
            'material' => $material,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'courses' => Course::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function update(Request $request, Material $material): RedirectResponse
    {
        $data = $this->validateData($request);

        if (($data['is_published'] ?? false) && ! $material->published_at) {
            $data['published_at'] = now();
        }

        $material->update($data);

        return back()->with('success', 'تم حفظ التعديلات.');
    }

    public function destroy(Material $material): RedirectResponse
    {
        $material->delete();

        return redirect()->route('admin.materials.index')->with('success', 'تم حذف المادة العلمية.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'course_id' => ['nullable', 'exists:courses,id'],
            'instructor_id' => ['nullable', 'exists:users,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_published' => ['boolean'],
        ]);
    }

    private function uniqueSlug(string $title): string
    {
        $slug = Str::slug($title) ?: Str::random(8);
        $original = $slug;
        $i = 1;

        while (Material::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
