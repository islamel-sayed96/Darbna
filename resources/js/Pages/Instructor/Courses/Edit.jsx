import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS = {
    draft: 'مسودة',
    pending_review: 'بانتظار المراجعة',
    approved: 'مقبول',
    rejected: 'مرفوض',
    published: 'منشور',
    unpublished: 'غير منشور',
};

function AddSectionForm({ course }) {
    const [title, setTitle] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setProcessing(true);
        router.post(
            route('instructor.sections.store', course.id),
            { title },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => setTitle(''),
            },
        );
    };

    return (
        <form onSubmit={submit} className="flex gap-2">
            <TextInput
                className="flex-1"
                placeholder="اسم القسم الجديد (مثال: مقدمة الكورس)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <PrimaryButton disabled={processing}>إضافة قسم</PrimaryButton>
        </form>
    );
}

function AddLessonForm({ section }) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('video');
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setProcessing(true);
        router.post(
            route('instructor.lessons.store', section.id),
            { title, type },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
                onSuccess: () => setTitle(''),
            },
        );
    };

    return (
        <form onSubmit={submit} className="mt-2 flex gap-2">
            <TextInput
                className="flex-1"
                placeholder="اسم الدرس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select
                className="rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="video">فيديو</option>
                <option value="text">نص</option>
                <option value="quiz">اختبار</option>
                <option value="live">حصة مباشرة</option>
            </select>
            <button
                type="submit"
                disabled={processing}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                + درس
            </button>
        </form>
    );
}

export default function Edit({ course, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        title: course.title,
        description: course.description ?? '',
        category_id: course.category_id ?? '',
        price: course.price,
        is_free: course.is_free,
        level: course.level,
        language: course.language,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('instructor.courses.update', course.id));
    };

    const submitForReview = () => {
        router.post(route('instructor.courses.submit', course.id));
    };

    const deleteSection = (sectionId) => {
        if (!confirm('هل تريد حذف هذا القسم وكل دروسه؟')) return;
        router.delete(route('instructor.sections.destroy', sectionId), {
            preserveScroll: true,
        });
    };

    const deleteLesson = (lessonId) => {
        if (!confirm('هل تريد حذف هذا الدرس؟')) return;
        router.delete(route('instructor.lessons.destroy', lessonId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        إدارة الكورس: {course.title}
                    </h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {STATUS_LABELS[course.status]}
                    </span>
                </div>
            }
        >
            <Head title={`إدارة: ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {course.status === 'rejected' &&
                        course.rejection_reason && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                                <strong>سبب الرفض: </strong>
                                {course.rejection_reason}
                            </div>
                        )}

                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            بيانات الكورس
                        </h3>

                        <div>
                            <InputLabel htmlFor="title" value="عنوان الكورس" />
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
                                value="وصف الكورس"
                            />
                            <textarea
                                id="description"
                                rows={4}
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
                                <InputLabel htmlFor="level" value="المستوى" />
                                <select
                                    id="level"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    value={data.level}
                                    onChange={(e) =>
                                        setData('level', e.target.value)
                                    }
                                >
                                    <option value="beginner">مبتدئ</option>
                                    <option value="intermediate">
                                        متوسط
                                    </option>
                                    <option value="advanced">متقدم</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="is_free"
                                type="checkbox"
                                checked={data.is_free}
                                onChange={(e) =>
                                    setData('is_free', e.target.checked)
                                }
                                className="rounded border-gray-300 text-indigo-600"
                            />
                            <InputLabel htmlFor="is_free" value="كورس مجاني" />
                        </div>

                        {!data.is_free && (
                            <div>
                                <InputLabel
                                    htmlFor="price"
                                    value="السعر (جنيه)"
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
                        )}

                        <PrimaryButton disabled={processing}>
                            حفظ التعديلات
                        </PrimaryButton>
                    </form>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                            محتوى الكورس (الأقسام والدروس)
                        </h3>

                        <div className="space-y-4">
                            {course.sections.map((section) => (
                                <div
                                    key={section.id}
                                    className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {section.title}
                                        </p>
                                        <button
                                            onClick={() =>
                                                deleteSection(section.id)
                                            }
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            حذف القسم
                                        </button>
                                    </div>

                                    <ul className="mt-2 space-y-1">
                                        {section.lessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700"
                                            >
                                                <span className="text-gray-700 dark:text-gray-200">
                                                    {lesson.title}{' '}
                                                    <span className="text-xs text-gray-400">
                                                        ({lesson.type})
                                                    </span>
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        deleteLesson(
                                                            lesson.id,
                                                        )
                                                    }
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    حذف
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <AddLessonForm section={section} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <AddSectionForm course={course} />
                        </div>
                    </div>

                    {['draft', 'rejected'].includes(course.status) && (
                        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                                لما يخلص المحتوى، ابعت الكورس لمراجعة الأدمن
                                عشان ينشره.
                            </p>
                            <button
                                onClick={submitForReview}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                            >
                                إرسال الكورس للمراجعة
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
