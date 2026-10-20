<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\MaterialPage;
use App\Models\Quiz;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizzesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DatabaseSeeder::class);
    }

    private function makeMaterialPage(array $overrides = []): MaterialPage
    {
        $material = Material::create([
            'title' => 'مادة اختبار '.uniqid(),
            'slug' => 'material-'.uniqid(),
            'price' => 0,
            'is_published' => true,
            ...$overrides,
        ]);

        return $material->pages()->create([
            'title' => 'صفحة',
            'content' => 'محتوى',
            'position' => 1,
        ]);
    }

    private function makeQuizWithQuestion(MaterialPage $page, array $quizOverrides = []): Quiz
    {
        $quiz = $page->quiz()->create([
            'title' => 'اختبار الصفحة',
            'passing_score' => 50,
            ...$quizOverrides,
        ]);

        $question = $quiz->questions()->create([
            'question' => '2 + 2 = ؟',
            'type' => 'mcq',
            'position' => 1,
        ]);

        $correct = $question->options()->create(['option_text' => '4', 'is_correct' => true, 'position' => 1]);
        $question->options()->create(['option_text' => '5', 'is_correct' => false, 'position' => 2]);

        return $quiz->refresh();
    }

    public function test_admin_can_create_a_quiz_with_a_question(): void
    {
        $admin = User::role('admin')->first();
        $page = $this->makeMaterialPage();

        $this->actingAs($admin)->post(route('admin.material-pages.quiz.store', $page), [
            'title' => 'اختبار تجريبي',
            'passing_score' => 60,
        ])->assertRedirect();

        $quiz = Quiz::where('material_page_id', $page->id)->firstOrFail();

        $this->actingAs($admin)->post(route('admin.quiz-questions.store', $quiz), [
            'question' => 'ما هي عاصمة مصر؟',
            'type' => 'mcq',
            'options' => [
                ['option_text' => 'القاهرة', 'is_correct' => true],
                ['option_text' => 'الإسكندرية', 'is_correct' => false],
            ],
        ])->assertRedirect();

        $this->assertSame(1, $quiz->questions()->count());
        $this->actingAs($admin)->get(route('admin.material-pages.quiz.edit', $page))->assertOk();
    }

    public function test_admin_question_creation_requires_exactly_one_correct_option(): void
    {
        $admin = User::role('admin')->first();
        $page = $this->makeMaterialPage();
        $quiz = $page->quiz()->create(['title' => 'اختبار', 'passing_score' => 50]);

        $this->actingAs($admin)->post(route('admin.quiz-questions.store', $quiz), [
            'question' => 'سؤال',
            'type' => 'mcq',
            'options' => [
                ['option_text' => 'أ', 'is_correct' => false],
                ['option_text' => 'ب', 'is_correct' => false],
            ],
        ])->assertSessionHasErrors('options');

        $this->assertSame(0, $quiz->questions()->count());
    }

    public function test_student_without_access_cannot_take_the_quiz(): void
    {
        $student = User::role('student')->first();
        $page = $this->makeMaterialPage(['price' => 49]);
        $quiz = $this->makeQuizWithQuestion($page);

        $this->actingAs($student)->get(route('quizzes.take', $quiz))->assertForbidden();
    }

    public function test_student_can_take_and_pass_the_quiz(): void
    {
        $student = User::role('student')->first();
        $page = $this->makeMaterialPage();
        $quiz = $this->makeQuizWithQuestion($page);

        $this->actingAs($student)->get(route('quizzes.take', $quiz))->assertOk();

        $correctOption = $quiz->questions()->first()->options()->where('is_correct', true)->first();

        $response = $this->actingAs($student)->post(route('quiz-attempts.store', $quiz), [
            'answers' => [
                ['question_id' => $quiz->questions()->first()->id, 'option_id' => $correctOption->id],
            ],
        ]);

        $response->assertRedirect();
        $attempt = $quiz->attempts()->where('user_id', $student->id)->firstOrFail();
        $this->assertSame(100, $attempt->score);
        $this->assertTrue($attempt->passed);

        $this->actingAs($student)->get(route('quiz-attempts.show', $attempt))->assertOk();
    }

    public function test_student_fails_the_quiz_with_a_wrong_answer(): void
    {
        $student = User::role('student')->first();
        $page = $this->makeMaterialPage();
        $quiz = $this->makeQuizWithQuestion($page);
        $wrongOption = $quiz->questions()->first()->options()->where('is_correct', false)->first();

        $this->actingAs($student)->post(route('quiz-attempts.store', $quiz), [
            'answers' => [
                ['question_id' => $quiz->questions()->first()->id, 'option_id' => $wrongOption->id],
            ],
        ]);

        $attempt = $quiz->attempts()->where('user_id', $student->id)->firstOrFail();
        $this->assertSame(0, $attempt->score);
        $this->assertFalse($attempt->passed);
    }

    public function test_student_cannot_exceed_max_attempts(): void
    {
        $student = User::role('student')->first();
        $page = $this->makeMaterialPage();
        $quiz = $this->makeQuizWithQuestion($page, ['max_attempts' => 1]);
        $wrongOption = $quiz->questions()->first()->options()->where('is_correct', false)->first();

        $this->actingAs($student)->post(route('quiz-attempts.store', $quiz), [
            'answers' => [
                ['question_id' => $quiz->questions()->first()->id, 'option_id' => $wrongOption->id],
            ],
        ]);

        $this->actingAs($student)->get(route('quizzes.take', $quiz))
            ->assertRedirect(route('material-pages.show', $page));

        $this->assertSame(1, $quiz->attempts()->where('user_id', $student->id)->count());
    }

    public function test_another_student_cannot_view_someone_elses_attempt_result(): void
    {
        $students = User::role('student')->get();
        if ($students->count() < 2) {
            User::factory()->count(2)->create()->each(fn ($u) => $u->assignRole('student'));
            $students = User::role('student')->get();
        }

        [$owner, $other] = [$students[0], $students[1]];
        $page = $this->makeMaterialPage();
        $quiz = $this->makeQuizWithQuestion($page);

        $attempt = $quiz->attempts()->create([
            'user_id' => $owner->id,
            'score' => 100,
            'passed' => true,
            'started_at' => now(),
            'finished_at' => now(),
        ]);

        $this->actingAs($other)->get(route('quiz-attempts.show', $attempt))->assertForbidden();
    }
}
