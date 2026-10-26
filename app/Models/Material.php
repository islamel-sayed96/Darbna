<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[Fillable([
    'instructor_id', 'category_id', 'course_id', 'title', 'slug', 'description',
    'html_path', 'price', 'currency', 'is_published', 'published_at',
])]
class Material extends Model
{
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(MaterialPage::class)->orderBy('position');
    }

    public function cycleLinks(): HasMany
    {
        return $this->hasMany(CycleMaterial::class);
    }

    public function accesses(): MorphMany
    {
        return $this->morphMany(ContentAccess::class, 'accessible');
    }

    /**
     * Published materials are visible to anyone; unpublished ones are
     * previewable by the admin or the instructor who owns them, so they
     * can check how it looks before flipping it live.
     */
    public function isVisibleTo(?User $user): bool
    {
        if ($this->is_published) {
            return true;
        }

        return $user && ($user->hasRole('admin') || $user->id === $this->instructor_id);
    }
}
