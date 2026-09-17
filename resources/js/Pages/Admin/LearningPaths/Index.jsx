import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ paths }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        is_published: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.learning-paths.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const destroy = (path) => {
        if (!confirm(`تحذف مسار "${path.title}"؟ الكورسات جواه هتفضل موجودة بس من غير مسار.`))
            return;
        router.delete(route('admin.learning-paths.destroy', path.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    مسارات التعلم
                </h2>
            }
        >
            <Head title="مسارات التعلم" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                        <TextInput
                            className="w-full"
                            placeholder="اسم المسار (مثال: مسار تصميم الجرافيك)"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />
                        <textarea
                            rows={2}
                            className="block w-full rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            placeholder="وصف مختصر (اختياري)"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + إنشاء مسار
                        </button>
                    </form>

                    <div className="space-y-3">
                        {paths.map((path) => (
                            <div
                                key={path.id}
                                className="flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                            >
                                <div>
                                    <Link
                                        href={route(
                                            'admin.learning-paths.show',
                                            path.id,
                                        )}
                                        className="font-semibold text-gray-900 hover:underline dark:text-white"
                                    >
                                        {path.title}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        {path.courses_count} كورسات —{' '}
                                        {path.is_published
                                            ? 'منشور'
                                            : 'غير منشور'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => destroy(path)}
                                    className="text-sm font-medium text-red-600 hover:underline"
                                >
                                    حذف
                                </button>
                            </div>
                        ))}

                        {paths.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لسه مفيش مسارات.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
