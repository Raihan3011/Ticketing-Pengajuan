<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Status;

class StatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Pending',
                'color' => '#3b82f6', // Biru
                'is_closed' => false,
                'order' => 1
            ],
            [
                'name' => 'In Progress',
                'color' => '#f59e0b', // Orange
                'is_closed' => false,
                'order' => 2
            ],
            [
                'name' => 'Approved by Pimpinan',
                'color' => '#8b5cf6', // Ungu
                'is_closed' => false,
                'order' => 3
            ],
            [
                'name' => 'Completed',
                'color' => '#10b981', // Hijau
                'is_closed' => true,
                'order' => 4
            ],
            [
                'name' => 'Closed',
                'color' => '#6b7280', // Abu-abu gelap
                'is_closed' => true,
                'order' => 5
            ]
        ];

        foreach ($statuses as $status) {
            Status::firstOrCreate(['name' => $status['name']], $status);
        }
    }
}