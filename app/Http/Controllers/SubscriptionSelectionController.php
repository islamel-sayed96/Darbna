<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LearningPath;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionSelectionController extends Controller
{
    public function edit(Subscription $subscription): Response|RedirectResponse
    {
        abort_unless($subscription->user_id === auth()->id(), 403);

        if (! $subscription->needsSelection()) {
            return redirect()->route('student.dashboard');
        }

        $subscription->load('plan');
        $accessType = $subscription->plan->access_type;

        $options = match ($accessType) {
            SubscriptionPlan::ACCESS_LIMITED_COURSES => Course::query()
                ->where('status', 'published')
                ->orderBy('title')
                ->get(['id', 'title', 'slug']),
            SubscriptionPlan::ACCESS_SINGLE_PATH, SubscriptionPlan::ACCESS_THREE_PATHS => LearningPath::query()
                ->where('is_published', true)
                ->orderBy('title')
                ->get(['id', 'title', 'slug']),
            default => collect(),
        };

        return Inertia::render('Subscriptions/Select', [
            'subscription' => [
                'id' => $subscription->id,
                'plan_name' => $subscription->plan->name,
                'access_type' => $accessType,
            ],
            'limit' => $subscription->plan->selectionLimit(),
            'kind' => in_array($accessType, [SubscriptionPlan::ACCESS_SINGLE_PATH, SubscriptionPlan::ACCESS_THREE_PATHS], true)
                ? 'paths'
                : 'courses',
            'options' => $options,
        ]);
    }

    public function update(Request $request, Subscription $subscription): RedirectResponse
    {
        abort_unless($subscription->user_id === auth()->id(), 403);
        abort_unless($subscription->needsSelection(), 404);

        $subscription->load('plan');
        $accessType = $subscription->plan->access_type;
        $limit = $subscription->plan->selectionLimit();

        if ($accessType === SubscriptionPlan::ACCESS_LIMITED_COURSES) {
            $validated = $request->validate([
                'ids' => ['required', 'array', 'size:'.$limit],
                'ids.*' => [Rule::exists('courses', 'id')->where('status', 'published')],
            ]);

            $subscription->selectedCourses()->sync($validated['ids']);
        } elseif (in_array($accessType, [SubscriptionPlan::ACCESS_SINGLE_PATH, SubscriptionPlan::ACCESS_THREE_PATHS], true)) {
            $validated = $request->validate([
                'ids' => ['required', 'array', 'size:'.$limit],
                'ids.*' => [Rule::exists('learning_paths', 'id')->where('is_published', true)],
            ]);

            $subscription->selectedPaths()->sync($validated['ids']);
        } else {
            abort(404);
        }

        return redirect()->route('student.dashboard')->with('success', 'تم حفظ اختيارك بنجاح!');
    }
}
