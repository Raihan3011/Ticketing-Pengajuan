<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KnowledgeBaseArticle;
use App\Models\Category;
use App\Models\User;

class KnowledgeBaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@ticketing.com')->first();
        $itCategory = Category::where('name', 'IT Support')->first();
        $hardwareCategory = Category::where('name', 'Hardware')->first();
        
        $articles = [
            [
                'title' => 'How to Reset Your Password',
                'content' => 'To reset your password, follow these steps: 1. Go to login page 2. Click "Forgot Password" 3. Enter your email 4. Check your email for reset link 5. Follow the instructions in the email',
                'category_id' => $itCategory->id,
                'tags' => ['password', 'reset', 'login'],
                'views' => 150,
                'helpful_votes' => 25,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Troubleshooting Network Connection Issues',
                'content' => 'If you are experiencing network connectivity issues: 1. Check your network cables 2. Restart your router 3. Check network settings 4. Contact IT support if problem persists',
                'category_id' => $itCategory->id,
                'tags' => ['network', 'connection', 'troubleshooting'],
                'views' => 89,
                'helpful_votes' => 12,
                'created_by' => $admin->id
            ],
            [
                'title' => 'Computer Running Slowly - Quick Fixes',
                'content' => 'If your computer is running slowly, try these solutions: 1. Restart your computer 2. Close unnecessary programs 3. Check for malware 4. Free up disk space 5. Update your software',
                'category_id' => $hardwareCategory->id,
                'tags' => ['performance', 'slow', 'computer'],
                'views' => 203,
                'helpful_votes' => 45,
                'created_by' => $admin->id
            ]
        ];

        foreach ($articles as $article) {
            KnowledgeBaseArticle::create($article);
        }
    }
}