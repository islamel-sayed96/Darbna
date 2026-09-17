import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const DURATIONS = [
    { months: 1, label: 'شهر' },
    { months: 3, label: '3 شهور' },
    { months: 6, label: '6 شهور' },
    { months: 12, label: 'سنة' },
];

const ACCESS_ORDER = [
    'limited_courses',
    'single_path',
    'three_paths',
    'all_access',
];

export default function Index({ plans }) {
    const { auth } = usePage().props;
    const [duration, setDuration] = useState(1);
    const [subscribingTo, setSubscribingTo] = useState(null);

    const visiblePlans = useMemo(() => {
        return ACCESS_ORDER.map((accessType) =>
            plans.find(
                (plan) =>
                    plan.access_type === accessType &&
                    plan.duration_months === duration,
            ),
        ).filter(Boolean);
    }, [plans, duration]);

    const subscribe = (plan) => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        setSubscribingTo(plan.id);
        router.post(
            route('checkout.store', plan.id),
            {},
            { onFinish: () => setSubscribingTo(null) },
        );
    };

    return (
        <SiteLayout>
            <Head title="خطط الاشتراك" />

            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        خطط الاشتراك
                    </h1>
                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                        اختار مدة الاشتراك ونوع الوصول اللي يناسبك — كل ما
                        اشتركت لمدة أطول كل ما وفّرت أكتر.
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
                        {DURATIONS.map((d) => (
                            <button
                                key={d.months}
                                onClick={() => setDuration(d.months)}
                                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                                    duration === d.months
                                        ? 'bg-brand-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                                }`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {visiblePlans.map((plan) => (
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
                                {plan.name.split(' — ')[0]}
                            </h3>

                            <p className="mt-4">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {plan.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {' '}
                                    {plan.currency}
                                </span>
                            </p>

                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                                {plan.description}
                            </p>

                            {auth.user ? (
                                <button
                                    onClick={() => subscribe(plan)}
                                    disabled={subscribingTo === plan.id}
                                    className="mt-6 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                                >
                                    {subscribingTo === plan.id
                                        ? 'جاري التحويل للدفع...'
                                        : 'اشترك الآن'}
                                </button>
                            ) : (
                                <div className="mt-6 grid grid-cols-2 gap-2">
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-500"
                                    >
                                        إنشاء حساب
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </SiteLayout>
    );
}
