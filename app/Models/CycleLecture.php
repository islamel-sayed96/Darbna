<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['cycle_id', 'title', 'video_provider', 'video_id', 'video_url', 'position'])]
class CycleLecture extends Model
{
    public function cycle(): BelongsTo
    {
        return $this->belongsTo(Cycle::class);
    }
}
