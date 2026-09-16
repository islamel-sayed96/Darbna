import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({
    course,
    lesson,
    allLessons,
    prevLesson,
    nextLesson,
    isCompleted,
}) {
    const { auth } = usePage().props;

    const markComplete = () => {
        router.post(route('lessons.complete', lesson.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <SiteLayout>
            <Head title={lesson.title} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href={route('courses.show', course.slug)}
                    className="text-sm text-brand-600 hover:underline"
                >
                    &larr; الرجوع لصفحة الكورس: {course.title}
                </Link>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-lg bg-black shadow">
                            {lesson.type === 'video' && lesson.video_id ? (
                                <div className="aspect-video w-full">
                                    <iframe
                                        className="h-full w-full"
                                        src={`https://www.youtube-nocookie.com/embed/${lesson.video_id}`}
                                        title={lesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center bg-gray-800 text-gray-400">
                                    {lesson.type === 'video'
                                        ? 'لسه محدّدش فيديو لهذا الدرس'
                                        : 'درس نصي'}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lesson.title}
                            </h1>

                            {lesson.type === 'text' && lesson.content && (
                                <p className="mt-3 whitespace-pre-line text-gray-700 dark:text-gray-300">
                                    {lesson.content}
                                </p>
                            )}

                            {auth.user && (
                                <button
                                    onClick={markComplete}
                                    disabled={isCompleted}
                                    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isCompleted
                                        ? '✓ تم إتمام الدرس'
                                        : 'وضع علامة "تم المشاهدة"'}
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex justify-between">
                            {prevLesson ? (
                                <Link
                                    href={route('lessons.show', prevLesson.id)}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    &larr; الدرس السابق
                                </Link>
                            ) : (
                                <span />
                            )}
                            {nextLesson && (
                                <Link
                                    href={route('lessons.show', nextLesson.id)}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    الدرس التالي &rarr;
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 lg:col-span-1">
                        <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
                            محتوى الكورس
                        </h2>
                        <ul className="space-y-1">
                            {allLessons.map((l) => (
                                <li key={l.id}>
                                    <Link
                                        href={route('lessons.show', l.id)}
                                        className={`block rounded px-2 py-1.5 text-sm ${
                                            l.id === lesson.id
                                                ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {l.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
