<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('categories')->insert([
            [
                'name' => 'Technical Issue',
                'description' => 'Masalah teknis sistem atau aplikasi',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Service Request',
                'description' => 'Permintaan layanan atau fitur baru',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Bug Report',
                'description' => 'Laporan bug atau error dalam sistem',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'General Inquiry',
                'description' => 'Pertanyaan umum atau informasi',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    public function down(): void
    {
        DB::table('categories')->truncate();
    }
};