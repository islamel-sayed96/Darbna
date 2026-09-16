import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdateAvatarForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const [preview, setPreview] = useState(user.avatar_url);
    const fileInput = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        avatar: null,
    });

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setData('avatar', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.avatar.update'), {
            forceFormData: true,
            onSuccess: () => reset('avatar'),
        });
    };

    const initials = user.name
        ?.split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('');

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    الصورة الشخصية
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    الصورة دي بتظهر في اسمك جنب التعليقات والملف الشخصي.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 flex items-center gap-4">
                {preview ? (
                    <img
                        src={preview}
                        alt={user.name}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        {initials}
                    </div>
                )}

                <div>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="block text-sm text-gray-600 file:me-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-gray-300"
                    />
                    <InputError message={errors.avatar} className="mt-2" />

                    <PrimaryButton
                        className="mt-2"
                        disabled={processing || !data.avatar}
                    >
                        حفظ الصورة
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
