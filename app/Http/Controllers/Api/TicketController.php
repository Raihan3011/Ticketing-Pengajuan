<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\TicketAttachment;
use App\Models\TicketHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['category', 'priority', 'status', 'requester', 'assignedUser', 'pimpinan']);

        // Role-based filtering
        $user = $request->user();
        if ($user->hasRole('pengadu')) {
            $query->byRequester($user->id);
        } elseif ($user->hasRole('staff_support')) {
            // Staff can see all tickets
            // No additional filtering needed
        }

        // Filters
        if ($request->has('status') && $request->status !== '') {
            $query->where('status_id', $request->status);
        }
        if ($request->has('category') && $request->category !== '') {
            $query->where('category_id', $request->category);
        }
        if ($request->has('priority') && $request->priority !== '') {
            $query->where('priority_id', $request->priority);
        }
        if ($request->has('assigned_to') && $request->assigned_to !== '') {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ILIKE', "%{$search}%")
                  ->orWhere('description', 'ILIKE', "%{$search}%")
                  ->orWhere('ticket_number', 'ILIKE', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $tickets = $query->paginate($request->get('per_page', 15));

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'problem_detail' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'priority_id' => 'required|exists:priorities,id',
            'assigned_to_pimpinan_id' => 'nullable|exists:users,id',
            'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignedTo = $this->autoAssignTicket($request->category_id);

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'problem_detail' => $request->problem_detail,
            'category_id' => $request->category_id,
            'priority_id' => $request->priority_id,
            'status_id' => 1, // Pending status
            'requester_id' => $request->user()->id,
            'assigned_to' => $assignedTo,
            'assigned_to_pimpinan_id' => $request->assigned_to_pimpinan_id,
            'staff_notified_at' => $assignedTo ? now() : null
        ]);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('tickets/' . $ticket->id, $filename, 'public');

                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'path' => $path
                ]);
            }
        }

        // Log history
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'action' => 'created',
            'new_values' => $ticket->toArray()
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket->load(['category', 'priority', 'status', 'requester', 'pimpinan'])
        ], 201);
    }

    public function show(Ticket $ticket)
    {
        $user = request()->user();
        
        // Check access permissions
        if ($user->hasRole('pengadu') && $ticket->requester_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ticketData = $ticket->load([
            'category', 'priority', 'status', 'requester', 'assignedUser', 'pimpinan',
            'comments.user', 'attachments', 'histories.user', 'ticketRating'
        ]);

        // Add rating data to ticket
        if ($ticketData->ticketRating) {
            $ticketData->rating = $ticketData->ticketRating->rating;
            $ticketData->feedback = $ticketData->ticketRating->feedback;
        }

        return response()->json(['ticket' => $ticketData]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        // Check permissions
        if ($user->hasRole('pengadu') && $ticket->requester_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'priority_id' => 'sometimes|exists:priorities,id',
            'status_id' => 'sometimes|exists:statuses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldValues = $ticket->toArray();
        $ticket->update($request->only([
            'title', 'description', 'category_id', 'priority_id', 'status_id'
        ]));

        // Log history
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'updated',
            'old_values' => $oldValues,
            'new_values' => $ticket->fresh()->toArray()
        ]);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket->load(['category', 'priority', 'status', 'requester', 'assignedUser', 'pimpinan'])
        ]);
    }

    public function assign(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'assigned_to' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignedTo = $request->assigned_to === 'self' ? $request->user()->id : $request->assigned_to;
        
        // Validate user exists if not self
        if ($request->assigned_to !== 'self') {
            $validator = Validator::make(['assigned_to' => $assignedTo], [
                'assigned_to' => 'exists:users,id'
            ]);
            
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
        }

        $oldAssigned = $ticket->assigned_to;
        $ticket->update([
            'assigned_to' => $assignedTo,
            'staff_notified_at' => now()
        ]);

        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'action' => 'assigned',
            'old_values' => ['assigned_to' => $oldAssigned],
            'new_values' => ['assigned_to' => $assignedTo]
        ]);

        return response()->json([
            'message' => 'Ticket assigned successfully',
            'ticket' => $ticket->load(['assignedUser'])
        ]);
    }

    public function addComment(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'comment' => 'required|string',
            'is_internal' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
            'is_internal' => $request->get('is_internal', false)
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user')
        ], 201);
    }

    public function getComments(Ticket $ticket)
    {
        $user = request()->user();
        $query = $ticket->comments()->with('user');

        // Hide internal comments from customers
        if ($user->hasRole('pengadu')) {
            $query->public();
        }

        return response()->json([
            'comments' => $query->orderBy('created_at')->get()
        ]);
    }

    public function uploadAttachment(Request $request, Ticket $ticket)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('tickets/' . $ticket->id, $filename, 'public');

        $attachment = TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $path
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'attachment' => $attachment
        ], 201);
    }

    public function getHistory(Ticket $ticket)
    {
        return response()->json([
            'history' => $ticket->histories()->with('user')->orderBy('created_at')->get()
        ]);
    }

    private function autoAssignTicket($categoryId)
    {
        // Get users by category preference or role
        $users = \App\Models\User::whereHas('role', function($q) {
            $q->where('name', 'staff_support');
        })->where('is_active', true)->get();

        if ($users->isEmpty()) {
            return null;
        }

        // Find user with least active tickets
        $userWorkload = [];
        foreach ($users as $user) {
            $activeTickets = Ticket::where('assigned_to', $user->id)
                ->whereIn('status_id', [1, 2]) // Open, In Progress
                ->count();
            $userWorkload[$user->id] = $activeTickets;
        }

        // Return user with minimum workload
        $assignedUserId = array_keys($userWorkload, min($userWorkload))[0];
        return $assignedUserId;
    }

    public function notifyPimpinan(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        if (!$user->hasRole('staff_support')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$ticket->assigned_to_pimpinan_id) {
            return response()->json(['message' => 'Pimpinan belum ditentukan'], 400);
        }

        $ticket->update([
            'pimpinan_notified_at' => now()
        ]);

        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'notified_pimpinan',
            'new_values' => ['pimpinan_notified_at' => now()]
        ]);

        return response()->json([
            'message' => 'Pimpinan berhasil diberitahu',
            'ticket' => $ticket->fresh()->load(['pimpinan'])
        ]);
    }

    public function approvePimpinan(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        if (!$user->hasRole('pimpinan')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get status ID for 'Approved by Pimpinan'
        $approvedStatus = \App\Models\Status::where('name', 'Approved by Pimpinan')->first();
        
        $ticket->update([
            'status_id' => $approvedStatus->id,
            'pimpinan_approved_at' => now()
        ]);

        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'approved_by_pimpinan',
            'new_values' => [
                'status_id' => $approvedStatus->id,
                'pimpinan_approved_at' => now()
            ]
        ]);

        return response()->json([
            'message' => 'Pengaduan berhasil di-approve',
            'ticket' => $ticket->fresh()->load(['status', 'pimpinan'])
        ]);
    }

    public function completeByStaff(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        
        if (!$user->hasRole('staff_support')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if pimpinan has approved
        if (!$ticket->pimpinan_approved_at) {
            return response()->json(['message' => 'Tiket belum di-approve oleh pimpinan'], 400);
        }

        $validator = Validator::make($request->all(), [
            'completion_notes' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get status ID for 'Completed'
        $completedStatus = \App\Models\Status::where('name', 'Completed')->first();

        $ticket->update([
            'status_id' => $completedStatus->id,
            'staff_completed_at' => now(),
            'completion_notes' => $request->completion_notes,
            'resolved_at' => now()
        ]);

        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'action' => 'completed_by_staff',
            'new_values' => [
                'status_id' => $completedStatus->id,
                'staff_completed_at' => now(),
                'completion_notes' => $request->completion_notes
            ]
        ]);

        return response()->json([
            'message' => 'Tiket berhasil diselesaikan',
            'ticket' => $ticket->fresh()->load(['status', 'requester', 'pimpinan'])
        ]);
    }
}