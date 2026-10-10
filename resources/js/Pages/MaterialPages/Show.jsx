import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ material, page, pages, currentIndex }) {
    const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const nextPage =
        currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    return (
        <SiteLayout>
            <Head title={page.title} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href={route('materials.show', material.slug)}
                    className="text-sm text-brand-600 hover:underline"
                >
                    &larr; الرجوع للمادة: {material.title}
                </Link>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {page.title}
                            </h1>

                            {page.content && (
                                <p className="mt-3 whitespace-pre-line text-gray-700 dark:text-gray-300">
                                    {page.content}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-between">
                            {prevPage ? (
                                <Link
                                    href={route(
                                        'material-pages.show',
                                        prevPage.id,
                                    )}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    &larr; الصفحة السابقة
                                </Link>
                            ) : (
                                <span />
                            )}
                            {nextPage && (
                                <Link
                                    href={route(
                                        'material-pages.show',
                                        nextPage.id,
                                    )}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    الصفحة التالية &rarr;
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 lg:col-span-1">
                        <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
                            صفحات المادة
                        </h2>
                        <ul className="space-y-1">
                            {pages.map((p) => (
                                <li key={p.id}>
                                    <Link
                                        href={route(
                                            'material-pages.show',
                                            p.id,
                                        )}
                                        className={`block rounded px-2 py-1.5 text-sm ${
                                            p.id === page.id
                                                ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {p.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
