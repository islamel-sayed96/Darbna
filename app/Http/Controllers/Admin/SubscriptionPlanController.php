<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/SubscriptionPlans/Index', [
            'plans' => SubscriptionPlan::orderBy('access_type')->orderBy('duration_months')->get(),
            'accessTypes' => [
                SubscriptionPlan::ACCESS_LIMITED_COURSES => 'اختيار كورسات محددة',
                SubscriptionPlan::ACCESS_SINGLE_PATH => 'مسار واحد',
                SubscriptionPlan::ACCESS_THREE_PATHS => '3 مسارات',
                SubscriptionPlan::ACCESS_ALL => 'كل الكورسات والمسارات',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        SubscriptionPlan::create([
            ...$data,
            'slug' => $this->uniqueSlug($data['name']),
        ]);

        return back()->with('success', 'تم إنشاء الخطة.');
    }

    public function update(Request $request, SubscriptionPlan $subscriptionPlan): RedirectResponse
    {
        $subscriptionPlan->update($this->validateData($request, $subscriptionPlan));

        return back()->with('success', 'تم تحديث الخطة.');
    }

    public function destroy(SubscriptionPlan $subscriptionPlan): RedirectResponse
    {
        abort_if($subscriptionPlan->subscriptions()->exists(), 422, 'مينفعش تحذف خطة فيها اشتراكات فعلية — عطّلها بدل الحذف.');

        $subscriptionPlan->delete();

        return back()->with('success', 'تم حذف الخطة.');
    }

    private function validateData(Request $request, ?SubscriptionPlan $plan = null): array
    {
        $accessType = $request->input('access_type');

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:3'],
            'duration_months' => ['required', Rule::in([1, 3, 6, 12])],
            'access_type' => ['required', Rule::in([
                SubscriptionPlan::ACCESS_LIMITED_COURSES,
                SubscriptionPlan::ACCESS_SINGLE_PATH,
                SubscriptionPlan::ACCESS_THREE_PATHS,
                SubscriptionPlan::ACCESS_ALL,
            ])],
            'course_limit' => [
                Rule::requiredIf($accessType === SubscriptionPlan::ACCESS_LIMITED_COURSES),
                'nullable', 'integer', 'min:1',
            ],
            'path_limit' => [
                Rule::requiredIf(in_array($accessType, [
                    SubscriptionPlan::ACCESS_SINGLE_PATH,
                    SubscriptionPlan::ACCESS_THREE_PATHS,
                ], true)),
                'nullable', 'integer', 'min:1',
            ],
            'description' => ['nullable', 'string'],
            'badge' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name) ?: Str::random(8);
        $original = $slug;
        $i = 1;

        while (SubscriptionPlan::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
