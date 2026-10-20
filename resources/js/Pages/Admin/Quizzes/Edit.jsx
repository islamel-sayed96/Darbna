import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function QuizMetaForm({ materialPage, quiz }) {
    const isCreate = !quiz;
    const { data, setData, post, put, processing, errors } = useForm({
        title: quiz?.title ?? '',
        passing_score: quiz?.passing_score ?? 70,
        time_limit_minutes: quiz?.time_limit_minutes ?? '',
        max_attempts: quiz?.max_attempts ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isCreate) {
            post(route('admin.material-pages.quiz.store', materialPage.id));
        } else {
            put(route('admin.quizzes.update', quiz.id));
        }
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
        >
            <h3 className="font-semibold text-gray-900 dark:text-white">
                {isCreate ? 'إنشاء اختبار للصفحة' : 'إعدادات الاختبار'}
            </h3>

            <div>
                <InputLabel htmlFor="title" value="عنوان الاختبار" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <InputLabel
                        htmlFor="passing_score"
                        value="درجة النجاح %"
                    />
                    <TextInput
                        id="passing_score"
                        type="number"
                        min="0"
                        max="100"
                        className="mt-1 block w-full"
                        value={data.passing_score}
                        onChange={(e) =>
                            setData('passing_score', e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="time_limit_minutes"
                        value="مدة الاختبار (دقيقة)"
                    />
                    <TextInput
                        id="time_limit_minutes"
                        type="number"
                        min="1"
                        className="mt-1 block w-full"
                        placeholder="بدون حد"
                        value={data.time_limit_minutes}
                        onChange={(e) =>
                            setData('time_limit_minutes', e.target.value)
                        }
                    />
                </div>
                <div>
                    <InputLabel
                        htmlFor="max_attempts"
                        value="عدد المحاولات المسموح بيها"
                    />
                    <TextInput
                        id="max_attempts"
                        type="number"
                        min="1"
                        className="mt-1 block w-full"
                        placeholder="بدون حد"
                        value={data.max_attempts}
                        onChange={(e) =>
                            setData('max_attempts', e.target.value)
                        }
                    />
                </div>
            </div>

            <PrimaryButton disabled={processing}>
                {isCreate ? 'إنشاء الاختبار' : 'حفظ الإعدادات'}
            </PrimaryButton>
        </form>
    );
}

function AddQuestionForm({ quiz }) {
    const [question, setQuestion] = useState('');
    const [type, setType] = useState('mcq');
    const [options, setOptions] = useState([
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
    ]);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const updateOptionText = (index, text) => {
        setOptions((prev) =>
            prev.map((o, i) =>
                i === index ? { ...o, option_text: text } : o,
            ),
        );
    };

    const markCorrect = (index) => {
        setOptions((prev) =>
            prev.map((o, i) => ({ ...o, is_correct: i === index })),
        );
    };

    const addOption = () => {
        setOptions((prev) => [...prev, { option_text: '', is_correct: false }]);
    };

    const removeOption = (index) => {
        setOptions((prev) => prev.filter((_, i) => i !== index));
    };

    const switchType = (newType) => {
        setType(newType);
        if (newType === 'true_false') {
            setOptions([
                { option_text: 'صحيح', is_correct: false },
                { option_text: 'خطأ', is_correct: false },
            ]);
        } else {
            setOptions([
                { option_text: '', is_correct: false },
                { option_text: '', is_correct: false },
            ]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setError('');

        if (!question.trim()) return;
        if (options.length < 2 || options.some((o) => !o.option_text.trim())) {
            setError('لازم كل الخيارات تكون متكتوبة.');
            return;
        }
        if (!options.some((o) => o.is_correct)) {
            setError('لازم تحدد الإجابة الصحيحة.');
            return;
        }

        setProcessing(true);
        router.post(
            route('admin.quiz-questions.store', quiz.id),
            { question, type, options },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setQuestion('');
                    switchType('mcq');
                },
                onError: (errors) => setError(errors.options ?? ''),
            },
        );
    };

    return (
        <form
            onSubmit={submit}
            className="mt-4 space-y-3 rounded-md border border-dashed border-gray-300 p-4 dark:border-gray-600"
        >
            <textarea
                rows={2}
                className="block w-full rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="نص السؤال..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        checked={type === 'mcq'}
                        onChange={() => switchType('mcq')}
                    />
                    اختيار من متعدد
                </label>
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        checked={type === 'true_false'}
                        onChange={() => switchType('true_false')}
                    />
                    صح / خطأ
                </label>
            </div>

            <div className="space-y-2">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="correct_option"
                            checked={option.is_correct}
                            onChange={() => markCorrect(index)}
                            title="الإجابة الصحيحة"
                        />
                        <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            placeholder={`خيار ${index + 1}`}
                            value={option.option_text}
                            disabled={type === 'true_false'}
                            onChange={(e) =>
                                updateOptionText(index, e.target.value)
                            }
                        />
                        {type === 'mcq' && options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-xs text-red-600 hover:underline"
                            >
                                حذف
                            </button>
                        )}
                    </div>
                ))}

                {type === 'mcq' && (
                    <button
                        type="button"
                        onClick={addOption}
                        className="text-xs text-brand-600 hover:underline"
                    >
                        + إضافة خيار
                    </button>
                )}
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={processing}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                + إضافة السؤال
            </button>
        </form>
    );
}

export default function Edit({ materialPage }) {
    const quiz = materialPage.quiz;

    const deleteQuiz = () => {
        if (!confirm('تحذف الاختبار ده بكل أسئلته؟')) return;
        router.delete(route('admin.quizzes.destroy', quiz.id));
    };

    const deleteQuestion = (questionId) => {
        if (!confirm('تحذف السؤال ده؟')) return;
        router.delete(route('admin.quiz-questions.destroy', questionId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    اختبار صفحة: {materialPage.title}
                </h2>
            }
        >
            <Head title={`اختبار: ${materialPage.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route(
                            'admin.materials.edit',
                            materialPage.material_id,
                        )}
                        className="text-sm text-brand-600 hover:underline"
                    >
                        &larr; الرجوع للمادة: {materialPage.material.title}
                    </Link>

                    <QuizMetaForm materialPage={materialPage} quiz={quiz} />

                    {quiz && (
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    الأسئلة ({quiz.questions.length})
                                </h3>
                                <button
                                    onClick={deleteQuiz}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    حذف الاختبار
                                </button>
                            </div>

                            <ul className="mt-4 space-y-2">
                                {quiz.questions.map((q) => (
                                    <li
                                        key={q.id}
                                        className="rounded bg-gray-50 p-3 text-sm dark:bg-gray-700"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-gray-800 dark:text-gray-100">
                                                {q.question}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    deleteQuestion(q.id)
                                                }
                                                className="shrink-0 text-xs text-red-600 hover:underline"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                        <ul className="mt-2 space-y-1">
                                            {q.options.map((o) => (
                                                <li
                                                    key={o.id}
                                                    className={`text-xs ${
                                                        o.is_correct
                                                            ? 'font-semibold text-green-700 dark:text-green-400'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {o.is_correct ? '✓ ' : '- '}
                                                    {o.option_text}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}

                                {quiz.questions.length === 0 && (
                                    <p className="text-sm text-gray-500">
                                        لسه مفيش أسئلة.
                                    </p>
                                )}
                            </ul>

                            <AddQuestionForm quiz={quiz} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
