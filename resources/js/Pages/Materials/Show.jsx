import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ material, hasAccess }) {
    const { auth } = usePage().props;
    const [purchasing, setPurchasing] = useState(false);
    const isFree = Number(material.price) === 0;

    const purchase = () => {
        if (!auth.user) {
            router.visit(
                route('login', { redirect: route('materials.show', material.slug) }),
            );
            return;
        }

        setPurchasing(true);
        router.post(
            route('purchases.materials.store', material.id),
            {},
            { onFinish: () => setPurchasing(false) },
        );
    };

    return (
        <SiteLayout>
            <Head title={material.title} />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <p className="text-sm text-brand-600">
                        {material.category?.name ?? 'عام'}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                        {material.title}
                    </h1>
                    {material.course && (
                        <p className="mt-2 text-sm text-gray-500">
                            ملحقة بكورس:{' '}
                            <Link
                                href={route(
                                    'courses.show',
                                    material.course.slug,
                                )}
                                className="text-brand-600 hover:underline"
                            >
                                {material.course.title}
                            </Link>
                        </p>
                    )}

                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                        {material.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                        <span className="text-2xl font-bold text-brand-600">
                            {isFree
                                ? 'مجانية'
                                : `${material.price} ${material.currency}`}
                        </span>

                        {hasAccess ? (
                            <span className="rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                المادة مفتوحة ليك
                            </span>
                        ) : (
                            !isFree && (
                                <button
                                    onClick={purchase}
                                    disabled={purchasing}
                                    className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                                >
                                    {purchasing
                                        ? 'جاري التحويل للدفع...'
                                        : 'اشترِ المادة الآن'}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="mt-8 rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        صفحات المادة
                    </h2>

                    <ul className="space-y-1">
                        {material.pages.map((page) => (
                            <li key={page.id}>
                                {hasAccess || isFree ? (
                                    <Link
                                        href={route(
                                            'material-pages.show',
                                            page.id,
                                        )}
                                        className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        {page.title}
                                    </Link>
                                ) : (
                                    <div className="px-2 py-1.5 text-sm text-gray-400">
                                        {page.title}
                                    </div>
                                )}
                            </li>
                        ))}

                        {material.pages.length === 0 && (
                            <p className="text-sm text-gray-500">
                                سيتم إضافة المحتوى قريبًا.
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </SiteLayout>
    );
}
