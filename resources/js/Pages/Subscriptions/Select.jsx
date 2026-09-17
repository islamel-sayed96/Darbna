import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Select({ subscription, limit, kind, options }) {
    const { data, setData, post, processing, errors } = useForm({
        ids: [],
    });

    const label = kind === 'paths' ? 'مسار' : 'كورس';

    const toggle = (id) => {
        setData(
            'ids',
            data.ids.includes(id)
                ? data.ids.filter((existing) => existing !== id)
                : data.ids.length < limit
                  ? [...data.ids, id]
                  : data.ids,
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('subscriptions.select.update', subscription.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    اختار محتوى اشتراكك
                </h2>
            }
        >
            <Head title="اختيار الكورسات" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <p className="text-gray-700 dark:text-gray-200">
                        خطة{' '}
                        <span className="font-semibold">
                            {subscription.plan_name}
                        </span>{' '}
                        بتديك وصول لـ{' '}
                        <span className="font-semibold">
                            {limit} {label}
                            {limit > 1 ? 'ات' : ''}
                        </span>
                        . اختار{' '}
                        {limit === 1 ? `${label} واحد` : `${limit} ${label}ات`}{' '}
                        من القائمة تحت — الاختيار ده نهائي لمدة الاشتراك.
                    </p>

                    <form onSubmit={submit} className="mt-6">
                        <div className="max-h-96 space-y-2 overflow-y-auto">
                            {options.map((option) => {
                                const checked = data.ids.includes(option.id);

                                return (
                                    <label
                                        key={option.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                                            checked
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                toggle(option.id)
                                            }
                                            disabled={
                                                !checked &&
                                                data.ids.length >= limit
                                            }
                                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <span className="text-gray-800 dark:text-gray-100">
                                            {option.title}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {errors.ids && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.ids}
                            </p>
                        )}

                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            اخترت {data.ids.length} من {limit}
                        </p>

                        <button
                            type="submit"
                            disabled={
                                processing || data.ids.length !== limit
                            }
                            className="mt-4 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
                        >
                            تأكيد الاختيار
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
