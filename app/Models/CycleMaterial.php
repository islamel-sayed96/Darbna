<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['cycle_id', 'type', 'title', 'url', 'material_id', 'position'])]
class CycleMaterial extends Model
{
    public const TYPE_LINK = 'link';

    public const TYPE_MATERIAL = 'material';

    public function cycle(): BelongsTo
    {
        return $this->belongsTo(Cycle::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
