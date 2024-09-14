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
        $table->string('emergency_contact_name');
        $table->string('emergency_contact_phone');

        // Employment details
        $table->string('position');
        $table->string('department');
        $table->date('start_date');
        $table->enum('employment_type', ['full-time', 'part-time', 'contract']);

        // Salary & Compensation
        $table->decimal('salary', 8, 2);
        $table->string('pay_frequency')->default('monthly');
        $table->decimal('overtime_rate', 8, 2)->nullable();

        // Bank information
        $table->string('bank_name');
        $table->string('bank_account_number');

        // Benefits & Perks
        $table->string('insurance_plan')->nullable();
        $table->string('retirement_plan')->nullable();
        $table->integer('vacation_days')->default(0);
        $table->integer('sick_days')->default(0);

        // Legal & Compliance
        $table->string('tax_id');
        $table->string('work_authorization')->nullable();

        // Performance & Development
        $table->text('performance_review')->nullable();

        // Attendance & Leave
        $table->integer('leave_balance')->default(0);

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
