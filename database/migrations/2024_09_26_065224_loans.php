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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->decimal('principal', 15, 2);
            $table->decimal('interest_rate', 5, 2);
            $table->enum('interest_type', ['fixed', 'variable']);
            $table->integer('loan_term');
            $table->enum('amortization_type', ['equal_payments', 'declining_balance']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
