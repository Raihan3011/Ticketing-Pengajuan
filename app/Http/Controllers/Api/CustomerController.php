<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketRating;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function rateTicket(Request $request, Ticket $ticket)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:1000'
        ]);

        // Check if user is the ticket creator
        if ($ticket->requester_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if ticket is completed
        $status = $ticket->status->name;
        if (!in_array($status, ['Completed', 'Closed', 'Resolved'])) {
            return response()->json(['message' => 'Ticket must be completed before rating'], 400);
        }

        // Check if already rated
        $existingRating = TicketRating::where('ticket_id', $ticket->id)->first();
        if ($existingRating) {
            return response()->json(['message' => 'Ticket already rated'], 400);
        }

        $rating = TicketRating::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'rating' => $request->rating,
            'feedback' => $request->feedback
        ]);

        return response()->json([
            'message' => 'Rating submitted successfully',
            'rating' => $rating
        ]);
    }

    public function getKnowledgeBase()
    {
        return response()->json(['articles' => []]);
    }

    public function getKnowledgeArticle($id)
    {
        return response()->json(['article' => null]);
    }

    public function voteHelpful($id)
    {
        return response()->json(['message' => 'Vote recorded']);
    }

    public function getTicketTemplates()
    {
        return response()->json(['templates' => []]);
    }

    public function getTicketTemplate($id)
    {
        return response()->json(['template' => null]);
    }

    public function getNotificationSettings()
    {
        return response()->json(['settings' => []]);
    }

    public function updateNotificationSettings(Request $request)
    {
        return response()->json(['message' => 'Settings updated']);
    }
}
