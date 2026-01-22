<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sla_policies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('priority_id')->constrained()->onDelete('cascade');
            $table->integer('response_time_hours'); // First response SLA
            $table->integer('resolution_time_hours'); // Resolution SLA
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add SLA fields to tickets table
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('sla_response_due')->nullable()->after('due_date');
            $table->timestamp('sla_resolution_due')->nullable()->after('sla_response_due');
            $table->timestamp('first_response_at')->nullable()->after('sla_resolution_due');
            $table->boolean('sla_breached')->default(false)->after('first_response_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sla_policies');
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn(['sla_response_due', 'sla_resolution_due', 'first_response_at', 'sla_breached']);
        });
    }
};