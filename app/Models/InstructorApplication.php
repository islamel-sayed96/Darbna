<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'name', 'email', 'phone', 'residence', 'cv_path', 'portfolio',
    'course_title', 'course_syllabus', 'status', 'reviewed_by',
    'reviewed_at', 'created_user_id',
])]
#[Appends(['cv_url'])]
class InstructorApplication extends Model
{
    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    protected function cvUrl(): Attribute
    {
        return Attribute::get(
            fn () => $this->cv_path ? Storage::disk('public')->url($this->cv_path) : null
        );
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function createdUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id');
    }
}
