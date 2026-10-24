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
        Schema::table('cycle_materials', function (Blueprint $table) {
            $table->enum('type', ['link', 'material', 'pdf'])->default('link')->change();
            $table->string('file_path')->nullable()->after('material_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cycle_materials', function (Blueprint $table) {
            $table->dropColumn('file_path');
            $table->enum('type', ['link', 'material'])->default('link')->change();
        });
    }
};
