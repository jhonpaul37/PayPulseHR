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
    Schema::table('vouchers', function (Blueprint $table) {
        $table->string('responsibility_center')->nullable();
        $table->string('mfo_pap')->nullable();
        $table->string('mode_of_payment')->nullable();
        $table->unsignedBigInteger('approved_by')->nullable();
        $table->unsignedBigInteger('prepared_by')->nullable();
        $table->unsignedBigInteger('signatory_1')->nullable();
        $table->unsignedBigInteger('signatory_2')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
public function down()
{
    Schema::table('vouchers', function (Blueprint $table) {
        $table->dropColumn([
            'responsibility_center',
            'mfo_pap',
            'mode_of_payment',
            'approved_by',
            'prepared_by',
            'signatory_1',
            'signatory_2'
        ]);
    });
}
};
