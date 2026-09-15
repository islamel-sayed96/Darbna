import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ course, isEnrolled, hasActiveSubscription }) {
    const { auth } = usePage().props;

    const enroll = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }
        router.post(route('courses.enroll', course.id));
    };

    const canEnroll = course.is_free || hasActiveSubscription;

    return (
        <SiteLayout>
            <Head title={course.title} />

            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <p className="text-sm text-indigo-600">
                        {course.category?.name ?? 'عام'}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                        {course.title}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        بواسطة {course.instructor?.name}
                        {course.instructor?.headline
                            ? ` — ${course.instructor.headline}`
                            : ''}
                    </p>

                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                        {course.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                        <span className="text-2xl font-bold text-indigo-600">
                            {course.is_free
                                ? 'مجاني'
                                : `${course.price} جنيه`}
                        </span>

                        {isEnrolled ? (
                            <span className="rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                أنت مشترك في هذا الكورس
                            </span>
                        ) : (
                            <button
                                onClick={enroll}
                                disabled={!canEnroll && !!auth.user}
                                className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {course.is_free
                                    ? 'اشترك مجانًا'
                                    : 'اشترك عبر الاشتراك الشهري'}
                            </button>
                        )}
                    </div>

                    {!canEnroll && !isEnrolled && (
                        <p className="mt-2 text-sm text-amber-600">
                            هذا الكورس متاح فقط لأصحاب الاشتراك الفعّال.
                        </p>
                    )}
                </div>

                <div className="mt-8 rounded-lg bg-white p-8 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        محتوى الكورس
                    </h2>

                    <div className="space-y-4">
                        {course.sections.map((section) => (
                            <div
                                key={section.id}
                                className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {section.title}
                                </p>
                                <ul className="mt-2 space-y-1">
                                    {section.lessons.map((lesson) => {
                                        const canOpen =
                                            lesson.is_preview || isEnrolled;
                                        const content = (
                                            <>
                                                <span>{lesson.title}</span>
                                                {lesson.is_preview && (
                                                    <span className="text-xs text-indigo-600">
                                                        معاينة مجانية
                                                    </span>
                                                )}
                                            </>
                                        );

                                        return (
                                            <li key={lesson.id}>
                                                {canOpen ? (
                                                    <Link
                                                        href={route(
                                                            'lessons.show',
                                                            lesson.id,
                                                        )}
                                                        className="flex items-center justify-between rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    >
                                                        {content}
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-400">
                                                        {content}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        {course.sections.length === 0 && (
                            <p className="text-sm text-gray-500">
                                سيتم إضافة المحتوى قريبًا.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
