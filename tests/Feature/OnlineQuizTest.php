<?php

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizSubmission;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('guru can view quiz list and create new quiz', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $mat = Subject::where('code', 'MAT-P')->first();

    // 1. Guru accesses quiz list
    $response = $this->actingAs($guru)->get(route('guru.kuis'));
    $response->assertOk();

    // 2. Guru creates new quiz
    $storeResponse = $this->actingAs($guru)->post(route('guru.kuis.store'), [
        'school_class_id' => $class12->id,
        'subject_id' => $mat->id,
        'title' => 'Kuis Integral Subtitusi & Parsial',
        'type' => 'Formatif',
        'duration' => 60,
        'status' => 'Terbit',
    ]);

    $storeResponse->assertRedirect();
    expect(Quiz::where('title', 'Kuis Integral Subtitusi & Parsial')->exists())->toBeTrue();
});

test('guru can grade essay submission of student', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $submission = QuizSubmission::first();

    expect($submission)->not->toBeNull();

    $gradeResponse = $this->actingAs($guru)->post(route('guru.kuis.grade', $submission->id), [
        'essay_score' => 85,
        'feedback' => 'Penjelasan langkah matematis runtut dan jelas.',
    ]);

    $gradeResponse->assertRedirect();

    $submission->refresh();
    expect($submission->is_graded)->toBeTrue();
    expect((float) $submission->essay_score)->toBe(85.0);
    expect($submission->feedback)->toContain('runtut dan jelas');
});
