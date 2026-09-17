<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_learning_path', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('learning_path_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['subscription_id', 'learning_path_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_learning_path');
    }
};
