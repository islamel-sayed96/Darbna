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
        Schema::create('cycle_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cycle_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['link', 'material'])->default('link');
            $table->string('title');
            $table->string('url')->nullable();
            $table->foreignId('material_id')->nullable()->constrained('materials')->cascadeOnDelete();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cycle_materials');
    }
};
