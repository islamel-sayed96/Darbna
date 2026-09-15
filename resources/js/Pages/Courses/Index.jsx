import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ courses, categories, filters }) {
    const search = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get(
            route('courses.index'),
            Object.fromEntries(formData),
            { preserveState: true },
        );
    };

    return (
        <SiteLayout>
            <Head title="تصفح الكورسات" />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    تصفح الكورسات
                </h1>

                <form
                    onSubmit={search}
                    className="mt-6 flex flex-wrap gap-3"
                >
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search ?? ''}
                        placeholder="ابحث عن كورس..."
                        className="flex-1 rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                    <select
                        name="category"
                        defaultValue={filters.category ?? ''}
                        className="rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                        <option value="">كل التصنيفات</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        بحث
                    </button>
                </form>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.data.map((course) => (
                        <Link
                            key={course.id}
                            href={route('courses.show', course.slug)}
                            className="overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md dark:bg-gray-800"
                        >
                            <div className="flex h-36 items-center justify-center bg-indigo-50 text-indigo-300 dark:bg-gray-700">
                                <span className="text-sm">لا توجد صورة</span>
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
                                <p className="mt-2 font-bold text-indigo-600">
                                    {course.is_free
                                        ? 'مجاني'
                                        : `${course.price} جنيه`}
                                </p>
                            </div>
                        </Link>
                    ))}

                    {courses.data.length === 0 && (
                        <p className="col-span-full text-center text-gray-500">
                            لا توجد كورسات منشورة حاليًا.
                        </p>
                    )}
                </div>
            </div>
        </SiteLayout>
    );
}
