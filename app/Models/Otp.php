<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Otp extends Model
{
    protected $fillable = [
        'email',
        'otp',
        'name',
        'password',
        'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime'
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function scopeValid($query, $email, $otp)
    {
        return $query->where('email', $email)
                    ->where('otp', $otp)
                    ->where('expires_at', '>', Carbon::now());
    }
}