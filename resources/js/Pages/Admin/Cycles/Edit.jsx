import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function AddLectureForm({ cycle }) {
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim() || !videoUrl.trim()) return;
        setProcessing(true);
        router.post(
            route('admin.cycle-lectures.store', cycle.id),
            { title, video_url: videoUrl },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setTitle('');
                    setVideoUrl('');
                },
            },
        );
    };

    return (
        <form onSubmit={submit} className="mt-4 space-y-2">
            <TextInput
                className="block w-full"
                placeholder="عنوان المحاضرة"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextInput
                className="block w-full"
                placeholder="رابط يوتيوب أو رابط تسجيل زووم — https://youtu.be/... أو https://zoom.us/rec/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button
                type="submit"
                disabled={processing}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                + إضافة محاضرة
            </button>
        </form>
    );
}

function AddCycleMaterialForm({ cycle, materials }) {
    const [type, setType] = useState('link');
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [materialId, setMaterialId] = useState('');
    const [pdf, setPdf] = useState(null);
    const [processing, setProcessing] = useState(false);

    const reset = () => {
        setTitle('');
        setUrl('');
        setMaterialId('');
        setPdf(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (type === 'link' && (!title.trim() || !url.trim())) return;
        if (type === 'material' && !materialId) return;
        if (type === 'pdf' && (!title.trim() || !pdf)) return;

        const formData = new FormData();
        formData.append('type', type);
        if (title) formData.append('title', title);
        if (type === 'link') formData.append('url', url);
        if (type === 'material') formData.append('material_id', materialId);
        if (type === 'pdf') formData.append('pdf', pdf);

        setProcessing(true);
        router.post(route('admin.cycle-materials.store', cycle.id), formData, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: reset,
        });
    };

    return (
        <form onSubmit={submit} className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        checked={type === 'link'}
                        onChange={() => setType('link')}
                    />
                    رابط خارجي
                </label>
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        checked={type === 'material'}
                        onChange={() => setType('material')}
                    />
                    مادة علمية من الموقع
                </label>
                <label className="flex items-center gap-1.5">
                    <input
                        type="radio"
                        checked={type === 'pdf'}
                        onChange={() => setType('pdf')}
                    />
                    ملف PDF (معاينة بدون تحميل سهل)
                </label>
            </div>

            {type === 'link' && (
                <>
                    <TextInput
                        className="block w-full"
                        placeholder="عنوان المادة"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextInput
                        className="block w-full"
                        placeholder="الرابط — https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </>
            )}

            {type === 'material' && (
                <select
                    className="block w-full rounded-md border-gray-300 text-sm shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                >
                    <option value="">اختر مادة علمية...</option>
                    {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                            {material.title}
                        </option>
                    ))}
                </select>
            )}

            {type === 'pdf' && (
                <>
                    <TextInput
                        className="block w-full"
                        placeholder="عنوان المادة"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="file"
                        accept="application/pdf"
                        className="block w-full text-sm text-gray-700 dark:text-gray-200"
                        onChange={(e) => setPdf(e.target.files[0] ?? null)}
                    />
                    <p className="text-xs text-gray-500">
                        الملف هيفتح في معاينة داخل الموقع من غير زرار تحميل
                        ظاهر — ده بيقلل التحميل العشوائي، بس مش حماية كاملة
                        100% (أي حد عنده خبرة تقنية يقدر يحفظه برضو).
                    </p>
                </>
            )}

            <button
                type="submit"
                disabled={processing}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                {processing ? 'جاري الإضافة...' : '+ إضافة مادة علمية'}
            </button>
        </form>
    );
}

export default function Edit({ cycle, categories, materials }) {
    const { data, setData, put, processing, errors } = useForm({
        title: cycle.title,
        description: cycle.description ?? '',
        category_id: cycle.category_id ?? '',
        price: cycle.price,
        is_published: cycle.is_published,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.cycles.update', cycle.id));
    };

    const deleteLecture = (lectureId) => {
        if (!confirm('تحذف المحاضرة دي؟')) return;
        router.delete(route('admin.cycle-lectures.destroy', lectureId), {
            preserveScroll: true,
        });
    };

    const deleteCycleMaterial = (cycleMaterialId) => {
        if (!confirm('تحذف المادة العلمية دي من السايكل؟')) return;
        router.delete(
            route('admin.cycle-materials.destroy', cycleMaterialId),
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    إدارة السايكل: {cycle.title}
                </h2>
            }
        >
            <Head title={`إدارة: ${cycle.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            بيانات السايكل
                        </h3>

                        <div>
                            <InputLabel htmlFor="title" value="اسم السايكل" />
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
                                value="وصف السايكل"
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
                                    setData('category_id', e.target.value)
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
                                htmlFor="price"
                                value="السعر (AED)"
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
                                value="منشور (يظهر للطلاب)"
                            />
                        </div>

                        <PrimaryButton disabled={processing}>
                            حفظ التعديلات
                        </PrimaryButton>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            محاضرات السايكل
                        </h3>

                        <ul className="space-y-1">
                            {cycle.lectures.map((lecture) => (
                                <li
                                    key={lecture.id}
                                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700"
                                >
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {lecture.title}
                                    </span>
                                    <button
                                        onClick={() =>
                                            deleteLecture(lecture.id)
                                        }
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        حذف
                                    </button>
                                </li>
                            ))}

                            {cycle.lectures.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    لسه مفيش محاضرات.
                                </p>
                            )}
                        </ul>

                        <AddLectureForm cycle={cycle} />
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            المواد العلمية المرفقة (مجانية لمسجلي السايكل)
                        </h3>

                        <ul className="space-y-1">
                            {cycle.material_entries.map((entry) => (
                                <li
                                    key={entry.id}
                                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700"
                                >
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {entry.title}
                                        {entry.type === 'material' && (
                                            <span className="ms-2 text-xs text-brand-600">
                                                (مادة من الموقع)
                                            </span>
                                        )}
                                        {entry.type === 'pdf' && (
                                            <span className="ms-2 text-xs text-brand-600">
                                                (PDF محمي)
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        onClick={() =>
                                            deleteCycleMaterial(entry.id)
                                        }
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        حذف
                                    </button>
                                </li>
                            ))}

                            {cycle.material_entries.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    لسه مفيش مواد علمية مرفقة.
                                </p>
                            )}
                        </ul>

                        <AddCycleMaterialForm
                            cycle={cycle}
                            materials={materials}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
