import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ paths }) {
    return (
        <SiteLayout>
            <Head title="مسارات التعلم" />

            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    مسارات التعلم
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    مجموعات كورسات مرتبة عشان توصلك لهدف معيّن خطوة بخطوة.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paths.map((path) => (
                        <Link
                            key={path.id}
                            href={route('learning-paths.show', path.slug)}
                            className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md dark:bg-gray-800"
                        >
                            <div className="flex h-40 items-center justify-center bg-brand-600 p-6 text-center text-lg font-bold text-white">
                                {path.title}
                            </div>
                            <div className="p-4">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {path.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {path.courses_count} كورسات
                                </p>
                            </div>
                        </Link>
                    ))}

                    {paths.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            لسه مفيش مسارات منشورة.
                        </p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
