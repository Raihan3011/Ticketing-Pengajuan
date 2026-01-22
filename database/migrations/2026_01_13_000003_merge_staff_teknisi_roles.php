<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;
use App\Models\User;

return new class extends Migration
{
    public function up(): void
    {
        // Create new staff_support role
        $staffSupportRole = Role::firstOrCreate([
            'name' => 'staff_support'
        ], [
            'display_name' => 'Staff Support',
            'description' => 'Can handle assigned tickets and technical issues'
        ]);

        // Get old staff and teknisi roles
        $staffRole = Role::where('name', 'staff')->first();
        $teknisiRole = Role::where('name', 'teknisi')->first();

        // Update users with staff or teknisi role to staff_support
        if ($staffRole) {
            User::where('role_id', $staffRole->id)->update(['role_id' => $staffSupportRole->id]);
        }
        
        if ($teknisiRole) {
            User::where('role_id', $teknisiRole->id)->update(['role_id' => $staffSupportRole->id]);
        }

        // Delete old roles
        if ($staffRole) {
            $staffRole->delete();
        }
        if ($teknisiRole) {
            $teknisiRole->delete();
        }
    }

    public function down(): void
    {
        // Recreate old roles
        $staffRole = Role::firstOrCreate([
            'name' => 'staff'
        ], [
            'display_name' => 'Staff',
            'description' => 'Can handle assigned tickets'
        ]);

        $teknisiRole = Role::firstOrCreate([
            'name' => 'teknisi'
        ], [
            'display_name' => 'Teknisi',
            'description' => 'Technical specialist for complex issues'
        ]);

        // Get staff_support role
        $staffSupportRole = Role::where('name', 'staff_support')->first();

        if ($staffSupportRole) {
            // Move half users to staff, half to teknisi (arbitrary split)
            $users = User::where('role_id', $staffSupportRole->id)->get();
            $half = ceil($users->count() / 2);
            
            $users->take($half)->each(function ($user) use ($staffRole) {
                $user->update(['role_id' => $staffRole->id]);
            });
            
            $users->skip($half)->each(function ($user) use ($teknisiRole) {
                $user->update(['role_id' => $teknisiRole->id]);
            });

            // Delete staff_support role
            $staffSupportRole->delete();
        }
    }
};