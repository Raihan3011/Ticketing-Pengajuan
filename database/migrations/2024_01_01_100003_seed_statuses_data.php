<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('statuses')->insert([
            [
                'name' => 'Open',
                'color' => '#007bff',
                'is_closed' => false,
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'In Progress',
                'color' => '#ffc107',
                'is_closed' => false,
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Pending',
                'color' => '#6c757d',
                'is_closed' => false,
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Resolved',
                'color' => '#28a745',
                'is_closed' => true,
                'order' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Closed',
                'color' => '#343a40',
                'is_closed' => true,
                'order' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    public function down(): void
    {
        DB::table('statuses')->truncate();
    }
};