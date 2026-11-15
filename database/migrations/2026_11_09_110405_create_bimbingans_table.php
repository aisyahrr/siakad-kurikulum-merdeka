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
        Schema::create('bimbingans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('school_class_id')->nullable()->constrained('school_classes')->nullOnDelete();
            $table->enum('category', ['Akademik', 'Kedisiplinan', 'Presensi', 'Karakter'])->default('Akademik');
            $table->date('date');
            $table->text('issue');
            $table->text('action_plan');
            $table->boolean('parent_contacted')->default(false);
            $table->enum('status', ['Dalam Pemantauan', 'Tuntas'])->default('Dalam Pemantauan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bimbingans');
    }
};
