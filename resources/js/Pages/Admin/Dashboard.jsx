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

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    لوحة تحكم الأدمن
                </h2>
            }
        >
            <Head title="لوحة تحكم الأدمن" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="عدد الطلاب" value={stats.students} />
                        <StatCard
                            label="عدد المحاضرين"
                            value={stats.instructors}
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
                            label="الاشتراكات الفعّالة"
                            value={stats.activeSubscriptions}
                        />
                        <StatCard
                            label="إجمالي الإيرادات"
                            value={`${stats.totalRevenue} جنيه`}
                        />
                    </div>

                    {stats.pendingCourses > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/30">
                            <p className="text-amber-800 dark:text-amber-300">
                                يوجد {stats.pendingCourses} كورس بانتظار
                                المراجعة.
                            </p>
                            <Link
                                href={route('admin.courses.index', {
                                    status: 'pending_review',
                                })}
                                className="mt-2 inline-block text-sm font-semibold text-amber-900 underline dark:text-amber-200"
                            >
                                مراجعة الكورسات الآن
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
