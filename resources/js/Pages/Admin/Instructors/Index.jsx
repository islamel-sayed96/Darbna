import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ instructors }) {
    const toggleActive = (instructor) => {
        router.post(
            route('admin.instructors.toggle-active', instructor.id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    حسابات المحاضرين
                </h2>
            }
        >
            <Head title="حسابات المحاضرين" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('admin.instructors.create')}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + إنشاء حساب محاضر
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الاسم</th>
                                    <th className="px-6 py-3">البريد الإلكتروني</th>
                                    <th className="px-6 py-3">عدد الكورسات</th>
                                    <th className="px-6 py-3">الحالة</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {instructors.map((instructor) => (
                                    <tr key={instructor.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {instructor.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {instructor.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {instructor.courses_taught_count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    instructor.is_active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                }`}
                                            >
                                                {instructor.is_active
                                                    ? 'مفعّل'
                                                    : 'موقوف'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    toggleActive(instructor)
                                                }
                                                className="text-sm font-medium text-brand-600 hover:underline"
                                            >
                                                {instructor.is_active
                                                    ? 'إيقاف'
                                                    : 'تفعيل'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {instructors.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لسه مفيش حسابات محاضرين.
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
