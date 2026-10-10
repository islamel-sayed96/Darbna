import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories, courses }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        course_id: '',
        price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.materials.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    مادة علمية جديدة
                </h2>
            }
        >
            <Head title="مادة علمية جديدة" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <form
                        onSubmit={submit}
                        className="space-y-5 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                    >
                        <div>
                            <InputLabel htmlFor="title" value="عنوان المادة" />
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
                                value="وصف المادة"
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

                        <div className="grid grid-cols-2 gap-4">
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
                                        setData(
                                            'category_id',
                                            e.target.value,
                                        )
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
                                    htmlFor="course_id"
                                    value="ملحقة بكورس (اختياري)"
                                />
                                <select
                                    id="course_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    value={data.course_id}
                                    onChange={(e) =>
                                        setData('course_id', e.target.value)
                                    }
                                >
                                    <option value="">
                                        مستقلة (مش مرتبطة بكورس)
                                    </option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="price"
                                value="السعر (AED) — 0 يعني مجانية"
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
                            إنشاء المادة
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
