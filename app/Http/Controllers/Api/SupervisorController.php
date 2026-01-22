<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SupervisorController extends Controller
{
    public function teamOverview()
    {
        $teamStats = [
            'total_staff' => User::whereHas('role', function($q) {
                $q->whereIn('name', ['staff', 'teknisi']);
            })->count(),
            
            'tickets_by_assignee' => Ticket::select('users.name', DB::raw('count(*) as count'))
                ->join('users', 'tickets.assigned_to', '=', 'users.id')
                ->groupBy('users.name', 'users.id')
                ->get(),
                
            'unassigned_tickets' => Ticket::whereNull('assigned_to')->count(),
            
            'overdue_tickets' => Ticket::where('due_date', '<', now())
                ->whereHas('status', function($q) {
                    $q->where('is_closed', false);
                })
                ->count(),
                
            'staff_workload' => User::whereHas('role', function($q) {
                    $q->whereIn('name', ['staff', 'teknisi']);
                })
                ->withCount(['assignedTickets as open_tickets' => function($q) {
                    $q->whereHas('status', function($sq) {
                        $sq->where('is_closed', false);
                    });
                }])
                ->get()
        ];

        return response()->json($teamStats);
    }

    public function reassignTicket(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'assigned_to' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldAssigned = $ticket->assigned_to;
        $ticket->update(['assigned_to' => $request->assigned_to]);

        // Log history
        $ticket->histories()->create([
            'user_id' => $request->user()->id,
            'action' => 'reassigned',
            'old_values' => ['assigned_to' => $oldAssigned],
            'new_values' => ['assigned_to' => $request->assigned_to]
        ]);

        return response()->json([
            'message' => 'Ticket reassigned successfully',
            'ticket' => $ticket->load(['assignedUser'])
        ]);
    }

    public function bulkAssign(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ticket_ids' => 'required|array',
            'ticket_ids.*' => 'exists:tickets,id',
            'assigned_to' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updated = Ticket::whereIn('id', $request->ticket_ids)
            ->update(['assigned_to' => $request->assigned_to]);

        // Log histories for each ticket
        foreach ($request->ticket_ids as $ticketId) {
            $ticket = Ticket::find($ticketId);
            $ticket->histories()->create([
                'user_id' => $request->user()->id,
                'action' => 'bulk_assigned',
                'new_values' => ['assigned_to' => $request->assigned_to]
            ]);
        }

        return response()->json([
            'message' => "Successfully assigned {$updated} tickets"
        ]);
    }

    public function teamPerformance(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $performance = User::whereHas('role', function($q) {
                $q->whereIn('name', ['staff', 'teknisi']);
            })
            ->withCount([
                'assignedTickets as total_assigned' => function($q) use ($dateFrom, $dateTo) {
                    $q->whereBetween('created_at', [$dateFrom, $dateTo]);
                },
                'assignedTickets as resolved_tickets' => function($q) use ($dateFrom, $dateTo) {
                    $q->whereHas('status', function($sq) {
                        $sq->where('is_closed', true);
                    })
                    ->whereBetween('resolved_at', [$dateFrom, $dateTo]);
                }
            ])
            ->get()
            ->map(function($user) {
                $user->resolution_rate = $user->total_assigned > 0 
                    ? round(($user->resolved_tickets / $user->total_assigned) * 100, 2)
                    : 0;
                return $user;
            });

        return response()->json(['performance' => $performance]);
    }
}