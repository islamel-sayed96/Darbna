import ApplicationLogo from '@/Components/ApplicationLogo';
import Flash from '@/Components/Flash';
import Footer from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';

export default function SiteLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-9" />
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href={route('courses.index')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            تصفح الكورسات
                        </Link>

                        <Link
                            href={route('learning-paths.index')}
                            className="hidden text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:inline"
                        >
                            مسارات التعلم
                        </Link>

                        <Link
                            href={route('pricing')}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            الأسعار
                        </Link>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                            >
                                لوحة التحكم
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                                >
                                    ابدأ الآن
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <Flash />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
