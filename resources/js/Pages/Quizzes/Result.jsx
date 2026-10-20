import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Result({ attempt }) {
    const { quiz } = attempt;
    const material = quiz.material_page.material;

    return (
        <SiteLayout>
            <Head title={`نتيجة: ${quiz.title}`} />

            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                <Link
                    href={route('material-pages.show', quiz.material_page_id)}
                    className="text-sm text-brand-600 hover:underline"
                >
                    &larr; الرجوع للمادة: {material.title}
                </Link>

                <div className="mt-4 rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
                    <p
                        className={`text-4xl font-bold ${
                            attempt.passed
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}
                    >
                        {attempt.score}%
                    </p>
                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {attempt.passed ? 'مبروك، نجحت في الاختبار!' : 'للأسف محتاج تحاول تاني.'}
                    </p>
                    <p className="text-sm text-gray-500">
                        درجة النجاح المطلوبة: {quiz.passing_score}%
                    </p>

                    {!attempt.passed && (
                        <Link
                            href={route('quizzes.take', quiz.id)}
                            className="mt-4 inline-block rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            أعد المحاولة
                        </Link>
                    )}
                </div>

                <div className="mt-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                        مراجعة الإجابات
                    </h2>

                    <ul className="space-y-4">
                        {attempt.answers.map((answer, index) => (
                            <li key={answer.id}>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {index + 1}. {answer.question.question}
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {answer.question.options.map((option) => {
                                        const isChosen =
                                            option.id === answer.option_id;
                                        const isCorrect = option.is_correct;

                                        return (
                                            <li
                                                key={option.id}
                                                className={`text-sm ${
                                                    isCorrect
                                                        ? 'font-semibold text-green-700 dark:text-green-400'
                                                        : isChosen
                                                          ? 'font-semibold text-red-600 dark:text-red-400'
                                                          : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {isCorrect
                                                    ? '✓ '
                                                    : isChosen
                                                      ? '✗ '
                                                      : '- '}
                                                {option.option_text}
                                                {isChosen &&
                                                    !isCorrect &&
                                                    ' (إجابتك)'}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </SiteLayout>
    );
}
