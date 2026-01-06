<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('priorities')->insert([
            [
                'name' => 'Low',
                'color' => '#28a745',
                'level' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Medium',
                'color' => '#ffc107',
                'level' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'High',
                'color' => '#fd7e14',
                'level' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Critical',
                'color' => '#dc3545',
                'level' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    public function down(): void
    {
        DB::table('priorities')->truncate();
    }
};