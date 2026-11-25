<?php

use App\Models\Bimbingan;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('wali kelas static UI and views can be rendered', function () {
    $wali = User::where('role', 'wali-kelas')->first();

    $this->actingAs($wali)->get(route('wali.dashboard'))->assertOk();
    $this->actingAs($wali)->get(route('wali.dossier'))->assertOk();
    $this->actingAs($wali)->get(route('wali.presensi'))->assertOk();
});

test('wali kelas can update and delete bimbingan record', function () {
    $wali = User::where('role', 'wali-kelas')->first();
    $student = Student::first();
    $class = SchoolClass::first();

    $log = Bimbingan::create([
        'teacher_id' => $wali->teacher->id,
        'student_id' => $student->id,
        'school_class_id' => $class->id,
        'category' => 'Akademik',
        'date' => '2026-11-20',
        'issue' => 'Kesulitan memahami materi trigonometri',
        'action_plan' => 'Bimbingan tambahan setiap hari Selasa',
        'parent_contacted' => true,
        'status' => 'Dalam Pemantauan',
    ]);

    // Update
    $updateResponse = $this->actingAs($wali)->put(route('wali.bimbingan.update', $log), [
        'category' => 'Akademik',
        'date' => '2026-11-20',
        'issue' => 'Kesulitan memahami materi trigonometri (Terselesaikan)',
        'action_plan' => 'Telah mengikuti sesi bimbingan',
        'parent_contacted' => true,
        'status' => 'Tuntas',
    ]);
    $updateResponse->assertRedirect();
    expect($log->fresh()->status)->toBe('Tuntas');

    // Delete
    $deleteResponse = $this->actingAs($wali)->delete(route('wali.bimbingan.destroy', $log));
    $deleteResponse->assertRedirect();
    expect(Bimbingan::find($log->id))->toBeNull();
});

test('siswa portal routes render successfully', function () {
    $siswa = User::where('role', 'siswa')->first();

    $this->actingAs($siswa)->get(route('siswa.dashboard'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.schedule'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.rapor'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.profil'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.presensi'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.pengumuman'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.nilai'))->assertOk();
    $this->actingAs($siswa)->get(route('siswa.materi'))->assertOk();
});

test('orang tua portal routes render successfully', function () {
    $ortu = User::where('role', 'orang-tua')->first();

    $this->actingAs($ortu)->get(route('orangtua.dashboard'))->assertOk();
    $this->actingAs($ortu)->get(route('orangtua.nilai'))->assertOk();
    $this->actingAs($ortu)->get(route('orangtua.keuangan'))->assertOk();
    $this->actingAs($ortu)->get(route('orangtua.presensi'))->assertOk();
    $this->actingAs($ortu)->get(route('orangtua.pengumuman'))->assertOk();
});

test('announcement global update and delete', function () {
    $admin = User::where('role', 'admin')->first();

    $announcement = \App\Models\Announcement::create([
        'author_id' => $admin->id,
        'title' => 'Pengumuman Awal',
        'content' => 'Konten awal',
        'category' => 'Akademik',
        'target_role' => 'all',
        'is_pinned' => false,
        'is_active' => true,
        'published_at' => now(),
    ]);

    // Update
    $updateResponse = $this->actingAs($admin)->put(route('pengumuman.update', $announcement), [
        'title' => 'Pengumuman Direvisi',
        'content' => 'Konten direvisi',
        'category' => 'Akademik',
        'target_role' => 'all',
        'is_pinned' => true,
        'is_active' => true,
    ]);
    $updateResponse->assertRedirect();
    expect($announcement->fresh()->title)->toBe('Pengumuman Direvisi');
    expect($announcement->fresh()->is_pinned)->toBeTrue();

    // Delete
    $deleteResponse = $this->actingAs($admin)->delete(route('pengumuman.destroy', $announcement));
    $deleteResponse->assertRedirect();
    expect(\App\Models\Announcement::find($announcement->id))->toBeNull();
});
