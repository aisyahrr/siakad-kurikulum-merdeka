<?php

use App\Models\AcademicYear;
use App\Models\Grade;
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

test('guru can view gradebook and submit kurikulum merdeka assessments', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $mat = Subject::where('code', 'MAT-P')->first();
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    // 1. Guru accesses gradebook
    $response = $this->actingAs($guru)->get(route('guru.nilai', [
        'class_id' => $class12->id,
        'subject_id' => $mat->id,
    ]));
    $response->assertOk();

    // 2. Guru submits Kurikulum Merdeka scores
    // Formatif: 90 (40% = 36), STS: 80 (30% = 24), SAS: 90 (30% = 27) => Overall: 87 (B)
    $storeResponse = $this->actingAs($guru)->post(route('guru.nilai.store'), [
        'school_class_id' => $class12->id,
        'subject_id' => $mat->id,
        'grades' => [
            [
                'student_id' => $siswa->student->id,
                'assignment' => 90,
                'midterm' => 80,
                'final' => 90,
                'competency_achieved' => 'Memahami konsep dasar limit dan turunan secara optimal.',
                'competency_improved' => 'Perlu latihan integral parsial berkelanjutan.',
            ],
        ],
    ]);

    $storeResponse->assertRedirect();

    $grade = Grade::where('student_id', $siswa->student->id)
        ->where('subject_id', $mat->id)
        ->first();

    expect($grade)->not->toBeNull();
    expect((float) $grade->overall_score)->toBe(87.0);
    expect($grade->letter_grade)->toBe('B');
    expect($grade->competency_achieved)->toContain('limit dan turunan');
});

test('siswa can view their published grades', function () {
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    $response = $this->actingAs($siswa)->get(route('siswa.nilai'));
    $response->assertOk();
});

test('orang tua can view their child grades', function () {
    $ortu = User::where('email', 'orangtua@siakad.test')->first();

    $response = $this->actingAs($ortu)->get(route('orangtua.nilai'));
    $response->assertOk();
});
