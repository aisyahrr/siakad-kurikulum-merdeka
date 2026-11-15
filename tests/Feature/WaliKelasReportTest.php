<?php

use App\Models\AcademicYear;
use App\Models\Bimbingan;
use App\Models\ReportCard;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('wali kelas can view bimbingan logs and create new counseling log', function () {
    $wali = User::where('email', 'walikelas@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    // 1. Wali kelas accesses bimbingan page
    $response = $this->actingAs($wali)->get(route('wali.bimbingan'));
    $response->assertOk();

    // 2. Wali kelas adds new guidance log
    $storeResponse = $this->actingAs($wali)->post(route('wali.bimbingan.store'), [
        'student_id' => $siswa->student->id,
        'school_class_id' => $class12->id,
        'category' => 'Kedisiplinan',
        'date' => now()->toDateString(),
        'issue' => 'Keterlambatan pada apel pagi hari Senin.',
        'action_plan' => 'Pembinaan kedisiplinan dan monitoring berkala oleh wali kelas.',
        'parent_contacted' => true,
        'status' => 'Tuntas',
    ]);

    $storeResponse->assertRedirect();
    expect(Bimbingan::where('category', 'Kedisiplinan')->where('status', 'Tuntas')->exists())->toBeTrue();
});

test('wali kelas can view rekap nilai and publish student report card', function () {
    $wali = User::where('email', 'walikelas@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    // 1. Wali kelas accesses rekap nilai page
    $response = $this->actingAs($wali)->get(route('wali.rekap-nilai'));
    $response->assertOk();

    // 2. Wali kelas publishes report card
    $publishResponse = $this->actingAs($wali)->post(route('wali.rapor.publish'), [
        'student_id' => $siswa->student->id,
        'school_class_id' => $class12->id,
        'gpa' => 92.5,
        'rank' => 1,
        'notes' => 'Pencapaian belajar sangat istimewa pada seluruh mata pelajaran.',
        'status' => 'Terbit',
    ]);

    $publishResponse->assertRedirect();

    $report = ReportCard::where('student_id', $siswa->student->id)->first();
    expect($report)->not->toBeNull();
    expect((float) $report->gpa)->toBe(92.5);
    expect($report->notes)->toContain('Pencapaian belajar sangat istimewa');
});

test('siswa can view their digital report card', function () {
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    $response = $this->actingAs($siswa)->get(route('siswa.rapor'));
    $response->assertOk();
});
