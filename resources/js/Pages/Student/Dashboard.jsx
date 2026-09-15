import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({
    enrollments,
    activeSubscription,
    certificatesCount,
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    لوحة التحكم
                </h2>
            }
        >
            <Head title="لوحة التحكم" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                الكورسات المسجلة
                            </p>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                {enrollments.length}
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <p className="text-sm text-gray-500">
                                حالة الاشتراك
                            </p>
                            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                                {activeSubscription
                                    ? 'مشترك حاليًا'
                                    : 'بدون اشتراك فعّال'}
                            </p>
                            {!activeSubscription && (
                                <Link
                                    href={route('courses.index')}
                                    className="mt-2 inline-block text-sm text-indigo-600 hover:underline"
                                >
                                    عرض خطط الاشتراك
                                </Link>
                            )}
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <p className="text-sm text-gray-500">الشهادات</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                {certificatesCount}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                كورساتي
                            </h3>
                            <Link
                                href={route('courses.index')}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                تصفح المزيد من الكورسات
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {enrollments.map((enrollment) => (
                                <Link
                                    key={enrollment.id}
                                    href={route(
                                        'courses.show',
                                        enrollment.course.slug,
                                    )}
                                    className="rounded-lg bg-white p-5 shadow transition hover:shadow-md dark:bg-gray-800"
                                >
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {enrollment.course.title}
                                    </h4>
                                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                                        <div
                                            className="h-2 rounded-full bg-indigo-600"
                                            style={{
                                                width: `${enrollment.progress_percent}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {enrollment.progress_percent}% مكتمل
                                    </p>
                                </Link>
                            ))}

                            {enrollments.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    لسه مسجلتش في أي كورس، ابدأ بتصفح
                                    الكورسات المتاحة.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
