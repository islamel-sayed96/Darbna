<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Subscriptions are now a duration x access-scope matrix instead of
        // a single "all courses" pass, so the free-text interval column is
        // replaced by a concrete duration and an access scope the checkout
        // and enrollment logic can act on directly.
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn('interval');
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->unsignedTinyInteger('duration_months')->default(1)->after('price');
            $table->string('access_type')->default('all_access')->after('duration_months');
            $table->unsignedTinyInteger('course_limit')->nullable()->after('access_type');
            $table->unsignedTinyInteger('path_limit')->nullable()->after('course_limit');
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['duration_months', 'access_type', 'course_limit', 'path_limit']);
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->string('interval', 20)->default('month')->after('price');
        });
    }
};
