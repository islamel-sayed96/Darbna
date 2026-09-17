<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['user_id', 'plan_id', 'status', 'starts_at', 'ends_at', 'payment_reference'])]
class Subscription extends Model
{
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function selectedCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'subscription_course');
    }

    public function selectedPaths(): BelongsToMany
    {
        return $this->belongsToMany(LearningPath::class, 'subscription_learning_path');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->ends_at->isFuture();
    }

    public function needsSelection(): bool
    {
        return $this->plan->requiresSelection()
            && $this->selectedCourses()->doesntExist()
            && $this->selectedPaths()->doesntExist();
    }

    public function grantsAccessToCourse(Course $course): bool
    {
        return match ($this->plan->access_type) {
            SubscriptionPlan::ACCESS_ALL => true,
            SubscriptionPlan::ACCESS_LIMITED_COURSES => $this->selectedCourses()
                ->where('courses.id', $course->id)->exists(),
            SubscriptionPlan::ACCESS_SINGLE_PATH, SubscriptionPlan::ACCESS_THREE_PATHS => $course->learning_path_id
                && $this->selectedPaths()->where('learning_paths.id', $course->learning_path_id)->exists(),
            default => false,
        };
    }
}
