<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->string('company_id');
        $table->string('first_name');
        $table->string('last_name');
        $table->string('middle_name')->nullable();
        $table->date('birthdate');
        $table->string('sex');
        $table->string('civil_status');
        $table->string('nationality');
        $table->string('address');
        $table->string('phone');
        $table->string('email')->unique();

        $table->string('position');
        $table->string('department');
        $table->date('start_date');
        $table->enum('employment_type', ['full-time', 'part-time', 'contract']);
        $table->decimal('salary', 8, 2);

        // Benefits & Perks
        $table->integer('vacation_days')->default(0);
        $table->integer('sick_days')->default(0);

        // Attendance & Leave
        $table->integer('leave_balance')->default(0);

        // Profile Picture
        $table->string('photo_url')->nullable(); // New column for profile picture

        // Resignation/Termination
        $table->date('termination_date')->nullable();
        $table->string('termination_reason')->nullable();

        $table->timestamps();
    });

}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
