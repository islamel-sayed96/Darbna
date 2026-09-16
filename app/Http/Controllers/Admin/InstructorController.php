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

class InstructorController extends Controller
{
    public function index(): Response
    {
        $instructors = User::role('instructor')
            ->withCount('coursesTaught')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Instructors/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'headline' => ['nullable', 'string', 'max:255'],
        ]);

        $password = Str::password(12);

        $instructor = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'headline' => $data['headline'] ?? null,
            'password' => Hash::make($password),
        ]);
        $instructor->assignRole('instructor');

        event(new Registered($instructor));

        return redirect()->route('admin.instructors.index')->with([
            'success' => 'تم إنشاء حساب المحاضر.',
            'generatedPassword' => $password,
            'generatedFor' => $instructor->email,
        ]);
    }

    public function toggleActive(User $instructor): RedirectResponse
    {
        abort_unless($instructor->hasRole('instructor'), 404);

        $instructor->update(['is_active' => ! $instructor->is_active]);

        return back()->with('success', $instructor->is_active
            ? 'تم تفعيل حساب المحاضر.'
            : 'تم تعطيل حساب المحاضر.');
    }
}
