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
        residence: '',
        cv: null,
        portfolio: '',
        course_title: '',
        course_syllabus: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('instructor-application.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <SiteLayout>
            <Head title="الانضمام كمحاضر" />

            <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    الانضمام كمحاضر
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    إذا كان لديك خبرة في مجال عملك وتريد الانضمام إلى
                    محاضرين منصة دربنا، املا البيانات دي وهنراجع طلبك
                    ونتواصل معاك على الإيميل.
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
                                htmlFor="residence"
                                value="مكان الإقامة"
                            />
                            <TextInput
                                id="residence"
                                className="mt-1 block w-full"
                                placeholder="مثال: القاهرة، مصر"
                                value={data.residence}
                                onChange={(e) =>
                                    setData('residence', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.residence}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="cv" value="السيرة الذاتية" />
                            <input
                                id="cv"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) =>
                                    setData('cv', e.target.files[0])
                                }
                                className="mt-1 block w-full text-sm text-gray-600 file:me-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-gray-300"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                PDF أو Word — بحد أقصى 5 ميجا.
                            </p>
                            <InputError
                                message={errors.cv}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="portfolio"
                                value="سابقة الأعمال (إن وجدت)"
                            />
                            <TextInput
                                id="portfolio"
                                className="mt-1 block w-full"
                                placeholder="رابط لأعمالك السابقة أو قناتك أو أي محتوى تعليمي قدمته"
                                value={data.portfolio}
                                onChange={(e) =>
                                    setData('portfolio', e.target.value)
                                }
                            />
                            <InputError
                                message={errors.portfolio}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="course_title"
                                value="عنوان الدورة التدريبية"
                            />
                            <TextInput
                                id="course_title"
                                className="mt-1 block w-full"
                                placeholder="مثال: أساسيات التصميم الجرافيكي من الصفر"
                                value={data.course_title}
                                onChange={(e) =>
                                    setData('course_title', e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.course_title}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="course_syllabus"
                                value="المادة العلمية للدورة التدريبية"
                            />
                            <textarea
                                id="course_syllabus"
                                rows={5}
                                placeholder="اكتب محاور الدورة والمواضيع اللي هتتغطى فيها"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                value={data.course_syllabus}
                                onChange={(e) =>
                                    setData(
                                        'course_syllabus',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.course_syllabus}
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
