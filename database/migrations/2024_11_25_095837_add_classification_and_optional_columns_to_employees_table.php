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
        Schema::table('employees', function (Blueprint $table) {
            // Required field: Classification
            $table->enum('classification', ['Regular', 'Casual', 'OJ/Job Order', 'COS/Contract of Service'])
                  ->after('salary_grade_id');

            // Not required fields
            $table->string('gsis_no')->nullable()->after('classification');
            $table->string('hdmf_no')->nullable()->after('gsis_no');
            $table->string('phic_no')->nullable()->after('hdmf_no');
            $table->string('bir_tin_no')->nullable()->after('phic_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Drop the added columns in the down method
            $table->dropColumn([
                'classification',
                'gsis_no',
                'hdmf_no',
                'phic_no',
                'bir_tin_no',
            ]);
        });
    }
};
