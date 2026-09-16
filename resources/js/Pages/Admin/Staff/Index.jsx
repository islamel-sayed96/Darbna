import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ staff, availablePermissions }) {
    const toggleActive = (member) => {
        router.post(
            route('admin.staff.toggle-active', member.id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    فريق الإدارة (موديريتورز)
                </h2>
            }
        >
            <Head title="فريق الإدارة" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end">
                        <Link
                            href={route('admin.staff.create')}
                            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
                        >
                            + إضافة عضو فريق
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {staff.map((member) => (
                            <div
                                key={member.id}
                                className="rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {member.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                member.is_active
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                            }`}
                                        >
                                            {member.is_active
                                                ? 'مفعّل'
                                                : 'موقوف'}
                                        </span>
                                        <button
                                            onClick={() =>
                                                toggleActive(member)
                                            }
                                            className="text-sm font-medium text-brand-600 hover:underline"
                                        >
                                            {member.is_active
                                                ? 'إيقاف'
                                                : 'تفعيل'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {member.permissions.map((permission) => (
                                        <span
                                            key={permission}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                        >
                                            {availablePermissions[
                                                permission
                                            ] ?? permission}
                                        </span>
                                    ))}
                                    {member.permissions.length === 0 && (
                                        <span className="text-xs text-gray-400">
                                            مفيش صلاحيات متاحة له
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {staff.length === 0 && (
                            <p className="text-sm text-gray-500">
                                لسه مفيش أعضاء فريق مضافين.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
