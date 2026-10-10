import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ cycles }) {
    const destroy = (cycle) => {
        if (!confirm(`تحذف سايكل "${cycle.title}"؟`)) return;
        router.delete(route('admin.cycles.destroy', cycle.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    السايكلات (دفعات المحاضرات)
                </h2>
            }
        >
            <Head title="السايكلات" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('admin.cycles.create')}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + سايكل جديد
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cycles.map((cycle) => (
                            <div
                                key={cycle.id}
                                className="rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            cycle.is_published
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {cycle.is_published
                                            ? 'منشور'
                                            : 'مسودة'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {cycle.lectures_count} محاضرة
                                    </span>
                                </div>
                                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                                    {cycle.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {cycle.category?.name ?? 'بدون تصنيف'}
                                </p>
                                <p className="mt-1 font-bold text-brand-600">
                                    {Number(cycle.price) === 0
                                        ? 'مجاني'
                                        : `${cycle.price} ${cycle.currency}`}
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <Link
                                        href={route(
                                            'admin.cycles.edit',
                                            cycle.id,
                                        )}
                                        className="text-sm font-medium text-brand-600 hover:text-brand-500"
                                    >
                                        إدارة
                                    </Link>
                                    <button
                                        onClick={() => destroy(cycle)}
                                        className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}

                        {cycles.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لسه مفيش سايكلات.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
