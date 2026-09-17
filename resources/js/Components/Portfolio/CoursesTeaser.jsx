import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, FileText } from 'lucide-react';
import { subjects } from '@/Data/portfolio';

export default function CoursesTeaser() {
    return (
        <section
            id="courses"
            className="relative overflow-hidden bg-brand-950 py-24"
        >
            <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-brand-700/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent-600/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-brand-300">
                        الدورات التدريبية
                    </h2>
                    <p className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                        اتعلم منّي عملي خطوة بخطوة
                    </p>
                    <p className="mt-4 text-brand-100">
                        كل مادة فيها محاضرات مسجلة، اختبارات لقياس مستواك، وصفحة
                        شرح كاملة ترجع لها وقت ما تحتاج.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {subjects.map((subject, i) => (
                        <motion.div
                            key={subject.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            whileHover={{ y: -6 }}
                            className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm ring-1 ring-white/10"
                        >
                            <h3 className="text-lg font-bold text-white">
                                {subject.title}
                            </h3>

                            <div className="mt-5 space-y-3 text-sm text-brand-100">
                                <div className="flex items-center gap-2.5">
                                    <BookOpen size={17} className="text-accent-400" />
                                    {subject.lessons} محاضرة مسجلة
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <ClipboardCheck size={17} className="text-accent-400" />
                                    {subject.quizzes} اختبارات تفاعلية
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FileText size={17} className="text-accent-400" />
                                    صفحة شرح علمي كاملة للمادة
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <Link
                        href={route('courses.index')}
                        className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-500/30 transition hover:-translate-y-0.5 hover:bg-accent-400"
                    >
                        تصفح كل الدورات
                    </Link>
                </div>
            </div>
        </section>
    );
}
