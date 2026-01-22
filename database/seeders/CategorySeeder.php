<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'IT Support',
                'description' => 'Technical issues and IT support requests',
                'is_active' => true
            ],
            [
                'name' => 'Hardware',
                'description' => 'Hardware related problems and requests',
                'is_active' => true
            ],
            [
                'name' => 'Software',
                'description' => 'Software installation and configuration',
                'is_active' => true
            ],
            [
                'name' => 'Network',
                'description' => 'Network connectivity and infrastructure',
                'is_active' => true
            ],
            [
                'name' => 'General',
                'description' => 'General inquiries and requests',
                'is_active' => true
            ]
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}