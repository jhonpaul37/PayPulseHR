<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

public function up(){

    Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');

        // Personal Info
        $table->string('employee_id');
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

        // Employee Info
        $table->string('photo_url')->nullable();
        $table->string('position');
        $table->string('department');
        $table->date('start_date');
        $table->enum('employment_type', ['full-time', 'part-time', 'contract']);
        $table->date('termination_date')->nullable();
        $table->string('termination_reason')->nullable();
        $table->string('role')->nullable();

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
