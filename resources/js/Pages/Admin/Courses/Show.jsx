import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ course, learningPaths }) {
    const [showReject, setShowReject] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        rejection_reason: '',
    });

    const approve = () => {
        post(route('admin.courses.approve', course.id));
    };

    const reject = (e) => {
        e.preventDefault();
        post(route('admin.courses.reject', course.id));
    };

    const changeLearningPath = (e) => {
        router.post(route('admin.courses.assign-learning-path', course.id), {
            learning_path_id: e.target.value || null,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    مراجعة كورس: {course.title}
                </h2>
            }
        >
            <Head title={`مراجعة: ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {course.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {course.description || 'لا يوجد وصف.'}
                        </p>

                        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">المحاضر</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {course.instructor?.name} (
                                    {course.instructor?.email})
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">التصنيف</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {course.category?.name ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">السعر</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {course.is_free ? 'مجاني' : `${course.price} جنيه`}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">المستوى</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {course.level}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">مسار التعلم</dt>
                                <dd>
                                    <select
                                        className="mt-1 rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        defaultValue={
                                            course.learning_path_id ?? ''
                                        }
                                        onChange={changeLearningPath}
                                    >
                                        <option value="">بدون مسار</option>
                                        {learningPaths.map((path) => (
                                            <option
                                                key={path.id}
                                                value={path.id}
                                            >
                                                {path.title}
                                            </option>
                                        ))}
                                    </select>
                                </dd>
                            </div>
                        </dl>

                        {course.rejection_reason && (
                            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                آخر سبب رفض: {course.rejection_reason}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                            محتوى الكورس
                        </h4>
                        {course.sections.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لا توجد أقسام مضافة بعد.
                            </p>
                        )}
                        <div className="space-y-3">
                            {course.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
                                >
                                    <p className="font-medium text-gray-800 dark:text-gray-200">
                                        {section.title}
                                    </p>
                                    <ul className="mt-1 list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                                        {section.lessons.map((lesson) => (
                                            <li key={lesson.id}>
                                                {lesson.title} ({lesson.type})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {course.status === 'pending_review' && (
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <div className="flex flex-wrap gap-3">
                                <PrimaryButton
                                    onClick={approve}
                                    disabled={processing}
                                >
                                    قبول ونشر الكورس
                                </PrimaryButton>
                                <button
                                    type="button"
                                    onClick={() => setShowReject((s) => !s)}
                                    className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    رفض الكورس
                                </button>
                            </div>

                            {showReject && (
                                <form
                                    onSubmit={reject}
                                    className="mt-4 space-y-2"
                                >
                                    <textarea
                                        className="w-full rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        rows={3}
                                        placeholder="سبب الرفض (سيصل للمحاضر)"
                                        value={data.rejection_reason}
                                        onChange={(e) =>
                                            setData(
                                                'rejection_reason',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.rejection_reason && (
                                        <p className="text-sm text-red-600">
                                            {errors.rejection_reason}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                    >
                                        تأكيد الرفض
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {course.status === 'published' && (
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        post(
                                            route(
                                                'admin.courses.unpublish',
                                                course.id,
                                            ),
                                        )
                                    }
                                    className="rounded-md border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                >
                                    إلغاء النشر
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                'حذف الكورس نهائيًا؟ ده إجراء لا يمكن التراجع عنه.',
                                            )
                                        ) {
                                            router.delete(
                                                route(
                                                    'admin.courses.destroy',
                                                    course.id,
                                                ),
                                            );
                                        }
                                    }}
                                    className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    حذف نهائي
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
