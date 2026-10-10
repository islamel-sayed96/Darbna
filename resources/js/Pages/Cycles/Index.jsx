import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ cycles }) {
    return (
        <SiteLayout>
            <Head title="السايكلات" />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    سايكلات المحاضرات
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    دفعات محاضرات حضورية/أونلاين مسجلة — كل سايكل ليه مجموعة
                    محاضرات خاصة به.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cycles.map((cycle) => (
                        <Link
                            key={cycle.id}
                            href={route('cycles.show', cycle.slug)}
                            className="overflow-hidden rounded-lg bg-white p-5 shadow transition hover:shadow-md dark:bg-gray-800"
                        >
                            <p className="text-xs text-gray-500">
                                {cycle.category?.name ?? 'عام'}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
                                {cycle.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                {cycle.description}
                            </p>
                            <p className="mt-3 font-bold text-brand-600">
                                {Number(cycle.price) === 0
                                    ? 'بالتسجيل من الإدارة'
                                    : `${cycle.price} ${cycle.currency}`}
                            </p>
                        </Link>
                    ))}

                    {cycles.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            لا توجد سايكلات منشورة حاليًا.
                        </p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
