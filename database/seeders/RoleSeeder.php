<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full system access and user management'
            ],
            [
                'name' => 'pengadu',
                'display_name' => 'Pengadu',
                'description' => 'Can create and track tickets'
            ],
            [
                'name' => 'staff_support',
                'display_name' => 'Staff Support',
                'description' => 'Can handle assigned tickets and technical issues'
            ],
            [
                'name' => 'supervisor',
                'display_name' => 'Supervisor',
                'description' => 'Can monitor team and redistribute tickets'
            ],
            [
                'name' => 'pimpinan',
                'display_name' => 'Pimpinan',
                'description' => 'Executive access for reports and decisions'
            ]
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}