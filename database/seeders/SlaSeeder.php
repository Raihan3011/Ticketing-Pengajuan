<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SlaPolicy;
use App\Models\Priority;

class SlaSeeder extends Seeder
{
    public function run(): void
    {
        $priorities = Priority::all();
        
        $slaPolicies = [
            [
                'name' => 'Critical Priority SLA',
                'priority_id' => $priorities->where('name', 'Critical')->first()->id,
                'response_time_hours' => 1,
                'resolution_time_hours' => 4
            ],
            [
                'name' => 'High Priority SLA', 
                'priority_id' => $priorities->where('name', 'High')->first()->id,
                'response_time_hours' => 2,
                'resolution_time_hours' => 8
            ],
            [
                'name' => 'Medium Priority SLA',
                'priority_id' => $priorities->where('name', 'Medium')->first()->id,
                'response_time_hours' => 4,
                'resolution_time_hours' => 24
            ],
            [
                'name' => 'Low Priority SLA',
                'priority_id' => $priorities->where('name', 'Low')->first()->id,
                'response_time_hours' => 8,
                'resolution_time_hours' => 72
            ]
        ];

        foreach ($slaPolicies as $policy) {
            SlaPolicy::create($policy);
        }
    }
}