<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    protected $fillable = [
        'name',
        'color',
        'is_closed',
        'order'
    ];

    protected $casts = [
        'is_closed' => 'boolean'
    ];

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}