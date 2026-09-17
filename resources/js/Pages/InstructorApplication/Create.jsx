import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('instructor-application.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <SiteLayout>
            <Head title="انضم كمحاضر" />

            <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    انضم كمحاضر في دربنا
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    املا الفورم وهنراجع طلبك ونتواصل معاك على الإيميل. بعد
                    القبول هيتعمل لك حساب محاضر تقدر تبدأ بيه ترفع كورساتك.
                </p>

                {flash?.success ? (
                    <div className="mt-8 rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
                        <p className="text-green-700 dark:text-green-400">
                            {flash.success}
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        className="mt-8 space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <div>
                            <InputLabel htmlFor="name" value="الاسم بالكامل" />
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
                                htmlFor="phone"
                                value="رقم الموبايل (اختياري)"
                            />
                            <TextInput
                                id="phone"
                                className="mt-1 block w-full"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="message"
                                value="حدثنا عن خبرتك وإيه اللي حابب تعلّمه"
                            />
                            <textarea
                                id="message"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                value={data.message}
                                onChange={(e) =>
                                    setData('message', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.message}
                                className="mt-2"
                            />
                        </div>

                        <PrimaryButton disabled={processing}>
                            إرسال الطلب
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </SiteLayout>
    );
}
