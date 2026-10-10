<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentAccess;
use App\Models\Course;
use App\Models\Cycle;
use App\Models\Enrollment;
use App\Models\Material;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    private const TYPE_MODELS = [
        'course' => Course::class,
        'material' => Material::class,
        'cycle' => Cycle::class,
    ];

    public function index(): Response
    {
        return Inertia::render('Admin/Enrollments/Index', [
            'courses' => Course::query()
                ->where('status', 'published')
                ->orderBy('title')
                ->get(['id', 'title', 'slug', 'is_free']),
            'materials' => Material::query()
                ->where('is_published', true)
                ->orderBy('title')
                ->get(['id', 'title', 'slug']),
            'cycles' => Cycle::query()
                ->where('is_published', true)
                ->orderBy('title')
                ->get(['id', 'title', 'slug']),
            'manualEnrollments' => Enrollment::query()
                ->where('source', 'manual')
                ->with(['user:id,name,email', 'course:id,title'])
                ->latest('enrolled_at')
                ->limit(50)
                ->get(),
            'manualContentAccesses' => ContentAccess::query()
                ->where('source', ContentAccess::SOURCE_MANUAL)
                ->with(['user:id,name,email', 'accessible'])
                ->latest('granted_at')
                ->limit(50)
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(array_keys(self::TYPE_MODELS))],
            'email' => ['required', 'email', 'exists:users,email'],
            'content_id' => ['required', 'integer'],
        ]);

        $student = User::where('email', $validated['email'])->firstOrFail();
        abort_unless($student->hasRole('student'), 422, 'الحساب ده مش حساب طالب.');

        if ($validated['type'] === 'course') {
            return $this->grantCourse($student, $validated['content_id']);
        }

        return $this->grantContent($student, self::TYPE_MODELS[$validated['type']], $validated['content_id']);
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        abort_unless($enrollment->source === 'manual', 422, 'الإجراء ده متاح بس للتسجيلات اليدوية.');

        $enrollment->delete();

        return back()->with('success', 'تم إلغاء التسجيل.');
    }

    public function destroyContentAccess(ContentAccess $contentAccess): RedirectResponse
    {
        abort_unless($contentAccess->source === ContentAccess::SOURCE_MANUAL, 422, 'الإجراء ده متاح بس للأكسيس اليدوي.');

        $contentAccess->delete();

        return back()->with('success', 'تم إلغاء الوصول.');
    }

    private function grantCourse(User $student, int $courseId): RedirectResponse
    {
        $course = Course::findOrFail($courseId);

        if ($course->enrollments()->where('user_id', $student->id)->exists()) {
            return back()->with('success', 'الطالب ده مسجل بالفعل في الكورس ده.');
        }

        $course->enrollments()->create([
            'user_id' => $student->id,
            'source' => 'manual',
            'enrolled_at' => now(),
        ]);

        return back()->with('success', "تم تسجيل {$student->name} في الكورس بنجاح.");
    }

    private function grantContent(User $student, string $modelClass, int $contentId): RedirectResponse
    {
        $content = $modelClass::findOrFail($contentId);

        $exists = ContentAccess::where('user_id', $student->id)
            ->where('accessible_type', $modelClass)
            ->where('accessible_id', $content->id)
            ->exists();

        if ($exists) {
            return back()->with('success', 'الطالب ده عنده أكسيس بالفعل على ده.');
        }

        ContentAccess::create([
            'user_id' => $student->id,
            'accessible_type' => $modelClass,
            'accessible_id' => $content->id,
            'source' => ContentAccess::SOURCE_MANUAL,
            'granted_at' => now(),
        ]);

        return back()->with('success', "تم فتح الأكسيس لـ{$student->name} بنجاح.");
    }
}
