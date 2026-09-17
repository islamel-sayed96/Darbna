import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const DURATION_LABELS = { 1: 'شهر', 3: '3 شهور', 6: '6 شهور', 12: 'سنة' };

function EditableRow({ plan, accessTypes }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: plan.name,
        price: plan.price,
        badge: plan.badge ?? '',
        is_active: plan.is_active,
    });
    const [processing, setProcessing] = useState(false);

    const save = () => {
        setProcessing(true);
        router.put(
            route('admin.subscription-plans.update', plan.id),
            {
                ...form,
                currency: plan.currency,
                duration_months: plan.duration_months,
                access_type: plan.access_type,
                course_limit: plan.course_limit,
                path_limit: plan.path_limit,
                description: plan.description,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setEditing(false);
                },
            },
        );
    };

    const toggleActive = () => {
        router.put(
            route('admin.subscription-plans.update', plan.id),
            {
                name: plan.name,
                price: plan.price,
                badge: plan.badge,
                currency: plan.currency,
                duration_months: plan.duration_months,
                access_type: plan.access_type,
                course_limit: plan.course_limit,
                path_limit: plan.path_limit,
                description: plan.description,
                is_active: !plan.is_active,
            },
            { preserveScroll: true },
        );
    };

    const destroy = () => {
        if (!confirm(`تحذف خطة "${plan.name}"؟`)) return;
        router.delete(route('admin.subscription-plans.destroy', plan.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr>
            <td className="px-4 py-3 text-gray-500">
                {accessTypes[plan.access_type]}
            </td>
            <td className="px-4 py-3 text-gray-500">
                {DURATION_LABELS[plan.duration_months]}
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <TextInput
                        className="w-full"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                ) : (
                    <span className="text-gray-900 dark:text-white">
                        {plan.name}
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <TextInput
                        type="number"
                        className="w-24"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                    />
                ) : (
                    <span>
                        {plan.price} {plan.currency}
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                {editing ? (
                    <TextInput
                        className="w-32"
                        placeholder="بدون شارة"
                        value={form.badge}
                        onChange={(e) =>
                            setForm({ ...form, badge: e.target.value })
                        }
                    />
                ) : (
                    plan.badge ?? '—'
                )}
            </td>
            <td className="px-4 py-3">
                <button
                    onClick={toggleActive}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        plan.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700'
                    }`}
                >
                    {plan.is_active ? 'مفعّلة' : 'معطّلة'}
                </button>
            </td>
            <td className="space-x-3 space-x-reverse px-4 py-3">
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
                            onClick={() => setEditing(false)}
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

export default function Index({ plans, accessTypes }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        currency: 'AED',
        duration_months: 1,
        access_type: Object.keys(accessTypes)[0],
        course_limit: '',
        path_limit: '',
        description: '',
        badge: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.subscription-plans.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowCreate(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    خطط الاشتراك
                </h2>
            }
        >
            <Head title="خطط الاشتراك" />

            <div className="py-12">
                <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowCreate((s) => !s)}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            {showCreate ? 'إلغاء' : '+ خطة جديدة'}
                        </button>
                    </div>

                    {showCreate && (
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:grid-cols-2"
                        >
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    اسم الخطة
                                </label>
                                <TextInput
                                    className="mt-1 w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    السعر (AED)
                                </label>
                                <TextInput
                                    type="number"
                                    className="mt-1 w-full"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    المدة
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={data.duration_months}
                                    onChange={(e) =>
                                        setData(
                                            'duration_months',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    {Object.entries(DURATION_LABELS).map(
                                        ([months, label]) => (
                                            <option key={months} value={months}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    نوع الوصول
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    value={data.access_type}
                                    onChange={(e) =>
                                        setData('access_type', e.target.value)
                                    }
                                >
                                    {Object.entries(accessTypes).map(
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
                                    عدد الكورسات (لخطة "اختيار كورسات" فقط)
                                </label>
                                <TextInput
                                    type="number"
                                    className="mt-1 w-full"
                                    value={data.course_limit}
                                    onChange={(e) =>
                                        setData('course_limit', e.target.value)
                                    }
                                />
                                <InputError message={errors.course_limit} />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    عدد المسارات (لخطط المسارات فقط)
                                </label>
                                <TextInput
                                    type="number"
                                    className="mt-1 w-full"
                                    value={data.path_limit}
                                    onChange={(e) =>
                                        setData('path_limit', e.target.value)
                                    }
                                />
                                <InputError message={errors.path_limit} />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    شارة (اختياري)
                                </label>
                                <TextInput
                                    className="mt-1 w-full"
                                    value={data.badge}
                                    onChange={(e) =>
                                        setData('badge', e.target.value)
                                    }
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    الوصف
                                </label>
                                <textarea
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                                >
                                    حفظ الخطة
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3">نوع الوصول</th>
                                    <th className="px-4 py-3">المدة</th>
                                    <th className="px-4 py-3">الاسم</th>
                                    <th className="px-4 py-3">السعر</th>
                                    <th className="px-4 py-3">الشارة</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {plans.map((plan) => (
                                    <EditableRow
                                        key={plan.id}
                                        plan={plan}
                                        accessTypes={accessTypes}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
