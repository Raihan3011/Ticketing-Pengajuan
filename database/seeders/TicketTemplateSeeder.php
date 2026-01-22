<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TicketTemplate;
use App\Models\Category;
use App\Models\Priority;

class TicketTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $itCategory = Category::where('name', 'IT Support')->first();
        $hardwareCategory = Category::where('name', 'Hardware')->first();
        $mediumPriority = Priority::where('name', 'Medium')->first();
        $highPriority = Priority::where('name', 'High')->first();
        
        $templates = [
            [
                'name' => 'Password Reset Request',
                'description' => 'Template for password reset requests',
                'title_template' => 'Password Reset Request for [Your Name]',
                'description_template' => 'I need to reset my password for the following account:\n\nUsername/Email: [Your Username/Email]\nReason: [Forgot password/Account locked/etc.]\n\nPlease help me reset my password.',
                'category_id' => $itCategory->id,
                'priority_id' => $mediumPriority->id
            ],
            [
                'name' => 'Hardware Issue Report',
                'description' => 'Template for reporting hardware problems',
                'title_template' => 'Hardware Issue: [Device Type] Not Working',
                'description_template' => 'I am experiencing issues with my hardware:\n\nDevice: [Computer/Printer/Monitor/etc.]\nProblem: [Describe the issue]\nError Messages: [Any error messages]\nWhen did it start: [Date/Time]\n\nSteps I have tried:\n1. [Step 1]\n2. [Step 2]',
                'category_id' => $hardwareCategory->id,
                'priority_id' => $highPriority->id
            ],
            [
                'name' => 'Software Installation Request',
                'description' => 'Template for software installation requests',
                'title_template' => 'Software Installation Request: [Software Name]',
                'description_template' => 'I need the following software installed:\n\nSoftware Name: [Name]\nVersion: [Version if specific]\nBusiness Justification: [Why you need this software]\nUrgency: [When you need it by]\n\nPlease let me know if you need any additional information.',
                'category_id' => $itCategory->id,
                'priority_id' => $mediumPriority->id
            ]
        ];

        foreach ($templates as $template) {
            TicketTemplate::create($template);
        }
    }
}