<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class StaffController extends Controller
{
    public function getSlaAlerts(Request $request)
    {
        $user = $request->user();
        
        $alerts = Ticket::where('assigned_to', $user->id)
            ->whereHas('status', function($q) {
                $q->where('is_closed', false);
            })
            ->where(function($q) {
                $q->where('sla_response_due', '<', Carbon::now()->addHours(2))
                  ->orWhere('sla_resolution_due', '<', Carbon::now()->addHours(4));
            })
            ->with(['priority', 'status', 'requester'])
            ->orderBy('sla_response_due')
            ->get()
            ->map(function($ticket) {
                $ticket->alert_type = $this->getSlaAlertType($ticket);
                $ticket->time_remaining = $this->getTimeRemaining($ticket);
                return $ticket;
            });

        return response()->json(['alerts' => $alerts]);
    }

    private function getSlaAlertType($ticket)
    {
        $now = Carbon::now();
        
        if ($ticket->sla_response_due && $ticket->sla_response_due->isPast() && !$ticket->first_response_at) {
            return 'response_breached';
        }
        
        if ($ticket->sla_resolution_due && $ticket->sla_resolution_due->isPast()) {
            return 'resolution_breached';
        }
        
        if ($ticket->sla_response_due && $ticket->sla_response_due->diffInHours($now) <= 2) {
            return 'response_warning';
        }
        
        if ($ticket->sla_resolution_due && $ticket->sla_resolution_due->diffInHours($now) <= 4) {
            return 'resolution_warning';
        }
        
        return 'normal';
    }

    private function getTimeRemaining($ticket)
    {
        $now = Carbon::now();
        
        if ($ticket->sla_response_due && !$ticket->first_response_at) {
            return $ticket->sla_response_due->diffForHumans($now);
        }
        
        if ($ticket->sla_resolution_due) {
            return $ticket->sla_resolution_due->diffForHumans($now);
        }
        
        return null;
    }

    public function escalateTicket(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'escalation_reason' => 'required|string|max:500',
            'escalate_to' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find supervisor or admin to escalate to
        $escalateTo = null;
        if ($request->escalate_to) {
            $escalateTo = User::find($request->escalate_to);
        } else {
            $escalateTo = User::whereHas('role', function($q) {
                $q->whereIn('name', ['supervisor', 'admin']);
            })->first();
        }

        if (!$escalateTo) {
            return response()->json(['message' => 'No supervisor available for escalation'], 422);
        }

        $oldAssigned = $ticket->assigned_to;
        $ticket->update(['assigned_to' => $escalateTo->id]);

        // Log escalation
        $ticket->histories()->create([
            'user_id' => $request->user()->id,
            'action' => 'escalated',
            'old_values' => ['assigned_to' => $oldAssigned],
            'new_values' => [
                'assigned_to' => $escalateTo->id,
                'escalation_reason' => $request->escalation_reason
            ]
        ]);

        // Add escalation comment
        $ticket->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => "Ticket escalated to {$escalateTo->name}. Reason: {$request->escalation_reason}",
            'is_internal' => true
        ]);

        return response()->json([
            'message' => 'Ticket escalated successfully',
            'escalated_to' => $escalateTo->name
        ]);
    }

    public function bulkUpdateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:tickets,id',
            'status_id' => 'required|exists:statuses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updated = Ticket::whereIn('id', $request->ticket_ids)
            ->where('assigned_to', $request->user()->id)
            ->update(['status_id' => $request->status_id]);

        // Log histories
        foreach ($request->ticket_ids as $ticketId) {
            $ticket = Ticket::find($ticketId);
            if ($ticket && $ticket->assigned_to === $request->user()->id) {
                $ticket->histories()->create([
                    'user_id' => $request->user()->id,
                    'action' => 'bulk_status_update',
                    'new_values' => ['status_id' => $request->status_id]
                ]);
            }
        }

        return response()->json([
            'message' => "Successfully updated {$updated} tickets"
        ]);
    }
}