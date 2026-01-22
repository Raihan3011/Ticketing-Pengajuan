<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Priority;

class PrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            [
                'name' => 'Low',
                'color' => '#28a745',
                'level' => 1
            ],
            [
                'name' => 'Medium',
                'color' => '#ffc107',
                'level' => 2
            ],
            [
                'name' => 'High',
                'color' => '#fd7e14',
                'level' => 3
            ],
            [
                'name' => 'Critical',
                'color' => '#dc3545',
                'level' => 4
            ]
        ];

        foreach ($priorities as $priority) {
            Priority::firstOrCreate(['name' => $priority['name']], $priority);
        }
    }
}