import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function Index({ courses, manualEnrollments }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        course_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.enrollments.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    تسجيل طالب يدويًا
                </h2>
            }
        >
            <Head title="تسجيل يدوي" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        استخدم النموذج ده لتسجيل طالب في كورس مباشرة، من غير
                        اشتراك — مثلًا لو فيه اتفاق خاص أو وصول استثنائي لكورس
                        معيّن.
                    </p>

                    <form
                        onSubmit={submit}
                        className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
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
                                الكورس
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={data.course_id}
                                onChange={(e) =>
                                    setData('course_id', e.target.value)
                                }
                            >
                                <option value="">اختار كورس</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                        {course.is_free ? ' (مجاني)' : ''}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.course_id}
                                className="mt-1"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            تسجيل الطالب
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
