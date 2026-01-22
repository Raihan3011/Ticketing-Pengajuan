<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class PimpinanSeeder extends Seeder
{
    public function run(): void
    {
        $pimpinanRole = Role::where('name', 'pimpinan')->first();
        
        if (!$pimpinanRole) {
            $this->command->error('Role pimpinan tidak ditemukan. Jalankan RoleSeeder terlebih dahulu.');
            return;
        }

        $pimpinanUsers = [
            [
                'name' => 'Dr. Ahmad Direktur',
                'email' => 'direktur@unpad.ac.id',
                'phone' => '081234567801',
                'department' => 'Direktorat Umum',
                'password' => 'password'
            ],
            [
                'name' => 'Prof. Budi Rektor',
                'email' => 'rektor@unpad.ac.id',
                'phone' => '081234567802',
                'department' => 'Rektorat',
                'password' => 'password'
            ],
            [
                'name' => 'Dr. Citra Dekan',
                'email' => 'dekan@unpad.ac.id',
                'phone' => '081234567803',
                'department' => 'Fakultas Teknik',
                'password' => 'password'
            ]
        ];

        foreach ($pimpinanUsers as $userData) {
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'phone' => $userData['phone'],
                    'department' => $userData['department'],
                    'password' => Hash::make($userData['password']),
                    'role_id' => $pimpinanRole->id,
                    'is_active' => true,
                    'email_verified_at' => now()
                ]
            );
        }

        $this->command->info('Pimpinan users created successfully!');
    }
}
