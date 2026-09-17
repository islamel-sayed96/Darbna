import { Link } from '@inertiajs/react';

export default function Footer() {
    const links = [
        { href: route('home'), label: 'الرئيسية' },
        { href: route('courses.index'), label: 'تصفح الكورسات' },
        { href: route('learning-paths.index'), label: 'مسارات التعلم' },
        { href: route('pricing'), label: 'الأسعار' },
        { href: route('instructor-application.create'), label: 'انضم كمحاضر' },
    ];

    return (
        <footer className="mt-16 border-t border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} دربنا. جميع الحقوق محفوظة.
                </p>
            </div>
        </footer>
    );
}
