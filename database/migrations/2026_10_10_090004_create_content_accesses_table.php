<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A generic grant of access to a polymorphic "accessible" (Material or
     * Cycle today, any future one-off sellable content later) — either
     * because the user bought it or because an admin opened it manually.
     * Course access keeps using the existing enrollments table.
     */
    public function up(): void
    {
        Schema::create('content_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('accessible_type');
            $table->unsignedBigInteger('accessible_id');
            $table->string('source', 20)->default('manual');
            $table->timestamp('granted_at')->useCurrent();
            $table->timestamps();

            $table->unique(['user_id', 'accessible_type', 'accessible_id'], 'content_access_unique');
            $table->index(['accessible_type', 'accessible_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_accesses');
    }
};
