<?php

use App\Models\AcademicYear;
use App\Models\Meeting;
use App\Models\Quiz;
use App\Models\Schedule;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('guru static UI pages can be rendered', function () {
    $guru = User::where('role', 'guru')->first();

    $this->actingAs($guru)->get(route('guru.dashboard'))->assertOk();
    $this->actingAs($guru)->get(route('guru.mata-pelajaran'))->assertOk();
    $this->actingAs($guru)->get(route('guru.pengumuman'))->assertOk();
});

test('guru can update and delete meeting', function () {
    $guru = User::where('role', 'guru')->first();
    $class = SchoolClass::first();
    $subject = Subject::first();

    $meeting = Meeting::create([
        'teacher_id' => $guru->teacher->id,
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'session_no' => 1,
        'title' => 'Pertemuan Aljabar Linear',
        'summary' => 'Ringkasan materi bab 1',
        'date' => '2026-11-25',
        'status' => 'Draft',
    ]);

    // Update meeting
    $updateResponse = $this->actingAs($guru)->put(route('guru.pertemuan.update', $meeting), [
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'session_no' => 1,
        'title' => 'Pertemuan Aljabar Linear (Terbit)',
        'summary' => 'Ringkasan lengkap',
        'date' => '2026-11-25',
        'status' => 'Terbit',
    ]);
    $updateResponse->assertRedirect();
    expect($meeting->fresh()->title)->toBe('Pertemuan Aljabar Linear (Terbit)');
    expect($meeting->fresh()->status)->toBe('Terbit');

    // Delete meeting
    $deleteResponse = $this->actingAs($guru)->delete(route('guru.pertemuan.destroy', $meeting));
    $deleteResponse->assertRedirect();
    expect(Meeting::find($meeting->id))->toBeNull();
});

test('guru can update and delete schedule', function () {
    $guru = User::where('role', 'guru')->first();
    $class = SchoolClass::first();
    $subject = Subject::first();
    $activeYear = AcademicYear::where('is_active', true)->first();

    $schedule = Schedule::create([
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'teacher_id' => $guru->teacher->id,
        'academic_year_id' => $activeYear?->id,
        'day' => 'Senin',
        'start_time' => '07:30:00',
        'end_time' => '09:00:00',
        'room' => 'Lab 1',
        'topic' => 'Kalkulus Dasar',
        'sks' => 2,
    ]);

    // Update schedule
    $updateResponse = $this->actingAs($guru)->put(route('guru.jadwal.update', $schedule), [
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'teacher_id' => $guru->teacher->id,
        'day' => 'Selasa',
        'start_time' => '08:00:00',
        'end_time' => '09:30:00',
        'room' => 'Lab 2',
        'topic' => 'Kalkulus Lanjutan',
        'sks' => 2,
    ]);
    $updateResponse->assertRedirect();
    expect($schedule->fresh()->day)->toBe('Selasa');
    expect($schedule->fresh()->room)->toBe('Lab 2');

    // Delete schedule
    $deleteResponse = $this->actingAs($guru)->delete(route('guru.jadwal.destroy', $schedule));
    $deleteResponse->assertRedirect();
    expect(Schedule::find($schedule->id))->toBeNull();
});

test('guru can update and delete quiz', function () {
    $guru = User::where('role', 'guru')->first();
    $class = SchoolClass::first();
    $subject = Subject::first();

    $quiz = Quiz::create([
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'teacher_id' => $guru->teacher->id,
        'title' => 'Kuis Matriks 1',
        'type' => 'Pilihan Ganda & Essay',
        'duration' => 60,
        'status' => 'Draft',
    ]);

    // Update quiz
    $updateResponse = $this->actingAs($guru)->put(route('guru.kuis.update', $quiz), [
        'school_class_id' => $class->id,
        'subject_id' => $subject->id,
        'title' => 'Kuis Matriks 1 Final',
        'type' => 'Pilihan Ganda & Essay',
        'duration' => 90,
        'status' => 'Terbit',
    ]);
    $updateResponse->assertRedirect();
    expect($quiz->fresh()->title)->toBe('Kuis Matriks 1 Final');
    expect($quiz->fresh()->duration)->toBe(90);

    // Delete quiz
    $deleteResponse = $this->actingAs($guru)->delete(route('guru.kuis.destroy', $quiz));
    $deleteResponse->assertRedirect();
    expect(Quiz::find($quiz->id))->toBeNull();
});

test('guru operations negative validation cases', function () {
    $guru = User::where('role', 'guru')->first();

    // Invalid schedule: invalid day
    $scheduleResponse = $this->actingAs($guru)->post(route('guru.jadwal.store'), [
        'school_class_id' => 99999,
        'subject_id' => 99999,
        'teacher_id' => 99999,
        'day' => 'Minggu',
        'start_time' => '',
        'end_time' => '',
    ]);
    $scheduleResponse->assertSessionHasErrors(['school_class_id', 'subject_id', 'teacher_id', 'day', 'start_time', 'end_time']);

    // Invalid quiz: duration out of range
    $quizResponse = $this->actingAs($guru)->post(route('guru.kuis.store'), [
        'school_class_id' => 1,
        'subject_id' => 1,
        'title' => '',
        'type' => 'Online',
        'duration' => 4, // min is 5
        'status' => 'Unknown',
    ]);
    $quizResponse->assertSessionHasErrors(['title', 'duration', 'status']);
});
