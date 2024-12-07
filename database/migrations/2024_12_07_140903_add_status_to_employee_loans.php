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
        Schema::table('employee_loans', function (Blueprint $table) {
            $table->enum('status', ['pending', 'active', 'completed', 'defaulted'])->default('pending')->after('monthly_amortization');
            $table->decimal('total_paid', 15, 2)->after('monthly_amortization');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_loans', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('total_paid');
        });
    }
};
