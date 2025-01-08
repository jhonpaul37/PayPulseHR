<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Remove the old columns
            $table->dropColumn('position');
            $table->dropColumn('department');

            // Add the foreign key columns
            $table->foreignId('position_id')->nullable()->constrained('positions')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('cascade');

        });
    }

    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Drop the foreign key columns
            $table->dropForeign(['position_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn('position_id');
            $table->dropColumn('department_id');

            // Add back the old columns
            $table->string('position')->after('photo_url');
            $table->string('department')->after('position');
        });
    }
};

