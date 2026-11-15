<?php

use App\Models\AcademicYear;
use App\Models\ClassStudent;
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

test('master academic data seeded properly with relations', function () {
    // 1. Check Admin User
    $admin = User::where('role', 'admin')->first();
    expect($admin)->not->toBeNull();

    // 2. Check Guru & Teacher Model Relation
    $guruUser = User::where('email', 'guru@siakad.test')->first();
    expect($guruUser)->not->toBeNull();
    expect($guruUser->teacher)->toBeInstanceOf(Teacher::class);
    expect($guruUser->teacher->nidn)->toBe('0415078501');

    // 3. Check Wali Kelas & Class Relation
    $waliUser = User::where('email', 'walikelas@siakad.test')->first();
    expect($waliUser)->not->toBeNull();
    expect($waliUser->teacher)->toBeInstanceOf(Teacher::class);
    expect($waliUser->teacher->classes->count())->toBeGreaterThan(0);

    // 4. Check School Class
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    expect($class12)->not->toBeNull();
    expect($class12->waliKelas->id)->toBe($waliUser->teacher->id);

    // 5. Check Siswa & Parent Relation
    $siswaUser = User::where('email', 'siswa@siakad.test')->first();
    $ortuUser = User::where('email', 'orangtua@siakad.test')->first();
    expect($siswaUser->student)->toBeInstanceOf(Student::class);
    expect($siswaUser->student->parent_user_id)->toBe($ortuUser->id);

    // 6. Check ClassStudent Enrolment
    $enrolment = ClassStudent::where('student_id', $siswaUser->student->id)->first();
    expect($enrolment)->not->toBeNull();
    expect($enrolment->schoolClass->name)->toBe('XII MIPA 1');
    expect($enrolment->academicYear->is_active)->toBeTrue();

    // 7. Check Subjects
    expect(Subject::where('code', 'MAT-P')->exists())->toBeTrue();
});

test('admin can access master data and create new class', function () {
    $admin = User::where('role', 'admin')->first();

    $response = $this->actingAs($admin)->get(route('admin.master-data'));
    $response->assertOk();

    $storeResponse = $this->actingAs($admin)->post(route('admin.master-data.kelas.store'), [
        'name' => 'X-B Unggulan',
        'grade_level' => 'X',
    ]);

    $storeResponse->assertRedirect();
    expect(SchoolClass::where('name', 'X-B Unggulan')->exists())->toBeTrue();
});

test('admin can create new subject', function () {
    $admin = User::where('role', 'admin')->first();

    $response = $this->actingAs($admin)->post(route('admin.master-data.mapel.store'), [
        'code' => 'SEJ-IND',
        'name' => 'Sejarah Indonesia',
    ]);

    $response->assertRedirect();
    expect(Subject::where('code', 'SEJ-IND')->exists())->toBeTrue();
});

test('admin can create and activate academic year', function () {
    $admin = User::where('role', 'admin')->first();

    $response = $this->actingAs($admin)->post(route('admin.data-akademik.store'), [
        'name' => '2025/2026',
        'semester' => 'Ganjil',
        'is_active' => true,
    ]);

    $response->assertRedirect();
    $newYear = AcademicYear::where('name', '2025/2026')->first();
    expect($newYear)->not->toBeNull();
    expect($newYear->is_active)->toBeTrue();

    // Pastikan tahun akademik sebelumnya otomatis nonaktif
    $oldYear = AcademicYear::where('name', '2024/2025')->where('semester', 'Ganjil')->first();
    expect($oldYear->is_active)->toBeFalse();
});
