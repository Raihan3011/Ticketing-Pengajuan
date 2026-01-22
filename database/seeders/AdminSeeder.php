<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        
        User::firstOrCreate(
            ['email' => 'admin@ticketing.com'],
            [
                'name' => 'Administrator',
                'phone' => '081234567890',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
                'is_active' => true,
                'email_verified_at' => now()
            ]
        );
    }
}