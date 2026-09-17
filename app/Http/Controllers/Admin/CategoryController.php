<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('courses')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Category::create([
            'name' => $data['name'],
            'slug' => $this->uniqueSlug($data['name']),
        ]);

        return back()->with('success', 'تمت إضافة التصنيف.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $category->update(['name' => $data['name']]);

        return back()->with('success', 'تم تحديث التصنيف.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        abort_if($category->courses()->exists(), 422, 'مينفعش تحذف تصنيف مرتبط بكورسات — انقل الكورسات لتصنيف تاني الأول.');

        $category->delete();

        return back()->with('success', 'تم حذف التصنيف.');
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name) ?: Str::random(8);
        $original = $slug;
        $i = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
