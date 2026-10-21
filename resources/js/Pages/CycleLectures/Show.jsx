import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ cycle, lecture, lectures, currentIndex }) {
    const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
    const nextLecture =
        currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

    return (
        <SiteLayout>
            <Head title={lecture.title} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href={route('cycles.show', cycle.slug)}
                    className="text-sm text-brand-600 hover:underline"
                >
                    &larr; الرجوع لصفحة السايكل: {cycle.title}
                </Link>

                <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-lg bg-black shadow">
                            {lecture.video_id ? (
                                <div className="aspect-video w-full">
                                    <iframe
                                        className="h-full w-full"
                                        src={`https://www.youtube-nocookie.com/embed/${lecture.video_id}`}
                                        title={lecture.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : lecture.video_url ? (
                                <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-gray-800 text-gray-300">
                                    <p>تسجيل المحاضرة ده رابط خارجي (زووم)</p>
                                    <a
                                        href={lecture.video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                                    >
                                        افتح رابط التسجيل
                                    </a>
                                </div>
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center bg-gray-800 text-gray-400">
                                    لسه محدّدش فيديو للمحاضرة دي
                                </div>
                            )}
                        </div>

                        <div className="mt-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lecture.title}
                            </h1>
                        </div>

                        <div className="mt-4 flex justify-between">
                            {prevLecture ? (
                                <Link
                                    href={route(
                                        'cycle-lectures.show',
                                        prevLecture.id,
                                    )}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    &larr; المحاضرة السابقة
                                </Link>
                            ) : (
                                <span />
                            )}
                            {nextLecture && (
                                <Link
                                    href={route(
                                        'cycle-lectures.show',
                                        nextLecture.id,
                                    )}
                                    className="text-sm text-brand-600 hover:underline"
                                >
                                    المحاضرة التالية &rarr;
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 lg:col-span-1">
                        <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">
                            محاضرات السايكل
                        </h2>
                        <ul className="space-y-1">
                            {lectures.map((l) => (
                                <li key={l.id}>
                                    <Link
                                        href={route(
                                            'cycle-lectures.show',
                                            l.id,
                                        )}
                                        className={`block rounded px-2 py-1.5 text-sm ${
                                            l.id === lecture.id
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
