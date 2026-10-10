import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ materials }) {
    return (
        <SiteLayout>
            <Head title="المواد العلمية" />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    المواد العلمية
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    محتوى علمي مكتوب تقدر توصله بعد الشراء — ممكن يكون مستقل
                    أو ملحق بكورس.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((material) => (
                        <Link
                            key={material.id}
                            href={route('materials.show', material.slug)}
                            className="overflow-hidden rounded-lg bg-white p-5 shadow transition hover:shadow-md dark:bg-gray-800"
                        >
                            <p className="text-xs text-gray-500">
                                {material.category?.name ?? 'عام'}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
                                {material.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                {material.description}
                            </p>
                            <p className="mt-3 font-bold text-brand-600">
                                {Number(material.price) === 0
                                    ? 'مجانية'
                                    : `${material.price} ${material.currency}`}
                            </p>
                        </Link>
                    ))}

                    {materials.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            لا توجد مواد علمية منشورة حاليًا.
                        </p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
