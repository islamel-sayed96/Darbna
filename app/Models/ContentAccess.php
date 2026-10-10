<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable(['user_id', 'accessible_type', 'accessible_id', 'source', 'granted_at'])]
class ContentAccess extends Model
{
    public const SOURCE_MANUAL = 'manual';

    public const SOURCE_PURCHASE = 'purchase';

    protected function casts(): array
    {
        return [
            'granted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accessible(): MorphTo
    {
        return $this->morphTo();
    }
}
