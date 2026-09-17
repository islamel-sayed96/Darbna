import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowDown, Code2, Mail, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile } from '@/Data/portfolio';

function useTypewriter(words, { typeSpeed = 70, deleteSpeed = 40, pause = 1400 } = {}) {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = words[index % words.length];
        let timeout;

        if (!deleting && text === current) {
            timeout = setTimeout(() => setDeleting(true), pause);
        } else if (deleting && text === '') {
            setDeleting(false);
            setIndex((i) => i + 1);
        } else {
            timeout = setTimeout(
                () => {
                    setText((t) =>
                        deleting
                            ? current.slice(0, t.length - 1)
                            : current.slice(0, t.length + 1),
                    );
                },
                deleting ? deleteSpeed : typeSpeed,
            );
        }

        return () => clearTimeout(timeout);
    }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause]);

    return text;
}

export default function Hero() {
    const roleText = useTypewriter(profile.roles);

    return (
        <section
            id="hero"
            className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white pt-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-300/40 blur-3xl animate-blob dark:bg-brand-700/20" />
                <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-accent-300/40 blur-3xl animate-blob [animation-delay:4s] dark:bg-accent-700/20" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl animate-blob [animation-delay:2s] dark:bg-brand-800/20" />
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        متاح للعمل الحر والمشاريع الجديدة
                    </span>

                    <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                        أنا {profile.name}
                    </h1>

                    <p className="mt-4 h-10 text-2xl font-bold text-brand-600 dark:text-brand-300 sm:text-3xl">
                        {roleText}
                        <span className="animate-pulse">|</span>
                    </p>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                        {profile.bio}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById('contact')
                                    ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500"
                        >
                            <Mail size={18} />
                            تواصل معي
                        </a>
                        <Link
                            href={route('courses.index')}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-base font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        >
                            <PlayCircle size={18} />
                            شاهد الدورات التدريبية
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="relative mx-auto aspect-square w-full max-w-md"
                >
                    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-brand-800 shadow-2xl" />
                    <div className="absolute inset-3 flex items-center justify-center rounded-[2rem] bg-white/10 backdrop-blur-sm">
                        <Code2 size={110} strokeWidth={1.4} className="text-white/90" />
                    </div>
                    <motion.div
                        className="absolute -bottom-6 -right-6 rounded-2xl bg-white px-5 py-4 shadow-xl dark:bg-gray-800"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-300">
                            +1200
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            طالب استفاد من الدورات
                        </p>
                    </motion.div>
                    <motion.div
                        className="absolute -left-2 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl dark:bg-gray-800 sm:-left-8"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <p className="text-sm font-bold text-accent-600 dark:text-accent-400">
                            UI/UX • SEO • E-commerce
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            <motion.button
                onClick={() =>
                    document
                        .getElementById('skills')
                        ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                aria-label="انزل لتحت"
            >
                <ArrowDown size={28} />
            </motion.button>
        </section>
    );
}
