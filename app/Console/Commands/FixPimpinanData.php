<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;

class FixPimpinanData extends Command
{
    protected $signature = 'fix:pimpinan';
    protected $description = 'Fix pimpinan users data and ensure they are active';

    public function handle()
    {
        $this->info('Checking pimpinan role...');
        
        $pimpinanRole = Role::where('name', 'pimpinan')->first();
        
        if (!$pimpinanRole) {
            $this->error('Pimpinan role not found!');
            return 1;
        }
        
        $this->info("Pimpinan role found: {$pimpinanRole->display_name} (ID: {$pimpinanRole->id})");
        
        $pimpinanUsers = User::where('role_id', $pimpinanRole->id)->get();
        
        $this->info("Found {$pimpinanUsers->count()} user(s) with pimpinan role");
        
        if ($pimpinanUsers->isEmpty()) {
            $this->warn('No users found with pimpinan role!');
            return 0;
        }
        
        foreach ($pimpinanUsers as $user) {
            $status = $user->is_active ? 'Active' : 'Inactive';
            $this->line("- {$user->name} ({$user->email}) - {$status}");
            
            if (!$user->is_active) {
                $user->update(['is_active' => true]);
                $this->info("  ✓ Activated user: {$user->name}");
            }
        }
        
        $this->info("\nVerifying getPimpinan endpoint...");
        $activePimpinan = User::with('role')
            ->whereHas('role', function ($q) {
                $q->whereRaw('LOWER(name) = ?', ['pimpinan']);
            })
            ->where('is_active', true)
            ->get();
            
        $this->info("Active pimpinan users: {$activePimpinan->count()}");
        
        $this->info("\n✓ Fix completed successfully!");
        
        return 0;
    }
}
