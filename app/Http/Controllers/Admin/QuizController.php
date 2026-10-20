<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialPage;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function edit(MaterialPage $materialPage): Response
    {
        $materialPage->load('material', 'quiz.questions.options');

        return Inertia::render('Admin/Quizzes/Edit', [
            'materialPage' => $materialPage,
        ]);
    }

    public function store(Request $request, MaterialPage $materialPage): RedirectResponse
    {
        $materialPage->quiz()->create($this->validateData($request));

        return redirect()->route('admin.material-pages.quiz.edit', $materialPage)
            ->with('success', 'تم إنشاء الاختبار. دلوقتي ضيف الأسئلة.');
    }

    public function update(Request $request, Quiz $quiz): RedirectResponse
    {
        $quiz->update($this->validateData($request));

        return back()->with('success', 'تم حفظ إعدادات الاختبار.');
    }

    public function destroy(Quiz $quiz): RedirectResponse
    {
        $materialPage = $quiz->materialPage;
        $quiz->delete();

        return redirect()->route('admin.material-pages.quiz.edit', $materialPage)
            ->with('success', 'تم حذف الاختبار.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'max_attempts' => ['nullable', 'integer', 'min:1'],
        ]);
    }
}
