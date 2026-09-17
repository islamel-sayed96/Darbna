import { motion } from 'framer-motion';
import {
    Code2,
    LayoutTemplate,
    PenTool,
    Server,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';
import { skills } from '@/Data/portfolio';

const icons = { Code2, Server, PenTool, TrendingUp, LayoutTemplate, ShoppingCart };

export default function Skills() {
    return (
        <section
            id="skills"
            className="bg-white py-24 dark:bg-gray-900"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-300">
                        مهاراتي وخدماتي
                    </h2>
                    <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        حلول متكاملة من الفكرة للإطلاق
                    </p>
                </motion.div>

                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {skills.map((skill, i) => {
                        const Icon = icons[skill.icon];
                        return (
                            <motion.div
                                key={skill.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl dark:border-gray-800 dark:bg-gray-800"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300">
                                    <Icon size={24} />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                                    {skill.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {skill.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
