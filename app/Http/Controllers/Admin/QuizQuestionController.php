<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QuizQuestionController extends Controller
{
    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string'],
            'type' => ['required', 'in:mcq,true_false'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string', 'max:255'],
            'options.*.is_correct' => ['required', 'boolean'],
        ]);

        if (collect($data['options'])->where('is_correct', true)->count() !== 1) {
            return back()
                ->withErrors(['options' => 'لازم تحدد إجابة صحيحة واحدة بالظبط.'])
                ->withInput();
        }

        $question = $quiz->questions()->create([
            'question' => $data['question'],
            'type' => $data['type'],
            'position' => $quiz->questions()->max('position') + 1,
        ]);

        foreach ($data['options'] as $i => $option) {
            $question->options()->create([
                'option_text' => $option['option_text'],
                'is_correct' => $option['is_correct'],
                'position' => $i + 1,
            ]);
        }

        return back()->with('success', 'تمت إضافة السؤال.');
    }

    public function destroy(QuizQuestion $quizQuestion): RedirectResponse
    {
        $quizQuestion->delete();

        return back()->with('success', 'تم حذف السؤال.');
    }
}
