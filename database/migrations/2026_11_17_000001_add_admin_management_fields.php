<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('identifier')->nullable()->after('role');
            $table->boolean('is_active')->default(true)->after('role');
            $table->timestamp('last_login_at')->nullable()->after('role');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->string('entry_year', 4)->nullable()->after('nis');
            $table->string('status')->default('Aktif')->after('entry_year');
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->string('main_subject')->nullable()->after('nidn');
            $table->unsignedSmallInteger('teaching_hours')->default(0)->after('main_subject');
            $table->string('employment_status')->nullable()->after('teaching_hours');
        });

        Schema::table('school_classes', function (Blueprint $table) {
            $table->string('peminatan')->nullable()->after('grade_level');
            $table->unsignedSmallInteger('capacity')->default(36)->after('peminatan');
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->string('category')->default('Wajib')->after('name');
            $table->unsignedSmallInteger('hours_per_week')->default(3)->after('category');
            $table->unsignedSmallInteger('kktp')->default(70)->after('hours_per_week');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'identifier', 'is_active', 'last_login_at']);
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['entry_year', 'status']);
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn(['main_subject', 'teaching_hours', 'employment_status']);
        });

        Schema::table('school_classes', function (Blueprint $table) {
            $table->dropColumn(['peminatan', 'capacity']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn(['category', 'hours_per_week', 'kktp']);
        });
    }
};
