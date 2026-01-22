<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'problem_detail')) {
                $table->text('problem_detail')->nullable()->after('description');
            }
            if (!Schema::hasColumn('tickets', 'assigned_to_pimpinan_id')) {
                $table->foreignId('assigned_to_pimpinan_id')->nullable()->constrained('users')->onDelete('set null')->after('assigned_to');
            }
            if (!Schema::hasColumn('tickets', 'rating')) {
                $table->integer('rating')->nullable()->after('resolved_at');
            }
            if (!Schema::hasColumn('tickets', 'feedback')) {
                $table->text('feedback')->nullable()->after('rating');
            }
            if (!Schema::hasColumn('tickets', 'staff_notified_at')) {
                $table->timestamp('staff_notified_at')->nullable()->after('feedback');
            }
            if (!Schema::hasColumn('tickets', 'pimpinan_notified_at')) {
                $table->timestamp('pimpinan_notified_at')->nullable()->after('staff_notified_at');
            }
            if (!Schema::hasColumn('tickets', 'pimpinan_approved_at')) {
                $table->timestamp('pimpinan_approved_at')->nullable()->after('pimpinan_notified_at');
            }
            if (!Schema::hasColumn('tickets', 'staff_completed_at')) {
                $table->timestamp('staff_completed_at')->nullable()->after('pimpinan_approved_at');
            }
            if (!Schema::hasColumn('tickets', 'completion_notes')) {
                $table->text('completion_notes')->nullable()->after('staff_completed_at');
            }
            if (!Schema::hasColumn('tickets', 'first_response_at')) {
                $table->timestamp('first_response_at')->nullable()->after('completion_notes');
            }
            if (!Schema::hasColumn('tickets', 'sla_response_due')) {
                $table->timestamp('sla_response_due')->nullable()->after('first_response_at');
            }
            if (!Schema::hasColumn('tickets', 'sla_resolution_due')) {
                $table->timestamp('sla_resolution_due')->nullable()->after('sla_response_due');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'problem_detail',
                'assigned_to_pimpinan_id',
                'rating',
                'feedback',
                'staff_notified_at',
                'pimpinan_notified_at',
                'pimpinan_approved_at',
                'staff_completed_at',
                'completion_notes',
                'first_response_at',
                'sla_response_due',
                'sla_resolution_due'
            ]);
        });
    }
};
