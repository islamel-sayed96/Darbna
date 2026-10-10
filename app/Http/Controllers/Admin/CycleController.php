<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Cycle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CycleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Cycles/Index', [
            'cycles' => Cycle::query()
                ->with('category:id,name')
                ->withCount('lectures')
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Cycles/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $cycle = Cycle::create([
            ...$data,
            'slug' => $this->uniqueSlug($data['title']),
        ]);

        return redirect()->route('admin.cycles.edit', $cycle)
            ->with('success', 'تم إنشاء السايكل. أضف المحاضرات ثم انشره.');
    }

    public function edit(Cycle $cycle): Response
    {
        $cycle->load('lectures');

        return Inertia::render('Admin/Cycles/Edit', [
            'cycle' => $cycle,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Cycle $cycle): RedirectResponse
    {
        $data = $this->validateData($request);

        if (($data['is_published'] ?? false) && ! $cycle->published_at) {
            $data['published_at'] = now();
        }

        $cycle->update($data);

        return back()->with('success', 'تم حفظ التعديلات.');
    }

    public function destroy(Cycle $cycle): RedirectResponse
    {
        $cycle->delete();

        return redirect()->route('admin.cycles.index')->with('success', 'تم حذف السايكل.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
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

        while (Cycle::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
