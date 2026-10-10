import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ cycle, hasAccess }) {
    const { auth } = usePage().props;
    const [purchasing, setPurchasing] = useState(false);
    const canSelfPurchase = Number(cycle.price) > 0;

    const purchase = () => {
        if (!auth.user) {
            router.visit(
                route('login', { redirect: route('cycles.show', cycle.slug) }),
            );
            return;
        }

        setPurchasing(true);
        router.post(
            route('purchases.cycles.store', cycle.id),
            {},
            { onFinish: () => setPurchasing(false) },
        );
    };

    return (
        <SiteLayout>
            <Head title={cycle.title} />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <p className="text-sm text-brand-600">
                        {cycle.category?.name ?? 'عام'}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                        {cycle.title}
                    </h1>

                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                        {cycle.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                        <span className="text-2xl font-bold text-brand-600">
                            {canSelfPurchase
                                ? `${cycle.price} ${cycle.currency}`
                                : 'بالتسجيل من الإدارة'}
                        </span>

                        {hasAccess ? (
                            <span className="rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                أنت مسجل في السايكل ده
                            </span>
                        ) : (
                            canSelfPurchase && (
                                <button
                                    onClick={purchase}
                                    disabled={purchasing}
                                    className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                                >
                                    {purchasing
                                        ? 'جاري التحويل للدفع...'
                                        : 'اشترك في السايكل'}
                                </button>
                            )
                        )}
                    </div>

                    {!hasAccess && !canSelfPurchase && (
                        <p className="mt-2 text-sm text-amber-600">
                            السايكل ده بيتسجل فيه الطلاب عن طريق الإدارة —
                            تواصل معانا للتسجيل.
                        </p>
                    )}
                </div>

                <div className="mt-8 rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        محاضرات السايكل
                    </h2>

                    <ul className="space-y-1">
                        {cycle.lectures.map((lecture) => (
                            <li key={lecture.id}>
                                {hasAccess ? (
                                    <Link
                                        href={route(
                                            'cycle-lectures.show',
                                            lecture.id,
                                        )}
                                        className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        {lecture.title}
                                    </Link>
                                ) : (
                                    <div className="px-2 py-1.5 text-sm text-gray-400">
                                        {lecture.title}
                                    </div>
                                )}
                            </li>
                        ))}

                        {cycle.lectures.length === 0 && (
                            <p className="text-sm text-gray-500">
                                سيتم إضافة المحاضرات قريبًا.
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </SiteLayout>
    );
}
