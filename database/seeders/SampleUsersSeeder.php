<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class SampleUsersSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'John Customer',
                'email' => 'customer@ticketing.com',
                'phone' => '081234567891',
                'password' => 'password',
                'role' => 'pengadu'
            ],
            [
                'name' => 'Jane Staff',
                'email' => 'staff@ticketing.com',
                'phone' => '081234567892',
                'password' => 'password',
                'role' => 'staff_support'
            ],
            [
                'name' => 'Mike Supervisor',
                'email' => 'supervisor@ticketing.com',
                'phone' => '081234567893',
                'password' => 'password',
                'role' => 'supervisor'
            ],
            [
                'name' => 'Tech Support',
                'email' => 'teknisi@ticketing.com',
                'phone' => '081234567894',
                'password' => 'password',
                'role' => 'staff_support'
            ],
            [
                'name' => 'Boss Manager',
                'email' => 'pimpinan@ticketing.com',
                'phone' => '081234567895',
                'password' => 'password',
                'role' => 'pimpinan'
            ]
        ];

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role'])->first();
            
            if (!$role) {
                continue;
            }
            
            User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'phone' => $userData['phone'],
                    'password' => Hash::make($userData['password']),
                    'role_id' => $role->id,
                    'is_active' => true,
                    'email_verified_at' => now()
                ]
            );
        }
    }
}