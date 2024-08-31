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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('jev_no');
            $table->integer('ors_burs_no');
            $table->string('f_cluster');
            $table->string('div_num');
            $table->json('uacs_code');
            $table->json('debit');
            $table->json('credit');
            $table->integer('user_id');
            $table->integer('amount');
            $table->integer('ApproveAmount');
            $table->string('particulars');
            $table->string('address');
            $table->string('payee');
            $table->string('bankName');
            $table->integer('tin_no');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
