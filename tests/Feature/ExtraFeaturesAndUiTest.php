<?php

use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('admin static UI pages can be rendered', function () {
    $admin = User::where('role', 'admin')->first();

    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
    $this->actingAs($admin)->get(route('admin.import'))->assertOk();
    $this->actingAs($admin)->get(route('admin.pengaturan'))->assertOk();
});

test('admin presensi guru endpoint execution', function () {
    $admin = User::where('role', 'admin')->first();

    // Route calls ExtraFeatureController@teacherAttendance which uses App\Models\TeacherAttendance
    $response = $this->actingAs($admin)->get(route('admin.presensi-guru'));
    
    // Status is checked to verify whether model exists
    $response->assertOk();
});

test('siswa library endpoint execution', function () {
    $siswa = User::where('role', 'siswa')->first();

    // Route calls ExtraFeatureController@library which uses App\Models\DigitalLibrary
    $response = $this->actingAs($siswa)->get(route('siswa.library'));

    $response->assertOk();
});
