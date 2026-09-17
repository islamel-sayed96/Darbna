import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

function StatCard({ value, label }) {
    return (
        <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {value.toLocaleString('ar-EG')}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {label}
            </p>
        </div>
    );
}

export default function Welcome({ categories, learningPaths, stats }) {
    return (
        <SiteLayout>
            <Head title="دربنا — منصة الكورسات الاحترافية" />

            <div className="bg-gradient-to-b from-brand-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        دورات ومهارات بلا حدود
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                        منصة دربنا بتجمع بين كورسات فيديو، اختبارات تفاعلية،
                        شهادات معتمدة، وحصص مباشرة مع المحاضرين — كل ده في
                        مكان واحد.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link
                            href={route('instructor-application.create')}
                            className="rounded-full border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                        >
                            انضم كمحاضر
                        </Link>
                        <Link
                            href={route('pricing')}
                            className="rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white hover:bg-brand-500"
                        >
                            اشترك الآن
                        </Link>
                        <Link
                            href={route('courses.index')}
                            className="rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            تصفح الدورات
                        </Link>
                    </div>
                </div>

                {stats && (
                    <div className="border-t border-gray-100 bg-white py-10 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
                            <StatCard
                                value={stats.watchMinutes}
                                label="دقيقة مشاهدة"
                            />
                            <StatCard
                                value={stats.certificates}
                                label="شهادة"
                            />
                            <StatCard value={stats.courses} label="دورة" />
                            <StatCard
                                value={stats.students}
                                label="متعلم"
                            />
                        </div>
                    </div>
                )}
            </div>

            {categories.length > 0 && (
                <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                    <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">
                        الأقسام
                    </h2>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            href={route('courses.index')}
                            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
                        >
                            كل الأقسام
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('courses.index', { category: cat.id })}
                                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {learningPaths.length > 0 && (
                <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            جميع المسارات
                        </h2>
                        <Link
                            href={route('learning-paths.index')}
                            className="text-sm font-medium text-brand-600 hover:underline"
                        >
                            عرض الكل
                        </Link>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {learningPaths.map((path) => (
                            <Link
                                key={path.id}
                                href={route('learning-paths.show', path.slug)}
                                className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md dark:bg-gray-800"
                            >
                                <div className="flex h-40 items-center justify-center bg-brand-600 p-6 text-center text-lg font-bold text-white">
                                    {path.title}
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {path.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {path.courses_count} كورسات
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </SiteLayout>
    );
}
