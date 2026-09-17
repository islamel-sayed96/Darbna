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
            'residence' => ['required', 'string', 'max:255'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'portfolio' => ['nullable', 'string', 'max:500'],
            'course_title' => ['required', 'string', 'max:255'],
            'course_syllabus' => ['required', 'string', 'max:4000'],
        ]);

        $cvPath = $request->file('cv')->store('instructor-applications/cvs', 'public');
        unset($data['cv']);

        InstructorApplication::create([...$data, 'cv_path' => $cvPath]);

        return back()->with('success', 'تم استلام طلبك، هنراجعه ونرد عليك على الإيميل قريبًا.');
    }
}
