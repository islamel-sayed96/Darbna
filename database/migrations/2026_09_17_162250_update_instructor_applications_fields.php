<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instructor_applications', function (Blueprint $table) {
            $table->dropColumn('message');
        });

        Schema::table('instructor_applications', function (Blueprint $table) {
            $table->string('residence')->nullable()->after('phone');
            $table->string('cv_path')->nullable()->after('residence');
            $table->string('portfolio')->nullable()->after('cv_path');
            $table->string('course_title')->nullable()->after('portfolio');
            $table->text('course_syllabus')->nullable()->after('course_title');
        });
    }

    public function down(): void
    {
        Schema::table('instructor_applications', function (Blueprint $table) {
            $table->dropColumn(['residence', 'cv_path', 'portfolio', 'course_title', 'course_syllabus']);
        });

        Schema::table('instructor_applications', function (Blueprint $table) {
            $table->text('message')->nullable();
        });
    }
};
