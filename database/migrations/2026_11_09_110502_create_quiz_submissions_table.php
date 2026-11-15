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
        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->decimal('mcq_score', 5, 2)->default(0);
            $table->decimal('essay_score', 5, 2)->nullable();
            $table->decimal('total_score', 5, 2)->nullable();
            $table->boolean('is_graded')->default(false);
            $table->text('feedback')->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->unique(['quiz_id', 'student_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_submissions');
    }
};
