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

            // Named explicitly — the auto-generated name (table + both
            // column names + "_unique") is 69 characters, over MySQL's
            // 64-character identifier limit (SQLite, used in local/demo
            // dev, doesn't enforce this, so it only surfaced on real MySQL).
            $table->unique(['subscription_id', 'learning_path_id'], 'subscription_learning_path_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_learning_path');
    }
};
