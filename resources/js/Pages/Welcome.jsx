import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="دربنا — منصة الكورسات الاحترافية" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <span className="text-xl font-bold text-indigo-600">
                            دربنا
                        </span>

                        <div className="flex items-center gap-4">
                            <Link
                                href={route('courses.index')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                تصفح الكورسات
                            </Link>

                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    تسجيل الدخول
                                </Link>
                            )}

                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                                >
                                    ابدأ الآن مجانًا
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        تعلّم من نخبة المحاضرين، في أي وقت وأي مكان
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                        منصة دربنا بتجمع بين كورسات فيديو، اختبارات تفاعلية،
                        شهادات معتمدة، وحصص مباشرة مع المحاضرين — كل ده في
                        مكان واحد.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href={route('courses.index')}
                            className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500"
                        >
                            تصفح الكورسات
                        </Link>
                        {canRegister && (
                            <Link
                                href={route('register')}
                                className="rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                سجّل كمحاضر
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-24 sm:grid-cols-3 sm:px-6 lg:px-8">
                    {[
                        {
                            title: 'كورسات فيديو احترافية',
                            desc: 'محتوى مصوّر عالي الجودة مقسّم لأقسام ودروس، مع معاينة مجانية.',
                        },
                        {
                            title: 'اختبارات وشهادات',
                            desc: 'اختبر نفسك بعد كل كورس واحصل على شهادة إتمام موثقة.',
                        },
                        {
                            title: 'حصص مباشرة أونلاين',
                            desc: 'احجز حصة مباشرة مع المحاضر عبر Zoom للأسئلة والاستفسارات.',
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
                        >
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
