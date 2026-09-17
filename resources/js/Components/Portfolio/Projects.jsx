import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpLeft } from 'lucide-react';
import { projects } from '@/Data/portfolio';

export default function Projects() {
    return (
        <section
            id="projects"
            className="bg-gray-50 py-24 dark:bg-gray-950"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">
                        أعمالي
                    </h2>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        مشاريع اشتغلت عليها
                    </p>
                </motion.div>

                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-2xl dark:bg-gray-900"
                        >
                            <div
                                className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${project.gradient}`}
                            >
                                <span className="text-2xl font-black text-white/90">
                                    {project.title.split(' ')[0]}
                                </span>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {project.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {project.desc}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={project.href}
                                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2.5 dark:text-brand-300"
                                >
                                    {project.cta}
                                    <ArrowUpLeft size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
