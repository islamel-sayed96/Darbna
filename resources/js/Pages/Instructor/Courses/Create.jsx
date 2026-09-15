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
        is_free: true,
        level: 'beginner',
        language: 'ar',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    إنشاء كورس جديد
                </h2>
            }
        >
            <Head title="إنشاء كورس جديد" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
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
                            <InputLabel htmlFor="description" value="وصف الكورس" />
                            <textarea
                                id="description"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="category_id" value="التصنيف" />
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
                            <InputLabel
                                htmlFor="is_free"
                                value="كورس مجاني (متاح لكل الطلاب بدون اشتراك)"
                            />
                        </div>

                        {!data.is_free && (
                            <div>
                                <InputLabel htmlFor="price" value="السعر (جنيه)" />
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
                                <p className="mt-1 text-xs text-gray-500">
                                    الكورسات غير المجانية متاحة حاليًا لأصحاب
                                    الاشتراك الفعّال.
                                </p>
                            </div>
                        )}

                        <PrimaryButton disabled={processing}>
                            إنشاء الكورس كمسودة
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
