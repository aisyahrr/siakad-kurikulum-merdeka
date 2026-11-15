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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('assessment_component_id')->nullable()->constrained('assessment_components')->nullOnDelete();
            $table->decimal('assignment_score', 5, 2)->default(0); // Formatif 40%
            $table->decimal('midterm_score', 5, 2)->default(0);    // STS 30%
            $table->decimal('final_score', 5, 2)->default(0);      // SAS 30%
            $table->decimal('overall_score', 5, 2)->default(0);    // Nilai Akhir
            $table->enum('letter_grade', ['A', 'B', 'C', 'D'])->default('C');
            $table->text('competency_achieved')->nullable();
            $table->text('competency_improved')->nullable();
            $table->unique(['school_class_id', 'subject_id', 'student_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
