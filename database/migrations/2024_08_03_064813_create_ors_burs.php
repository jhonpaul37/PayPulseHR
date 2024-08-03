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
        Schema::create('ors_burs', function (Blueprint $table) {
            $table->id();
            $table->integer('ors_burs_no');
            $table->integer('amount');
            $table->string('particulars');
            $table->string('office');
            $table->string('address');
            $table->string('payee');
            $table->string('jev_no');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ors_burs');
    }
};
