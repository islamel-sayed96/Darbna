import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ path }) {
    return (
        <SiteLayout>
            <Head title={path.title} />

            <div className="bg-brand-600 py-12 text-center text-white">
                <h1 className="text-3xl font-bold">{path.title}</h1>
                {path.description && (
                    <p className="mx-auto mt-3 max-w-2xl px-4">
                        {path.description}
                    </p>
                )}
                <p className="mt-2 text-brand-100">
                    {path.published_courses.length} كورسات في المسار ده
                </p>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {path.published_courses.map((course, index) => (
                        <Link
                            key={course.id}
                            href={route('courses.show', course.slug)}
                            className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md dark:bg-gray-800"
                        >
                            <div className="flex h-32 items-center justify-center bg-brand-50 text-2xl font-bold text-brand-600 dark:bg-gray-700">
                                {index + 1}
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-gray-500">
                                    {course.category?.name ?? 'عام'}
                                </p>
                                <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
                                    {course.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {course.instructor?.name}
                                </p>
                            </div>
                        </Link>
                    ))}

                    {path.published_courses.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            لسه مفيش كورسات منشورة في المسار ده.
                        </p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
