import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const STATUS_LABELS = {
    draft: 'مسودة',
    pending_review: 'بانتظار المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض',
    published: 'منشور',
    unpublished: 'غير منشور',
};

export default function Show({ path }) {
    const { data, setData, put, processing, errors } = useForm({
        title: path.title,
        description: path.description ?? '',
        is_published: path.is_published,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.learning-paths.update', path.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    مسار: {path.title}
                </h2>
            }
        >
            <Head title={`مسار: ${path.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-3 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            اسم المسار
                        </label>
                        <input
                            className="block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            الوصف
                        </label>
                        <textarea
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />

                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) =>
                                    setData('is_published', e.target.checked)
                                }
                                className="rounded border-gray-300 text-brand-600"
                            />
                            منشور (يظهر للطلاب في صفحة المسارات)
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            حفظ التعديلات
                        </button>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                            الكورسات في المسار ده
                        </h3>
                        <p className="mb-3 text-xs text-gray-500">
                            المحاضر بيحدد مسار الكورس لما ينشئه أو يعدّله، أو
                            الأدمن من صفحة مراجعة الكورس.
                        </p>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {path.courses.map((course) => (
                                <li
                                    key={course.id}
                                    className="flex items-center justify-between py-2 text-sm"
                                >
                                    <span className="text-gray-800 dark:text-gray-200">
                                        {course.title}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {course.instructor?.name} —{' '}
                                        {STATUS_LABELS[course.status]}
                                    </span>
                                </li>
                            ))}

                            {path.courses.length === 0 && (
                                <li className="py-3 text-sm text-gray-500">
                                    لسه مفيش كورسات متعينة على المسار ده.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
