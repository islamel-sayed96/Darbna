import { usePage } from '@inertiajs/react';

export default function Flash() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.generatedPassword) {
        return null;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-3 px-4 pt-4 sm:px-6 lg:px-8">
            {flash?.success && (
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {flash.success}
                </div>
            )}

            {flash?.generatedPassword && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    <p>
                        كلمة المرور المبدئية لحساب{' '}
                        <strong>{flash.generatedFor}</strong> هي:{' '}
                        <code className="rounded bg-white px-2 py-0.5 font-mono text-amber-900 dark:bg-gray-800 dark:text-amber-200">
                            {flash.generatedPassword}
                        </code>
                    </p>
                    <p className="mt-1 text-xs">
                        سجّلها دلوقتي وابعتها للشخص ده بطريقة آمنة — مش هتظهر
                        تاني بعد ما تسيب الصفحة.
                    </p>
                </div>
            )}
        </div>
    );
}
