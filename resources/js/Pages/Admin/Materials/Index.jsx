import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ materials }) {
    const destroy = (material) => {
        if (!confirm(`تحذف مادة "${material.title}"؟`)) return;
        router.delete(route('admin.materials.destroy', material.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    المواد العلمية
                </h2>
            }
        >
            <Head title="المواد العلمية" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('admin.materials.create')}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + مادة علمية جديدة
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {materials.map((material) => (
                            <div
                                key={material.id}
                                className="rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            material.is_published
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {material.is_published
                                            ? 'منشورة'
                                            : 'مسودة'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {material.pages_count} صفحة
                                    </span>
                                </div>
                                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                                    {material.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {material.category?.name ?? 'بدون تصنيف'}
                                    {material.course
                                        ? ` — ملحقة بكورس: ${material.course.title}`
                                        : ''}
                                </p>
                                <p className="mt-1 font-bold text-brand-600">
                                    {Number(material.price) === 0
                                        ? 'مجانية'
                                        : `${material.price} ${material.currency}`}
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <Link
                                        href={route(
                                            'admin.materials.edit',
                                            material.id,
                                        )}
                                        className="text-sm font-medium text-brand-600 hover:text-brand-500"
                                    >
                                        إدارة
                                    </Link>
                                    <button
                                        onClick={() => destroy(material)}
                                        className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}

                        {materials.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لسه مفيش مواد علمية.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
