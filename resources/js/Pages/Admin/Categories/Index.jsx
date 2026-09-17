import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function EditableRow({ category }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(category.name);
    const [processing, setProcessing] = useState(false);

    const save = () => {
        setProcessing(true);
        router.put(
            route('admin.categories.update', category.id),
            { name },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setEditing(false);
                },
            },
        );
    };

    const destroy = () => {
        if (!confirm(`تحذف تصنيف "${category.name}"؟`)) return;
        router.delete(route('admin.categories.destroy', category.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr>
            <td className="px-6 py-3">
                {editing ? (
                    <TextInput
                        className="w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : (
                    <span className="text-gray-900 dark:text-white">
                        {category.name}
                    </span>
                )}
            </td>
            <td className="px-6 py-3 text-gray-500">
                {category.courses_count}
            </td>
            <td className="space-x-3 space-x-reverse px-6 py-3">
                {editing ? (
                    <>
                        <button
                            onClick={save}
                            disabled={processing}
                            className="text-sm font-medium text-green-600 hover:underline"
                        >
                            حفظ
                        </button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                setName(category.name);
                            }}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            إلغاء
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="text-sm font-medium text-brand-600 hover:underline"
                        >
                            تعديل
                        </button>
                        <button
                            onClick={destroy}
                            className="text-sm font-medium text-red-600 hover:underline"
                        >
                            حذف
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}

export default function Index({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    تصنيفات الكورسات
                </h2>
            }
        >
            <Head title="تصنيفات الكورسات" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="flex items-start gap-3 rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                        <div className="flex-1">
                            <TextInput
                                className="w-full"
                                placeholder="اسم التصنيف الجديد"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="mt-1"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + إضافة
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-3">الاسم</th>
                                    <th className="px-6 py-3">عدد الكورسات</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {categories.map((category) => (
                                    <EditableRow
                                        key={category.id}
                                        category={category}
                                    />
                                ))}

                                {categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            لسه مفيش تصنيفات.
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
