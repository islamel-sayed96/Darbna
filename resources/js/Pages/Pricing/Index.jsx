import SiteLayout from '@/Layouts/SiteLayout';
import { Head, usePage } from '@inertiajs/react';

const INTERVAL_LABELS = {
    month: '/ شهريًا',
    half_year: '/ كل 6 شهور',
    year: '/ سنويًا',
};

export default function Index({ plans }) {
    const { auth } = usePage().props;

    return (
        <SiteLayout>
            <Head title="خطط الاشتراك" />

            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        خطط الاشتراك
                    </h1>
                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                        اشترك مرة واحدة وادخل على كل الكورسات المشمولة —
                        كل ما الخطة أطول كل ما وفّرت أكتر.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border p-6 shadow-sm ${
                                plan.badge
                                    ? 'border-brand-400 bg-white dark:bg-gray-800'
                                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                            }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {plan.name}
                            </h3>

                            <p className="mt-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {plan.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {' '}
                                    جنيه{' '}
                                    {INTERVAL_LABELS[plan.interval] ?? ''}
                                </span>
                            </p>

                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                {plan.description}
                            </p>

                            <button
                                disabled
                                title="الدفع الإلكتروني قريبًا"
                                className="mt-6 w-full cursor-not-allowed rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                            >
                                {auth.user
                                    ? 'الاشتراك الإلكتروني قريبًا'
                                    : 'سجّل الدخول للاشتراك'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </SiteLayout>
    );
}
