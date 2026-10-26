import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function InteractiveHtmlForm({ material }) {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setProcessing(true);
        setError('');
        router.post(route('admin.materials.html.store', material.id), formData, {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => setProcessing(false),
            onSuccess: () => setFile(null),
            onError: (errors) => setError(errors.file ?? ''),
        });
    };

    const remove = () => {
        if (!confirm('تحذف الصفحة التفاعلية؟ المادة هترجع تعرض الصفحات النصية العادية.'))
            return;
        router.delete(route('admin.materials.html.destroy', material.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                صفحة تفاعلية كاملة (بديل للصفحات النصية)
            </h3>
            <p className="mb-4 text-sm text-gray-500">
                ارفع ملف HTML واحد مستقل، أو ملف ZIP لو المشروع فيه أكتر من
                ملف (HTML + CSS + JS + صور) — لازم يبقى فيه ملف اسمه بالظبط{' '}
                <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">
                    index.html
                </code>{' '}
                في جذر الملف المضغوط أو جوه فولدر واحد بس. هيتعرض للطالب بدل
                صفحات المادة العادية، ورفع ملف جديد بيستبدل القديم بالكامل.
            </p>

            {material.html_path ? (
                <div className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700">
                    <span className="text-green-700 dark:text-green-400">
                        ✓ فيه صفحة تفاعلية مرفوعة حاليًا
                    </span>
                    <button
                        onClick={remove}
                        className="text-xs text-red-600 hover:underline"
                    >
                        حذف
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    لسه مفيش صفحة تفاعلية مرفوعة.
                </p>
            )}

            <form onSubmit={submit} className="mt-4 flex items-end gap-2">
                <input
                    type="file"
                    accept=".html,.htm,.zip"
                    className="block flex-1 text-sm text-gray-700 dark:text-gray-200"
                    onChange={(e) => setFile(e.target.files[0] ?? null)}
                />
                <button
                    type="submit"
                    disabled={processing || !file}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    {processing ? 'جاري الرفع...' : 'رفع'}
                </button>
            </form>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function AddPageForm({ material }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setProcessing(true);
        router.post(
            route('admin.material-pages.store', material.id),
            { title, content },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setTitle('');
                    setContent('');
                },
            },
        );
    };

    return (
        <form onSubmit={submit} className="mt-4 space-y-2">
            <TextInput
                className="block w-full"
                placeholder="عنوان الصفحة"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                rows={8}
                className="block w-full rounded-md border-gray-300 font-mono text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="محتوى الصفحة العلمي... (بيدعم Markdown: ## عنوان، **عريض**، - نقاط، > اقتباس، ![صورة](رابط))"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                type="submit"
                disabled={processing}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                + إضافة صفحة
            </button>
        </form>
    );
}

export default function Edit({ material, categories, courses }) {
    const { data, setData, put, processing, errors } = useForm({
        title: material.title,
        description: material.description ?? '',
        category_id: material.category_id ?? '',
        course_id: material.course_id ?? '',
        price: material.price,
        is_published: material.is_published,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.materials.update', material.id));
    };

    const deletePage = (pageId) => {
        if (!confirm('تحذف الصفحة دي؟')) return;
        router.delete(route('admin.material-pages.destroy', pageId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        إدارة المادة: {material.title}
                    </h2>
                    <a
                        href={route('materials.show', material.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30"
                    >
                        معاينة كطالب ↗
                    </a>
                </div>
            }
        >
            <Head title={`إدارة: ${material.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            بيانات المادة
                        </h3>

                        <div>
                            <InputLabel htmlFor="title" value="عنوان المادة" />
                            <TextInput
                                id="title"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="وصف المادة"
                            />
                            <textarea
                                id="description"
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="category_id"
                                    value="التصنيف"
                                />
                                <select
                                    id="category_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData(
                                            'category_id',
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">بدون تصنيف</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="course_id"
                                    value="ملحقة بكورس"
                                />
                                <select
                                    id="course_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    value={data.course_id}
                                    onChange={(e) =>
                                        setData('course_id', e.target.value)
                                    }
                                >
                                    <option value="">مستقلة</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="price"
                                value="السعر (AED) — 0 يعني مجانية"
                            />
                            <TextInput
                                id="price"
                                type="number"
                                min="0"
                                className="mt-1 block w-full"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_published"
                                type="checkbox"
                                checked={data.is_published}
                                onChange={(e) =>
                                    setData('is_published', e.target.checked)
                                }
                                className="rounded border-gray-300 text-brand-600"
                            />
                            <InputLabel
                                htmlFor="is_published"
                                value="منشورة (تظهر للطلاب)"
                            />
                        </div>

                        <PrimaryButton disabled={processing}>
                            حفظ التعديلات
                        </PrimaryButton>
                    </form>

                    <InteractiveHtmlForm material={material} />

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            صفحات المادة
                        </h3>

                        <ul className="space-y-1">
                            {material.pages.map((page) => (
                                <li
                                    key={page.id}
                                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700"
                                >
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {page.title}
                                    </span>
                                    <span className="flex items-center gap-3">
                                        <Link
                                            href={route(
                                                'admin.material-pages.quiz.edit',
                                                page.id,
                                            )}
                                            className="text-xs text-brand-600 hover:underline"
                                        >
                                            الاختبار
                                        </Link>
                                        <button
                                            onClick={() => deletePage(page.id)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            حذف
                                        </button>
                                    </span>
                                </li>
                            ))}

                            {material.pages.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    لسه مفيش صفحات.
                                </p>
                            )}
                        </ul>

                        <AddPageForm material={material} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
