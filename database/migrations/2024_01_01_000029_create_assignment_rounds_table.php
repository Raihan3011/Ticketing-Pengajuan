<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignment_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('last_assigned_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignment_rounds');
    }
};