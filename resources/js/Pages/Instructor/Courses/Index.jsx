import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const STATUS_LABELS = {
    draft: 'مسودة',
    pending_review: 'بانتظار المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض',
    published: 'منشور',
    unpublished: 'غير منشور',
};

export default function Index({ courses }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    كورساتي
                </h2>
            }
        >
            <Head title="كورساتي" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('instructor.courses.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            + إنشاء كورس جديد
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                        {STATUS_LABELS[course.status]}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {course.enrollments_count} طالب
                                    </span>
                                </div>
                                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                                    {course.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {course.category?.name ?? 'بدون تصنيف'}
                                </p>
                                <Link
                                    href={route(
                                        'instructor.courses.edit',
                                        course.id,
                                    )}
                                    className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    إدارة الكورس
                                </Link>
                            </div>
                        ))}

                        {courses.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لم تنشئ أي كورس بعد.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
