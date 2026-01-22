<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('staff_notified_at')->nullable()->after('resolved_at');
            $table->timestamp('pimpinan_notified_at')->nullable()->after('staff_notified_at');
            $table->timestamp('pimpinan_approved_at')->nullable()->after('pimpinan_notified_at');
            $table->timestamp('staff_completed_at')->nullable()->after('pimpinan_approved_at');
            $table->text('completion_notes')->nullable()->after('staff_completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'staff_notified_at',
                'pimpinan_notified_at',
                'pimpinan_approved_at',
                'staff_completed_at',
                'completion_notes'
            ]);
        });
    }
};
