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
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('salary_grade_id')->nullable()->constrained('salary_grades')->onDelete('set null')->comment('Reference to salary grade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Drop the foreign key and the column
            $table->dropForeign(['salary_grade_id']);
            $table->dropColumn('salary_grade_id');
        });
    }
};
