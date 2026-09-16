<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Swap the fixed month/year enum for a free-text interval so we can
        // offer half-yearly / gold-yearly tiers without another migration,
        // plus a badge for marketing copy ("الأكثر توفيرًا", "ذهبي"...).
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn('interval');
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->string('interval', 20)->default('month')->after('price');
            $table->string('badge')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['interval', 'badge']);
        });

        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->enum('interval', ['month', 'year'])->default('month')->after('price');
        });
    }
};
