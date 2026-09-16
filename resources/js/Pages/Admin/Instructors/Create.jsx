import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        headline: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.instructors.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    إنشاء حساب محاضر
                </h2>
            }
        >
            <Head title="إنشاء حساب محاضر" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            هيتم توليد كلمة مرور مبدئية تلقائيًا، وهتظهر لك
                            مرة واحدة بعد الإنشاء عشان تبعتها للمحاضر.
                        </p>

                        <div>
                            <InputLabel htmlFor="name" value="اسم المحاضر" />
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
                            <InputLabel
                                htmlFor="headline"
                                value="لقب/تخصص المحاضر (اختياري)"
                            />
                            <TextInput
                                id="headline"
                                className="mt-1 block w-full"
                                placeholder="مثال: مطور ويب ومدرب معتمد"
                                value={data.headline}
                                onChange={(e) =>
                                    setData('headline', e.target.value)
                                }
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
