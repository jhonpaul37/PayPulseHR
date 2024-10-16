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
        Schema::create('loans_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_type_id')->constrained('loans_types')->onDelete('cascade');
            $table->integer('months'); // Duration of loan in months
            $table->decimal('interest_rate', 5, 2); // e.g., 6.5%
            $table->decimal('penalty_rate', 5, 2); // Monthly overdue penalty
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans_plans');
    }
};
