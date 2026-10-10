<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['material_id', 'title', 'content', 'position'])]
class MaterialPage extends Model
{
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
