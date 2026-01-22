<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Status;
use App\Models\Category;
use App\Models\Priority;

class WorkflowTestSeeder extends Seeder
{
    public function run(): void
    {
        $pengadu = User::whereHas('role', function($q) {
            $q->where('name', 'pengadu');
        })->first();

        $staff = User::whereHas('role', function($q) {
            $q->where('name', 'staff_support');
        })->first();

        $pimpinan = User::whereHas('role', function($q) {
            $q->where('name', 'pimpinan');
        })->first();

        if (!$pengadu || !$staff || !$pimpinan) {
            $this->command->error('User dengan role pengadu, staff_support, atau pimpinan tidak ditemukan!');
            return;
        }

        $category = Category::first();
        $priority = Priority::first();
        $statusPending = Status::where('name', 'Pending')->first();
        $statusInProgress = Status::where('name', 'In Progress')->first();
        $statusApproved = Status::where('name', 'Approved by Pimpinan')->first();
        $statusCompleted = Status::where('name', 'Completed')->first();

        // Tiket 1: Status Pending (baru dibuat)
        Ticket::create([
            'ticket_number' => 'TKT-TEST001',
            'title' => 'Test Tiket - Status Pending',
            'description' => 'Ini adalah tiket test dengan status Pending',
            'category_id' => $category->id,
            'priority_id' => $priority->id,
            'status_id' => $statusPending->id,
            'requester_id' => $pengadu->id,
            'assigned_to' => $staff->id,
            'assigned_to_pimpinan_id' => $pimpinan->id,
            'staff_notified_at' => now()
        ]);

        // Tiket 2: Status In Progress (staff sudah beritahu pimpinan)
        Ticket::create([
            'ticket_number' => 'TKT-TEST002',
            'title' => 'Test Tiket - Status In Progress',
            'description' => 'Ini adalah tiket test dengan status In Progress, menunggu approval pimpinan',
            'category_id' => $category->id,
            'priority_id' => $priority->id,
            'status_id' => $statusInProgress->id,
            'requester_id' => $pengadu->id,
            'assigned_to' => $staff->id,
            'assigned_to_pimpinan_id' => $pimpinan->id,
            'staff_notified_at' => now()->subHours(2),
            'pimpinan_notified_at' => now()->subHour()
        ]);

        // Tiket 3: Status Approved (menunggu staff konfirmasi selesai)
        Ticket::create([
            'ticket_number' => 'TKT-TEST003',
            'title' => 'Test Tiket - Status Approved by Pimpinan',
            'description' => 'Ini adalah tiket test yang sudah di-approve pimpinan, menunggu staff konfirmasi selesai',
            'category_id' => $category->id,
            'priority_id' => $priority->id,
            'status_id' => $statusApproved->id,
            'requester_id' => $pengadu->id,
            'assigned_to' => $staff->id,
            'assigned_to_pimpinan_id' => $pimpinan->id,
            'staff_notified_at' => now()->subHours(4),
            'pimpinan_notified_at' => now()->subHours(3),
            'pimpinan_approved_at' => now()->subHours(2)
        ]);

        // Tiket 4: Status Completed (bisa diberi rating)
        Ticket::create([
            'ticket_number' => 'TKT-TEST004',
            'title' => 'Test Tiket - Status Completed',
            'description' => 'Ini adalah tiket test yang sudah selesai, bisa diberi rating',
            'category_id' => $category->id,
            'priority_id' => $priority->id,
            'status_id' => $statusCompleted->id,
            'requester_id' => $pengadu->id,
            'assigned_to' => $staff->id,
            'assigned_to_pimpinan_id' => $pimpinan->id,
            'staff_notified_at' => now()->subDays(1),
            'pimpinan_notified_at' => now()->subDays(1)->addHours(1),
            'pimpinan_approved_at' => now()->subDays(1)->addHours(2),
            'staff_completed_at' => now()->subHours(1),
            'completion_notes' => 'Masalah telah diselesaikan dengan baik. Semua sistem berjalan normal.',
            'resolved_at' => now()->subHours(1)
        ]);

        $this->command->info('Test tickets created successfully!');
    }
}
