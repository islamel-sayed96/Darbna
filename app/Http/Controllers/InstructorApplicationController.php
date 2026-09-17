<?php

namespace App\Http\Controllers;

use App\Models\InstructorApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstructorApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('InstructorApplication/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        InstructorApplication::create($data);

        return back()->with('success', 'تم استلام طلبك، هنراجعه ونرد عليك على الإيميل قريبًا.');
    }
}
