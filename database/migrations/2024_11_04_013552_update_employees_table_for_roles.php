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
            // Change the 'role' column to 'roles' as a JSON type
            $table->dropColumn('role'); // Drop the old 'role' column
            $table->json('roles')->nullable(); // Add new 'roles' column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('roles'); // Drop the 'roles' column
            $table->string('role')->nullable(); // Re-add the 'role' column
        });
    }
};
