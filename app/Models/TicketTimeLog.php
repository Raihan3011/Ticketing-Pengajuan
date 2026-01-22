<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketTimeLog extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'started_at',
        'ended_at',
        'duration_minutes',
        'description',
        'is_billable'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_billable' => 'boolean'
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function calculateDuration()
    {
        if ($this->started_at && $this->ended_at) {
            $this->duration_minutes = $this->started_at->diffInMinutes($this->ended_at);
            $this->save();
        }
    }
}