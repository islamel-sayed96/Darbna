import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ availablePermissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        permissions: [],
    });

    const togglePermission = (permission) => {
        setData(
            'permissions',
            data.permissions.includes(permission)
                ? data.permissions.filter((p) => p !== permission)
                : [...data.permissions, permission],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.staff.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    إضافة عضو فريق (موديريتور)
                </h2>
            }
        >
            <Head title="إضافة عضو فريق" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            هيتم توليد كلمة مرور مبدئية تلقائيًا، وهتظهر لك
                            مرة واحدة بعد الإنشاء عشان تبعتها للشخص ده.
                        </p>

                        <div>
                            <InputLabel htmlFor="name" value="الاسم" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="البريد الإلكتروني"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel value="الصلاحيات" />
                            <div className="mt-2 space-y-2">
                                {Object.entries(availablePermissions).map(
                                    ([key, label]) => (
                                        <label
                                            key={key}
                                            className="flex items-center gap-2 rounded-md border border-gray-200 p-3 text-sm dark:border-gray-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(
                                                    key,
                                                )}
                                                onChange={() =>
                                                    togglePermission(key)
                                                }
                                                className="rounded border-gray-300 text-brand-600"
                                            />
                                            {label}
                                        </label>
                                    ),
                                )}
                            </div>
                            <InputError
                                message={errors.permissions}
                                className="mt-2"
                            />
                        </div>

                        <PrimaryButton disabled={processing}>
                            إنشاء الحساب
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
