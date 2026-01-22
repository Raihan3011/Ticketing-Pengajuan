<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            PrioritySeeder::class,
            StatusSeeder::class,
            SlaSeeder::class,
            AdminSeeder::class,
            PimpinanSeeder::class,
            SampleUsersSeeder::class,
            SampleTicketsSeeder::class,
            KnowledgeBaseSeeder::class,
            TicketTemplateSeeder::class,
        ]);
    }
}
