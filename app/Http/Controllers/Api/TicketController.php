<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $tickets = Ticket::with(['category', 'priority', 'status', 'requester', 'assignedTo'])
            ->when($request->status, fn($q) => $q->where('status_id', $request->status))
            ->when($request->priority, fn($q) => $q->where('priority_id', $request->priority))
            ->when($request->category, fn($q) => $q->where('category_id', $request->category))
            ->paginate(15);

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'priority_id' => 'required|exists:priorities,id'
        ]);

        $ticket = Ticket::create([
            'ticket_number' => 'TKT-' . strtoupper(Str::random(8)),
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'priority_id' => $request->priority_id,
            'status_id' => 1, // Default: Open
            'requester_id' => auth()->id()
        ]);

        return response()->json($ticket->load(['category', 'priority', 'status', 'requester']), 201);
    }

    public function show(Ticket $ticket)
    {
        return response()->json($ticket->load(['category', 'priority', 'status', 'requester', 'assignedTo', 'comments.user', 'attachments']));
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'category_id' => 'exists:categories,id',
            'priority_id' => 'exists:priorities,id',
            'status_id' => 'exists:statuses,id',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $ticket->update($request->only(['title', 'description', 'category_id', 'priority_id', 'status_id', 'assigned_to']));

        return response()->json($ticket->load(['category', 'priority', 'status', 'requester', 'assignedTo']));
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}