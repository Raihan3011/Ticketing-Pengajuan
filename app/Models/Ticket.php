<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    protected $fillable = [
        'ticket_number',
        'title',
        'description',
        'problem_detail',
        'category_id',
        'priority_id',
        'status_id',
        'requester_id',
        'assigned_to',
        'assigned_to_pimpinan_id',
        'due_date',
        'resolved_at',
        'rating',
        'feedback',
        'staff_notified_at',
        'pimpinan_notified_at',
        'pimpinan_approved_at',
        'staff_completed_at',
        'completion_notes',
        'first_response_at',
        'sla_response_due',
        'sla_resolution_due'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'resolved_at' => 'datetime',
        'staff_notified_at' => 'datetime',
        'pimpinan_notified_at' => 'datetime',
        'pimpinan_approved_at' => 'datetime',
        'staff_completed_at' => 'datetime',
        'first_response_at' => 'datetime',
        'sla_response_due' => 'datetime',
        'sla_resolution_due' => 'datetime'
    ];

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TicketTimeLog::class);
    }

    public function slaPolicy(): BelongsTo
    {
        return $this->belongsTo(SlaPolicy::class, 'priority_id', 'priority_id');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($ticket) {
            if (!$ticket->ticket_number) {
                $ticket->ticket_number = 'TKT-' . str_pad(
                    static::count() + 1, 
                    8, 
                    '0', 
                    STR_PAD_LEFT
                );
            }
            
            // Set SLA deadlines
            $ticket->setSlaDeadlines();
        });
        
        static::updating(function ($ticket) {
            // Update first response time
            if ($ticket->isDirty('status_id') && !$ticket->first_response_at) {
                $ticket->first_response_at = now();
            }
        });
    }

    public function setSlaDeadlines()
    {
        $slaPolicy = SlaPolicy::where('priority_id', $this->priority_id)
            ->where('is_active', true)
            ->first();
            
        if ($slaPolicy) {
            $baseTime = $this->created_at ?: now();
            $this->sla_response_due = $baseTime->addHours($slaPolicy->response_time_hours);
            $this->sla_resolution_due = $baseTime->addHours($slaPolicy->resolution_time_hours);
        }
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function pimpinan(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_pimpinan_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(TicketHistory::class);
    }

    public function ticketRating()
    {
        return $this->hasOne(TicketRating::class);
    }

    public function scopeOpen($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('is_closed', false);
        });
    }

    public function scopeClosed($query)
    {
        return $query->whereHas('status', function ($q) {
            $q->where('is_closed', true);
        });
    }

    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeByRequester($query, $userId)
    {
        return $query->where('requester_id', $userId);
    }
}