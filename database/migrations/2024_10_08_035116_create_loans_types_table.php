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
        Schema::create('loans_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_program_id')->constrained('programs_loans')->onDelete('cascade');
            $table->string('type'); // e.g., Salary Loan, Housing Loan
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans_types');
    }
};
