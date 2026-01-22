<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TicketRating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function index(Request $request)
    {
        $query = TicketRating::with(['ticket.assignedUser', 'user']);

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Filter by rating
        if ($request->has('rating')) {
            $query->where('rating', $request->rating);
        }

        // Filter by assigned staff
        if ($request->has('staff_id')) {
            $query->whereHas('ticket', function($q) use ($request) {
                $q->where('assigned_to', $request->staff_id);
            });
        }

        $ratings = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['ratings' => $ratings]);
    }

    public function statistics(Request $request)
    {
        $query = TicketRating::query();

        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $ratings = $query->get();
        $totalRatings = $ratings->count();
        $averageRating = $totalRatings > 0 ? $ratings->avg('rating') : 0;

        $distribution = [
            5 => $ratings->where('rating', 5)->count(),
            4 => $ratings->where('rating', 4)->count(),
            3 => $ratings->where('rating', 3)->count(),
            2 => $ratings->where('rating', 2)->count(),
            1 => $ratings->where('rating', 1)->count(),
        ];

        $satisfactionRate = $totalRatings > 0 
            ? ($ratings->where('rating', '>=', 4)->count() / $totalRatings * 100)
            : 0;

        return response()->json([
            'total_ratings' => $totalRatings,
            'average_rating' => round($averageRating, 2),
            'distribution' => $distribution,
            'satisfaction_rate' => round($satisfactionRate, 2)
        ]);
    }
}
