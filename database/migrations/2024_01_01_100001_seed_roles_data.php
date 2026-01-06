<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('roles')->insert([
            [
                'name' => 'customer',
                'display_name' => 'Pelapor/Pengguna',
                'description' => 'Aktor yang membuat tiket pengaduan dan memantau status tiket',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'agent',
                'display_name' => 'Agen/Staf Pendukung',
                'description' => 'Staf yang merespons dan menyelesaikan tiket di garda terdepan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'admin',
                'display_name' => 'Administrator Sistem',
                'description' => 'Pengelola teknis aplikasi dan konfigurasi sistem',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'manager',
                'display_name' => 'Manajer/Supervisor',
                'description' => 'Pemantau performa tim dan analisis laporan',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'specialist',
                'display_name' => 'Spesialis/Teknisi',
                'description' => 'Penanganan tiket yang memerlukan keahlian khusus',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    public function down(): void
    {
        DB::table('roles')->whereIn('name', ['customer', 'agent', 'admin', 'manager', 'specialist'])->delete();
    }
};