<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SlaPolicy extends Model
{
    protected $fillable = [
        'name',
        'priority_id',
        'response_time_hours',
        'resolution_time_hours',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}