import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Take({ quiz, material, attemptsLeft }) {
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const choose = (questionId, optionId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(
            route('quiz-attempts.store', quiz.id),
            {
                answers: quiz.questions.map((q) => ({
                    question_id: q.id,
                    option_id: answers[q.id] ?? null,
                })),
            },
            { onFinish: () => setSubmitting(false) },
        );
    };

    return (
        <SiteLayout>
            <Head title={quiz.title} />

            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <Link
                    href={route('material-pages.show', quiz.material_page_id)}
                    className="text-sm text-brand-600 hover:underline"
                >
                    &larr; الرجوع للمادة: {material.title}
                </Link>

                <div className="mt-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {quiz.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        درجة النجاح: {quiz.passing_score}%
                        {quiz.time_limit_minutes &&
                            ` — المدة: ${quiz.time_limit_minutes} دقيقة`}
                        {attemptsLeft !== null &&
                            ` — محاولات متبقية: ${attemptsLeft}`}
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-6">
                        {quiz.questions.map((question, index) => (
                            <div
                                key={question.id}
                                className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {index + 1}. {question.question}
                                </p>
                                <div className="mt-3 space-y-2">
                                    {question.options.map((option) => (
                                        <label
                                            key={option.id}
                                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                checked={
                                                    answers[question.id] ===
                                                    option.id
                                                }
                                                onChange={() =>
                                                    choose(
                                                        question.id,
                                                        option.id,
                                                    )
                                                }
                                            />
                                            {option.option_text}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                        >
                            {submitting ? 'جاري التسليم...' : 'تسليم الاختبار'}
                        </button>
                    </form>
                </div>
            </div>
        </SiteLayout>
    );
}
