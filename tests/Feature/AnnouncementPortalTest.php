<?php

use App\Models\Announcement;
use App\Models\Payment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('admin can publish global announcement and wali kelas can publish class announcement', function () {
    $admin = User::where('role', 'admin')->first();
    $wali = User::where('email', 'walikelas@siakad.test')->first();
    $class12 = SchoolClass::where('name', 'XII MIPA 1')->first();

    // 1. Admin creates announcement
    $resAdmin = $this->actingAs($admin)->post(route('pengumuman.store'), [
        'title' => 'Pengumuman Libur Hari Guru Nasional',
        'content' => 'Kegiatan belajar mengajar ditiadakan dalam rangka memperingati Hari Guru.',
        'category' => 'Kegiatan Siswa',
        'target_role' => 'all',
        'is_pinned' => true,
    ]);
    $resAdmin->assertRedirect();
    expect(Announcement::where('title', 'Pengumuman Libur Hari Guru Nasional')->exists())->toBeTrue();

    // 2. Wali kelas creates announcement for their class
    $resWali = $this->actingAs($wali)->post(route('pengumuman.store'), [
        'title' => 'Persiapan Bersih-Bersih Kelas XII MIPA 1',
        'content' => 'Dimohon membawa perlengkapan kebersihan masing-masing.',
        'category' => 'Kegiatan Siswa',
        'target_role' => 'siswa',
        'school_class_id' => $class12->id,
        'is_pinned' => false,
    ]);
    $resWali->assertRedirect();
    expect(Announcement::where('title', 'Persiapan Bersih-Bersih Kelas XII MIPA 1')->exists())->toBeTrue();
});

test('siswa receives synced dashboard and announcements from database', function () {
    $siswa = User::where('email', 'siswa@siakad.test')->first();

    // 1. Siswa accesses dashboard
    $resDashboard = $this->actingAs($siswa)->get(route('siswa.dashboard'));
    $resDashboard->assertOk();
    $resDashboard->assertInertia(fn ($page) => $page
        ->component('siswa/StudentDashboardPage')
        ->has('dbStudent')
        ->has('dbAttendance')
        ->has('dbSchedules')
        ->has('dbPayments')
        ->has('dbAnnouncements')
    );

    // 2. Siswa accesses announcement page
    $resAnnounce = $this->actingAs($siswa)->get(route('siswa.pengumuman'));
    $resAnnounce->assertOk();
    $resAnnounce->assertInertia(fn ($page) => $page
        ->component('siswa/PengumumanPage')
        ->has('dbAnnouncements')
    );
});

test('orang tua receives synced dashboard, child payments, and announcements', function () {
    $ortu = User::where('email', 'orangtua@siakad.test')->first();

    // 1. Orang tua accesses dashboard
    $resDashboard = $this->actingAs($ortu)->get(route('orangtua.dashboard'));
    $resDashboard->assertOk();
    $resDashboard->assertInertia(fn ($page) => $page
        ->component('orangtua/DashboardOrangTuaPage')
        ->has('studentInfo')
        ->has('payments')
    );

    // 2. Orang tua accesses child finance / SPP page
    $resFinance = $this->actingAs($ortu)->get(route('orangtua.keuangan'));
    $resFinance->assertOk();
    $resFinance->assertInertia(fn ($page) => $page
        ->component('orangtua/KeuanganAnakPage')
        ->has('payments')
    );

    // 3. Orang tua accesses announcements
    $resAnnounce = $this->actingAs($ortu)->get(route('orangtua.pengumuman'));
    $resAnnounce->assertOk();
    $resAnnounce->assertInertia(fn ($page) => $page
        ->component('orangtua/PengumumanOrangTuaPage')
        ->has('dbAnnouncements')
    );
});
