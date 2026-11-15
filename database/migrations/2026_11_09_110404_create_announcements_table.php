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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained('school_classes')->nullOnDelete();
            $table->enum('target_role', ['all', 'guru', 'wali-kelas', 'siswa', 'orang-tua'])->default('all');
            $table->string('title');
            $table->text('content');
            $table->enum('category', ['Akademik', 'Ujian & Penilaian', 'Kegiatan Siswa', 'Penting / Mendesak', 'Administrasi'])->default('Akademik');
            $table->string('reference_code')->nullable();
            $table->string('badge_text')->nullable();
            $table->string('attachment_path')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
