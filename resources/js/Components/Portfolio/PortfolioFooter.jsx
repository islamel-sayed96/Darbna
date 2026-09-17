import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function PortfolioFooter() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50 py-10 dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                <ApplicationLogo className="h-8" />

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} جميع الحقوق محفوظة.
                </p>

                <Link
                    href={route('courses.index')}
                    className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-300"
                >
                    تصفح الدورات
                </Link>
            </div>
        </footer>
    );
}
