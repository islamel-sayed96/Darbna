import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.cycles.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    سايكل جديد
                </h2>
            }
        >
            <Head title="سايكل جديد" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <div>
                            <InputLabel
                                htmlFor="title"
                                value="اسم السايكل (مثال: سايكل أكتوبر 2026)"
                            />
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
                                rows={4}
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
                                value="السعر (AED) — 0 يعني متاح بس بإضافة الأدمن"
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
                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>

                        <PrimaryButton disabled={processing}>
                            إنشاء السايكل
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
