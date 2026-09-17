<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn('source');
        });

        Schema::table('enrollments', function (Blueprint $table) {
            // Was a fixed enum(subscription,purchase,free); switched to a
            // plain string so "manual" (admin-granted access) doesn't need
            // another migration, and any future source is just a string.
            $table->string('source', 20)->default('free')->after('course_id');
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn('source');
        });

        Schema::table('enrollments', function (Blueprint $table) {
            $table->enum('source', ['subscription', 'purchase', 'free'])->default('free')->after('course_id');
        });
    }
};
