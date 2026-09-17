<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstructorApplication;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InstructorApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString() ?: 'pending';

        $applications = InstructorApplication::query()
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/InstructorApplications/Index', [
            'applications' => $applications,
            'filters' => ['status' => $status],
        ]);
    }

    public function approve(InstructorApplication $instructorApplication): RedirectResponse
    {
        abort_unless($instructorApplication->status === 'pending', 422, 'الطلب ده اتراجع بالفعل.');

        if (User::where('email', $instructorApplication->email)->exists()) {
            return back()->with('success', 'فيه حساب بنفس الإيميل ده بالفعل — راجع حسابات المحاضرين.');
        }

        $password = Str::password(12);

        $instructor = User::create([
            'name' => $instructorApplication->name,
            'email' => $instructorApplication->email,
            'password' => Hash::make($password),
        ]);
        $instructor->assignRole('instructor');
        event(new Registered($instructor));

        $instructorApplication->update([
            'status' => 'approved',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
            'created_user_id' => $instructor->id,
        ]);

        return back()->with([
            'success' => 'تم قبول الطلب وإنشاء حساب المحاضر.',
            'generatedPassword' => $password,
            'generatedFor' => $instructor->email,
        ]);
    }

    public function reject(InstructorApplication $instructorApplication): RedirectResponse
    {
        abort_unless($instructorApplication->status === 'pending', 422, 'الطلب ده اتراجع بالفعل.');

        $instructorApplication->update([
            'status' => 'rejected',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'تم رفض الطلب.');
    }
}
