import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const STATUS_LABELS = {
    draft: 'مسودة',
    pending_review: 'بانتظار المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض',
    published: 'منشور',
    unpublished: 'غير منشور',
};

const TABS = [
    { value: 'pending_review', label: 'بانتظار المراجعة' },
    { value: 'published', label: 'منشورة' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'all', label: 'الكل' },
];

export default function Index({ courses, filters }) {
    const changeStatus = (status) => {
        router.get(
            route('admin.courses.index'),
            { status },
            { preserveState: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    مراجعة الكورسات
                </h2>
            }
        >
            <Head title="مراجعة الكورسات" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => changeStatus(tab.value)}
                                className={`rounded-md px-4 py-2 text-sm font-medium ${
                                    filters.status === tab.value
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الكورس</th>
                                    <th className="px-6 py-3">المحاضر</th>
                                    <th className="px-6 py-3">التصنيف</th>
                                    <th className="px-6 py-3">الحالة</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {courses.data.map((course) => (
                                    <tr key={course.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {course.instructor?.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {course.category?.name ?? '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                                {STATUS_LABELS[course.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={route(
                                                    'admin.courses.show',
                                                    course.id,
                                                )}
                                                className="font-medium text-brand-600 hover:text-brand-500"
                                            >
                                                مراجعة
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {courses.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لا توجد كورسات في هذه الحالة.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
