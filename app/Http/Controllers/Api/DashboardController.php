<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $data = [];

        if ($user->hasRole('admin') || $user->hasRole('pimpinan')) {
            $data = $this->getAdminDashboard();
        } elseif ($user->hasRole('supervisor')) {
            $data = $this->getSupervisorDashboard();
        } elseif ($user->hasRole('staff') || $user->hasRole('teknisi') || $user->hasRole('staff_support')) {
            $data = $this->getStaffDashboard($user);
        } else {
            $data = $this->getCustomerDashboard($user);
        }

        return response()->json($data);
    }

    public function analytics(Request $request)
    {
        $hours = $request->get('hours', 24);
        
        $ticketsPerHour = Ticket::select(
            DB::raw('DATE_TRUNC(\'hour\', created_at) as hour'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subHours($hours))
        ->groupBy('hour')
        ->orderBy('hour')
        ->get();

        $statusDistribution = Ticket::select('statuses.name', DB::raw('count(*) as count'))
            ->join('statuses', 'tickets.status_id', '=', 'statuses.id')
            ->groupBy('statuses.name')
            ->get();

        return response()->json([
            'tickets_per_hour' => $ticketsPerHour,
            'status_distribution' => $statusDistribution
        ]);
    }

    private function getAdminDashboard()
    {
        return [
            'total_tickets' => Ticket::count(),
            'open_tickets' => Ticket::open()->count(),
            'closed_tickets' => Ticket::closed()->count(),
            'total_users' => User::count(),
            'tickets_by_status' => Ticket::select('statuses.name', DB::raw('count(*) as count'))
                ->join('statuses', 'tickets.status_id', '=', 'statuses.id')
                ->groupBy('statuses.name')
                ->get(),
            'tickets_by_priority' => Ticket::select('priorities.name', DB::raw('count(*) as count'))
                ->join('priorities', 'tickets.priority_id', '=', 'priorities.id')
                ->groupBy('priorities.name')
                ->get(),
            'recent_tickets' => Ticket::with(['requester', 'status', 'priority'])
                ->latest()
                ->limit(10)
                ->get()
        ];
    }

    private function getSupervisorDashboard()
    {
        return [
            'total_tickets' => Ticket::count(),
            'open_tickets' => Ticket::open()->count(),
            'closed_tickets' => Ticket::closed()->count(),
            'team_tickets' => Ticket::whereNotNull('assigned_to')->count(),
            'unassigned_tickets' => Ticket::whereNull('assigned_to')->count(),
            'tickets_by_status' => Ticket::select('statuses.name', DB::raw('count(*) as count'))
                ->join('statuses', 'tickets.status_id', '=', 'statuses.id')
                ->groupBy('statuses.name')
                ->get(),
            'tickets_by_assignee' => Ticket::select('users.name', DB::raw('count(*) as count'))
                ->join('users', 'tickets.assigned_to', '=', 'users.id')
                ->groupBy('users.name')
                ->get(),
            'recent_activities' => Ticket::with(['requester', 'assignedUser', 'status'])
                ->latest('updated_at')
                ->limit(15)
                ->get()
        ];
    }

    private function getStaffDashboard($user)
    {
        return [
            'total_tickets' => Ticket::count(),
            'open_tickets' => Ticket::open()->count(),
            'closed_tickets' => Ticket::closed()->count(),
            'my_tickets' => Ticket::assignedTo($user->id)->count(),
            'my_open_tickets' => Ticket::assignedTo($user->id)->open()->count(),
            'my_closed_tickets' => Ticket::assignedTo($user->id)->closed()->count(),
            'available_tickets' => Ticket::whereNull('assigned_to')->count(),
            'tickets_by_status' => Ticket::select('statuses.name', DB::raw('count(*) as count'))
                ->join('statuses', 'tickets.status_id', '=', 'statuses.id')
                ->groupBy('statuses.name')
                ->get(),
            'my_recent_tickets' => Ticket::assignedTo($user->id)
                ->with(['requester', 'status', 'priority'])
                ->latest('updated_at')
                ->limit(10)
                ->get()
        ];
    }

    private function getCustomerDashboard($user)
    {
        return [
            'my_tickets' => Ticket::byRequester($user->id)->count(),
            'my_open_tickets' => Ticket::byRequester($user->id)->open()->count(),
            'my_closed_tickets' => Ticket::byRequester($user->id)->closed()->count(),
            'my_recent_tickets' => Ticket::byRequester($user->id)
                ->with(['status', 'priority', 'assignedUser'])
                ->latest()
                ->limit(10)
                ->get()
        ];
    }
}