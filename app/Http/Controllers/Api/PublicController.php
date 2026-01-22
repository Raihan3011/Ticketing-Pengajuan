<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function checkTicketStatus(Request $request)
    {
        $request->validate([
            'ticket_number' => 'required|string'
        ]);

        $ticket = Ticket::where('ticket_number', $request->ticket_number)
            ->with(['status', 'priority', 'category', 'assignedUser'])
            ->first();

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        return response()->json([
            'ticket' => [
                'ticket_number' => $ticket->ticket_number,
                'title' => $ticket->title,
                'status' => $ticket->status->name,
                'priority' => $ticket->priority->name,
                'category' => $ticket->category->name,
                'assigned_user' => $ticket->assignedUser ? [
                    'name' => $ticket->assignedUser->name,
                    'email' => $ticket->assignedUser->email
                ] : null,
                'created_at' => $ticket->created_at->format('d M Y H:i'),
                'updated_at' => $ticket->updated_at->format('d M Y H:i')
            ]
        ]);
    }
}