<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Category;
use App\Models\Priority;
use App\Models\Status;

class SampleTicketsSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@ticketing.com')->first();
        $staff = User::where('email', 'staff@ticketing.com')->first();
        
        $itCategory = Category::where('name', 'IT Support')->first();
        $hardwareCategory = Category::where('name', 'Hardware')->first();
        
        $lowPriority = Priority::where('name', 'Low')->first();
        $mediumPriority = Priority::where('name', 'Medium')->first();
        $highPriority = Priority::where('name', 'High')->first();
        
        $pendingStatus = Status::where('name', 'Pending')->first();
        $inProgressStatus = Status::where('name', 'In Progress')->first();
        $completedStatus = Status::where('name', 'Completed')->first();

        $tickets = [
            [
                'title' => 'Cannot access email account',
                'description' => 'I am unable to log into my email account. Getting authentication error.',
                'category_id' => $itCategory->id,
                'priority_id' => $mediumPriority->id,
                'status_id' => $pendingStatus->id,
                'requester_id' => $customer->id,
                'assigned_to' => null
            ],
            [
                'title' => 'Printer not working',
                'description' => 'Office printer is not responding. Paper jam error showing.',
                'category_id' => $hardwareCategory->id,
                'priority_id' => $highPriority->id,
                'status_id' => $inProgressStatus->id,
                'requester_id' => $customer->id,
                'assigned_to' => $staff->id
            ],
            [
                'title' => 'Software installation request',
                'description' => 'Need Adobe Photoshop installed on my workstation for design work.',
                'category_id' => $itCategory->id,
                'priority_id' => $lowPriority->id,
                'status_id' => $completedStatus->id,
                'requester_id' => $customer->id,
                'assigned_to' => $staff->id,
                'resolved_at' => now()->subDays(2)
            ]
        ];

        foreach ($tickets as $ticketData) {
            Ticket::create($ticketData);
        }
    }
}