<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class StaffController extends Controller
{
    public function index(): Response
    {
        $staff = User::role('moderator')->orderBy('name')->get()
            ->map(fn ($user) => [
                ...$user->only('id', 'name', 'email', 'is_active'),
                'permissions' => $user->getPermissionNames(),
            ]);

        return Inertia::render('Admin/Staff/Index', [
            'staff' => $staff,
            'availablePermissions' => $this->permissionLabels(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Staff/Create', [
            'availablePermissions' => $this->permissionLabels(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $password = Str::password(12);

        $staff = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($password),
        ]);
        $staff->assignRole('moderator');
        $staff->syncPermissions($data['permissions']);

        event(new Registered($staff));

        return redirect()->route('admin.staff.index')->with([
            'success' => 'تم إنشاء حساب عضو الفريق.',
            'generatedPassword' => $password,
            'generatedFor' => $staff->email,
        ]);
    }

    public function updatePermissions(Request $request, User $staff): RedirectResponse
    {
        abort_unless($staff->hasRole('moderator'), 404);

        $data = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $staff->syncPermissions($data['permissions']);

        return back()->with('success', 'تم تحديث صلاحيات عضو الفريق.');
    }

    public function toggleActive(User $staff): RedirectResponse
    {
        abort_unless($staff->hasRole('moderator'), 404);

        $staff->update(['is_active' => ! $staff->is_active]);

        return back()->with('success', $staff->is_active
            ? 'تم تفعيل الحساب.'
            : 'تم تعطيل الحساب.');
    }

    private function permissionLabels(): array
    {
        $labels = [
            'review_courses' => 'مراجعة واعتماد الكورسات',
            'manage_users' => 'إدارة حسابات المستخدمين',
            'manage_categories' => 'إدارة تصنيفات الكورسات',
            'manage_subscriptions' => 'إدارة خطط الاشتراك',
        ];

        return Permission::pluck('name')->mapWithKeys(
            fn ($name) => [$name => $labels[$name] ?? $name]
        )->all();
    }
}
