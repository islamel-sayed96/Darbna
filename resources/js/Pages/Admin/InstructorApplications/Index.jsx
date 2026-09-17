import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

const TABS = [
    { value: 'pending', label: 'بانتظار المراجعة' },
    { value: 'approved', label: 'مقبولة' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'all', label: 'الكل' },
];

export default function Index({ applications, filters }) {
    const changeStatus = (status) => {
        router.get(
            route('admin.instructor-applications.index'),
            { status },
            { preserveState: true },
        );
    };

    const approve = (application) => {
        if (!confirm(`تقبل طلب "${application.name}" وتنشئ له حساب محاضر؟`))
            return;
        router.post(
            route('admin.instructor-applications.approve', application.id),
        );
    };

    const reject = (application) => {
        if (!confirm(`ترفض طلب "${application.name}"؟`)) return;
        router.post(
            route('admin.instructor-applications.reject', application.id),
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    طلبات الانضمام كمحاضر
                </h2>
            }
        >
            <Head title="طلبات الانضمام كمحاضر" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

                    <div className="space-y-3">
                        {applications.data.map((application) => (
                            <div
                                key={application.id}
                                className="rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {application.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {application.email}
                                            {application.phone
                                                ? ` — ${application.phone}`
                                                : ''}
                                        </p>
                                    </div>
                                    {application.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    approve(application)
                                                }
                                                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
                                            >
                                                قبول
                                            </button>
                                            <button
                                                onClick={() =>
                                                    reject(application)
                                                }
                                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                رفض
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    <div>
                                        <dt className="text-gray-500">
                                            مكان الإقامة
                                        </dt>
                                        <dd className="text-gray-800 dark:text-gray-200">
                                            {application.residence ?? '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500">
                                            السيرة الذاتية
                                        </dt>
                                        <dd>
                                            {application.cv_url ? (
                                                <a
                                                    href={application.cv_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-brand-600 hover:underline"
                                                >
                                                    تحميل الملف
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </dd>
                                    </div>
                                    {application.portfolio && (
                                        <div>
                                            <dt className="text-gray-500">
                                                سابقة الأعمال
                                            </dt>
                                            <dd className="break-all text-gray-800 dark:text-gray-200">
                                                {application.portfolio}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <dt className="text-gray-500">
                                            عنوان الدورة المقترحة
                                        </dt>
                                        <dd className="font-medium text-gray-900 dark:text-white">
                                            {application.course_title ?? '—'}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-gray-500">
                                            المادة العلمية
                                        </dt>
                                        <dd className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                                            {application.course_syllabus ??
                                                '—'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        ))}

                        {applications.data.length === 0 && (
                            <p className="text-center text-sm text-gray-500">
                                لا توجد طلبات في هذه الحالة.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
