<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name', 'slug', 'price', 'currency', 'duration_months', 'access_type',
    'course_limit', 'path_limit', 'description', 'badge', 'is_active',
])]
class SubscriptionPlan extends Model
{
    public const ACCESS_LIMITED_COURSES = 'limited_courses';

    public const ACCESS_SINGLE_PATH = 'single_path';

    public const ACCESS_THREE_PATHS = 'three_paths';

    public const ACCESS_ALL = 'all_access';

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }

    public function requiresSelection(): bool
    {
        return $this->access_type !== self::ACCESS_ALL;
    }

    public function selectionLimit(): ?int
    {
        return match ($this->access_type) {
            self::ACCESS_LIMITED_COURSES => $this->course_limit,
            self::ACCESS_SINGLE_PATH, self::ACCESS_THREE_PATHS => $this->path_limit,
            default => null,
        };
    }

    public function durationLabel(): string
    {
        return match ($this->duration_months) {
            1 => 'شهر',
            3 => '3 شهور',
            6 => '6 شهور',
            12 => 'سنة',
            default => "{$this->duration_months} شهور",
        };
    }
}
