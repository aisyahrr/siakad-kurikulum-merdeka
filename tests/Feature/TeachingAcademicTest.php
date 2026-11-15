<?php

use App\Models\AcademicYear;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Meeting;
use App\Models\Schedule;
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

test('guru can view schedule and add new schedule', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $bio = Subject::where('code', 'BIO-S')->first();

    // 1. View Schedule
    $response = $this->actingAs($guru)->get(route('guru.jadwal'));
    $response->assertOk();

    // 2. Add New Schedule
    $storeResponse = $this->actingAs($guru)->post(route('guru.jadwal.store'), [
        'school_class_id' => $class12->id,
        'subject_id' => $bio->id,
        'teacher_id' => $guru->teacher->id,
        'day' => 'Selasa',
        'start_time' => '09:15:00',
        'end_time' => '10:45:00',
        'room' => 'Lab Biologi',
        'topic' => 'Biologi Sel & Genetika',
        'sks' => 2,
    ]);

    $storeResponse->assertRedirect();
    expect(Schedule::where('room', 'Lab Biologi')->exists())->toBeTrue();
});

test('guru can view meetings and add new meeting', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $mat = Subject::where('code', 'MAT-P')->first();

    // 1. View Meetings
    $response = $this->actingAs($guru)->get(route('guru.pertemuan'));
    $response->assertOk();

    // 2. Add New Meeting
    $storeResponse = $this->actingAs($guru)->post(route('guru.pertemuan.store'), [
        'school_class_id' => $class12->id,
        'subject_id' => $mat->id,
        'session_no' => 2,
        'title' => 'Integral Parsial dan Substitusi',
        'summary' => 'Materi pembahasan integral teknik lanjutan.',
        'date' => now()->addDays(7)->toDateString(),
        'status' => 'Terbit',
    ]);

    $storeResponse->assertRedirect();
    expect(Meeting::where('title', 'Integral Parsial dan Substitusi')->exists())->toBeTrue();
});

test('guru can record attendance and siswa can view their attendance', function () {
    $guru = User::where('email', 'guru@siakad.test')->first();
    $siswa = User::where('email', 'siswa@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();
    $mat = Subject::where('code', 'MAT-P')->first();

    // 1. Teacher records attendance
    $postResponse = $this->actingAs($guru)->post(route('guru.presensi.store'), [
        'school_class_id' => $class12->id,
        'subject_id' => $mat->id,
        'date' => now()->toDateString(),
        'title' => 'Presensi Sesi Khusus',
        'records' => [
            [
                'student_id' => $siswa->student->id,
                'status' => 'Hadir',
                'note' => 'Aktif bertanya di kelas',
            ],
        ],
    ]);

    $postResponse->assertRedirect();
    
    $attendanceRecord = Attendance::where('student_id', $siswa->student->id)->latest()->first();
    expect($attendanceRecord)->not->toBeNull();
    expect($attendanceRecord->status)->toBe('Hadir');

    // 2. Siswa views their attendance
    $siswaResponse = $this->actingAs($siswa)->get(route('siswa.presensi'));
    $siswaResponse->assertOk();

    // 3. Siswa views their schedule
    $scheduleResponse = $this->actingAs($siswa)->get(route('siswa.schedule'));
    $scheduleResponse->assertOk();
});
