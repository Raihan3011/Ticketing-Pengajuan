<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExecutiveController extends Controller
{
    public function executiveDashboard(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $dateFrom = Carbon::now()->subDays($period);

        $data = [
            'overview' => [
                'total_tickets' => Ticket::count(),
                'total_users' => User::count(),
                'active_staff' => User::whereHas('role', function($q) {
                    $q->whereIn('name', ['staff', 'teknisi']);
                })->where('is_active', true)->count(),
                'resolution_rate' => $this->getResolutionRate($dateFrom)
            ],
            
            'trends' => [
                'tickets_created' => $this->getTicketTrends($dateFrom, 'created'),
                'tickets_resolved' => $this->getTicketTrends($dateFrom, 'resolved'),
                'monthly_comparison' => $this->getMonthlyComparison()
            ],
            
            'performance_metrics' => [
                'avg_resolution_time' => $this->getAverageResolutionTime($dateFrom),
                'sla_compliance' => $this->getSLACompliance($dateFrom),
                'customer_satisfaction' => 4.2, // Mock data
                'first_response_time' => $this->getFirstResponseTime($dateFrom)
            ],
            
            'category_analysis' => Ticket::select('categories.name', DB::raw('count(*) as count'))
                ->join('categories', 'tickets.category_id', '=', 'categories.id')
                ->where('tickets.created_at', '>=', $dateFrom)
                ->groupBy('categories.name', 'categories.id')
                ->orderBy('count', 'desc')
                ->get(),
                
            'priority_distribution' => Ticket::select('priorities.name', DB::raw('count(*) as count'))
                ->join('priorities', 'tickets.priority_id', '=', 'priorities.id')
                ->where('tickets.created_at', '>=', $dateFrom)
                ->groupBy('priorities.name', 'priorities.id')
                ->get(),
                
            'top_performers' => $this->getTopPerformers($dateFrom)
        ];

        return response()->json($data);
    }

    private function getResolutionRate($dateFrom)
    {
        $total = Ticket::where('created_at', '>=', $dateFrom)->count();
        $resolved = Ticket::where('created_at', '>=', $dateFrom)
            ->whereNotNull('resolved_at')
            ->count();
            
        return $total > 0 ? round(($resolved / $total) * 100, 2) : 0;
    }

    private function getTicketTrends($dateFrom, $type)
    {
        $dateColumn = $type === 'created' ? 'created_at' : 'resolved_at';
        
        return Ticket::select(
                DB::raw('DATE('. $dateColumn .') as date'),
                DB::raw('count(*) as count')
            )
            ->where($dateColumn, '>=', $dateFrom)
            ->when($type === 'resolved', function($q) {
                $q->whereNotNull('resolved_at');
            })
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getMonthlyComparison()
    {
        $currentMonth = Ticket::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
            
        $lastMonth = Ticket::whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->count();
            
        $growth = $lastMonth > 0 ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 2) : 0;
        
        return [
            'current_month' => $currentMonth,
            'last_month' => $lastMonth,
            'growth_percentage' => $growth
        ];
    }

    private function getAverageResolutionTime($dateFrom)
    {
        $avg = Ticket::where('created_at', '>=', $dateFrom)
            ->whereNotNull('resolved_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_hours')
            ->first();
            
        return round($avg->avg_hours ?? 0, 2);
    }

    private function getSLACompliance($dateFrom)
    {
        // Mock SLA: 24 hours for high priority, 48 for medium, 72 for low
        $total = Ticket::where('created_at', '>=', $dateFrom)
            ->whereNotNull('resolved_at')
            ->count();
            
        $withinSLA = Ticket::where('created_at', '>=', $dateFrom)
            ->whereNotNull('resolved_at')
            ->whereRaw('
                CASE 
                    WHEN priorities.level = 4 THEN resolved_at <= created_at + INTERVAL \'24 hours\'
                    WHEN priorities.level = 3 THEN resolved_at <= created_at + INTERVAL \'48 hours\'
                    ELSE resolved_at <= created_at + INTERVAL \'72 hours\'
                END
            ')
            ->join('priorities', 'tickets.priority_id', '=', 'priorities.id')
            ->count();
            
        return $total > 0 ? round(($withinSLA / $total) * 100, 2) : 0;
    }

    private function getFirstResponseTime($dateFrom)
    {
        $avg = Ticket::where('tickets.created_at', '>=', $dateFrom)
            ->join('ticket_comments', 'tickets.id', '=', 'ticket_comments.ticket_id')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (ticket_comments.created_at - tickets.created_at))/3600) as avg_hours')
            ->whereRaw('ticket_comments.created_at = (
                SELECT MIN(created_at) 
                FROM ticket_comments tc 
                WHERE tc.ticket_id = tickets.id
            )')
            ->first();
            
        return round($avg->avg_hours ?? 0, 2);
    }

    private function getTopPerformers($dateFrom)
    {
        return User::whereHas('role', function($q) {
                $q->whereIn('name', ['staff', 'teknisi']);
            })
            ->withCount([
                'assignedTickets as resolved_count' => function($q) use ($dateFrom) {
                    $q->where('resolved_at', '>=', $dateFrom)
                      ->whereNotNull('resolved_at');
                }
            ])
            ->orderBy('resolved_count', 'desc')
            ->limit(5)
            ->get();
    }

    public function exportReport(Request $request)
    {
        $period = $request->get('period', '30');
        $format = $request->get('format', 'json'); // json, csv, pdf
        
        $data = $this->executiveDashboard($request)->getData();
        
        // For now, return JSON. Can be extended to support CSV/PDF
        return response()->json([
            'report_data' => $data,
            'generated_at' => now(),
            'period' => $period . ' days'
        ]);
    }
}