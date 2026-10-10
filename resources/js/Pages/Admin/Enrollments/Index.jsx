import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

const TYPE_LABELS = {
    course: 'كورس',
    material: 'مادة علمية',
    cycle: 'سايكل',
};

const CONTENT_CLASS_LABELS = {
    'App\\Models\\Material': 'مادة علمية',
    'App\\Models\\Cycle': 'سايكل',
};

export default function Index({
    courses,
    materials,
    cycles,
    manualEnrollments,
    manualContentAccesses,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'course',
        email: '',
        content_id: '',
    });

    const optionsForType = {
        course: courses,
        material: materials,
        cycle: cycles,
    }[data.type];

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.enrollments.store'), {
            preserveScroll: true,
            onSuccess: () => reset('content_id'),
        });
    };

    const cancelEnrollment = (enrollment) => {
        if (
            !confirm(
                `تلغي تسجيل ${enrollment.user.name} في "${enrollment.course.title}"؟`,
            )
        )
            return;
        router.delete(route('admin.enrollments.destroy', enrollment.id), {
            preserveScroll: true,
        });
    };

    const cancelContentAccess = (access) => {
        if (!confirm(`تلغي وصول ${access.user.name}؟`)) return;
        router.delete(
            route('admin.content-accesses.destroy', access.id),
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    فتح أكسيس يدوي
                </h2>
            }
        >
            <Head title="فتح أكسيس يدوي" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        استخدم النموذج ده لفتح كورس أو مادة علمية أو سايكل
                        لطالب مباشرة من غير دفع — مثلًا لو فيه اتفاق خاص أو
                        دفع تم خارج الموقع.
                    </p>

                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <div>
                            <label className="text-sm text-gray-600 dark:text-gray-300">
                                نوع المحتوى
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={data.type}
                                onChange={(e) => {
                                    setData('type', e.target.value);
                                    setData('content_id', '');
                                }}
                            >
                                {Object.entries(TYPE_LABELS).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 dark:text-gray-300">
                                البريد الإلكتروني للطالب
                            </label>
                            <TextInput
                                type="email"
                                className="mt-1 w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 dark:text-gray-300">
                                {TYPE_LABELS[data.type]}
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={data.content_id}
                                onChange={(e) =>
                                    setData('content_id', e.target.value)
                                }
                            >
                                <option value="">
                                    اختار {TYPE_LABELS[data.type]}
                                </option>
                                {optionsForType.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.content_id}
                                className="mt-1"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            فتح الأكسيس
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
                            تسجيلات الكورسات اليدوية
                        </div>
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الطالب</th>
                                    <th className="px-6 py-3">الكورس</th>
                                    <th className="px-6 py-3">تاريخ التسجيل</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {manualEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td className="px-6 py-3 text-gray-900 dark:text-white">
                                            {enrollment.user.name}
                                            <div className="text-xs text-gray-500">
                                                {enrollment.user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                            {enrollment.course.title}
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {new Date(
                                                enrollment.enrolled_at,
                                            ).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    cancelEnrollment(enrollment)
                                                }
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                إلغاء
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {manualEnrollments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لسه مفيش تسجيلات يدوية.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
                            أكسيس المواد العلمية والسايكلات
                        </div>
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الطالب</th>
                                    <th className="px-6 py-3">النوع</th>
                                    <th className="px-6 py-3">المحتوى</th>
                                    <th className="px-6 py-3">تاريخ الفتح</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {manualContentAccesses.map((access) => (
                                    <tr key={access.id}>
                                        <td className="px-6 py-3 text-gray-900 dark:text-white">
                                            {access.user.name}
                                            <div className="text-xs text-gray-500">
                                                {access.user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                            {CONTENT_CLASS_LABELS[
                                                access.accessible_type
                                            ] ?? access.accessible_type}
                                        </td>
                                        <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                                            {access.accessible?.title ?? '—'}
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {new Date(
                                                access.granted_at,
                                            ).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-3">
                                            <button
                                                onClick={() =>
                                                    cancelContentAccess(access)
                                                }
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                إلغاء
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {manualContentAccesses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لسه مفيش أكسيس يدوي لمواد أو
                                            سايكلات.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
