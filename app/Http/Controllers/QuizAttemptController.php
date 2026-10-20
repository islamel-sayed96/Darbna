<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizAttemptController extends Controller
{
    public function create(Quiz $quiz): Response|RedirectResponse
    {
        $material = $this->authorizeAccess($quiz);

        $attemptsCount = $quiz->attempts()->where('user_id', auth()->id())->count();
        $attemptsLeft = $quiz->max_attempts ? max(0, $quiz->max_attempts - $attemptsCount) : null;

        if ($attemptsLeft === 0) {
            return redirect()->route('material-pages.show', $quiz->material_page_id)
                ->with('error', 'خلّصت عدد المحاولات المسموح بيها لهذا الاختبار.');
        }

        $quiz->load(['questions.options:id,question_id,option_text,position']);

        return Inertia::render('Quizzes/Take', [
            'quiz' => $quiz,
            'material' => $material->only('id', 'title', 'slug'),
            'attemptsLeft' => $attemptsLeft,
        ]);
    }

    public function store(Request $request, Quiz $quiz): RedirectResponse
    {
        $this->authorizeAccess($quiz);

        $attemptsCount = $quiz->attempts()->where('user_id', auth()->id())->count();
        if ($quiz->max_attempts && $attemptsCount >= $quiz->max_attempts) {
            return redirect()->route('material-pages.show', $quiz->material_page_id)
                ->with('error', 'خلّصت عدد المحاولات المسموح بيها لهذا الاختبار.');
        }

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'exists:quiz_questions,id'],
            'answers.*.option_id' => ['nullable', 'integer', 'exists:quiz_options,id'],
        ]);

        $questions = $quiz->questions()->with('options')->get();

        $attempt = $quiz->attempts()->create([
            'user_id' => auth()->id(),
            'started_at' => now(),
        ]);

        $correctCount = 0;

        foreach ($data['answers'] as $answer) {
            $question = $questions->firstWhere('id', $answer['question_id']);

            if (! $question) {
                continue;
            }

            $option = ($answer['option_id'] ?? null)
                ? $question->options->firstWhere('id', $answer['option_id'])
                : null;
            $isCorrect = (bool) $option?->is_correct;

            if ($isCorrect) {
                $correctCount++;
            }

            $attempt->answers()->create([
                'question_id' => $question->id,
                'option_id' => $option?->id,
                'is_correct' => $isCorrect,
            ]);
        }

        $score = $questions->count() > 0 ? (int) round($correctCount / $questions->count() * 100) : 0;

        $attempt->update([
            'score' => $score,
            'passed' => $score >= $quiz->passing_score,
            'finished_at' => now(),
        ]);

        return redirect()->route('quiz-attempts.show', $attempt);
    }

    public function show(QuizAttempt $quizAttempt): Response
    {
        abort_unless($quizAttempt->user_id === auth()->id(), 403);

        $quizAttempt->load(['quiz.materialPage.material', 'answers.question.options']);

        return Inertia::render('Quizzes/Result', [
            'attempt' => $quizAttempt,
        ]);
    }

    private function authorizeAccess(Quiz $quiz): Material
    {
        abort_unless($quiz->material_page_id, 404);

        $material = $quiz->materialPage->material;

        abort_unless(auth()->user()->hasAccessToMaterial($material), 403);

        return $material;
    }
}
