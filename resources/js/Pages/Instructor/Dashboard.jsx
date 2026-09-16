import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const StatCard = ({ label, value }) => (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
        </p>
    </div>
);

export default function Dashboard({ stats, courses }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    لوحة تحكم المحاضر
                </h2>
            }
        >
            <Head title="لوحة تحكم المحاضر" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="إجمالي الكورسات"
                            value={stats.totalCourses}
                        />
                        <StatCard
                            label="الكورسات المنشورة"
                            value={stats.publishedCourses}
                        />
                        <StatCard
                            label="بانتظار المراجعة"
                            value={stats.pendingCourses}
                        />
                        <StatCard
                            label="إجمالي الطلاب"
                            value={stats.totalStudents}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href={route('instructor.courses.create')}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + إنشاء كورس جديد
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الكورس</th>
                                    <th className="px-6 py-3">الحالة</th>
                                    <th className="px-6 py-3">عدد الطلاب</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {courses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {course.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {course.status}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {course.enrollments_count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={route(
                                                    'instructor.courses.edit',
                                                    course.id,
                                                )}
                                                className="font-medium text-brand-600 hover:text-brand-500"
                                            >
                                                تعديل
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {courses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لم تنشئ أي كورس بعد.
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
