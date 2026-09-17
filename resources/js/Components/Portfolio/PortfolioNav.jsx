import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const sections = [
    { id: 'hero', label: 'الرئيسية' },
    { id: 'skills', label: 'المهارات' },
    { id: 'projects', label: 'أعمالي' },
    { id: 'courses', label: 'الدورات التدريبية' },
    { id: 'contact', label: 'تواصل معي' },
];

export default function PortfolioNav() {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id) => {
        setOpen(false);
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled
                    ? 'bg-white/90 shadow-sm backdrop-blur-md dark:bg-gray-900/90'
                    : 'bg-transparent'
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => scrollTo('hero')}
                    className="flex items-center gap-2"
                >
                    <ApplicationLogo className="h-9" />
                </button>

                <div className="hidden items-center gap-8 md:flex">
                    {sections.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => scrollTo(s.id)}
                            className="text-sm font-medium text-gray-700 transition hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-300"
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    {auth?.user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
                        >
                            لوحة التحكم
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-300"
                            >
                                تسجيل الدخول
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
                            >
                                ابدأ الآن
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setOpen((v) => !v)}
                    className="text-gray-700 dark:text-gray-200 md:hidden"
                    aria-label="فتح القائمة"
                >
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-4 py-4">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className="rounded-md px-3 py-2 text-right text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    {s.label}
                                </button>
                            ))}
                            <div className="mt-2 flex gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
                                    >
                                        لوحة التحكم
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
                                        >
                                            ابدأ الآن
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
