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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('requestor_name');
            $table->string('office_unit');
            $table->date('request_date');
            $table->date('from_date');
            $table->date('to_date');
            $table->integer('total_days');
            $table->json('leave_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
