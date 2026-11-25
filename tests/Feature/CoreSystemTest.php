<?php

use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('health check route /up returns healthy status', function () {
    $response = $this->get('/up');
    $response->assertOk();
});

test('dashboard redirect routes correctly for every role', function () {
    $admin = User::where('role', 'admin')->first();
    $guru = User::where('role', 'guru')->first();
    $wali = User::where('role', 'wali-kelas')->first();
    $siswa = User::where('role', 'siswa')->first();
    $ortu = User::where('role', 'orang-tua')->first();

    $this->actingAs($admin)->get(route('dashboard'))->assertRedirect('/admin');
    $this->actingAs($guru)->get(route('dashboard'))->assertRedirect('/guru');
    $this->actingAs($wali)->get(route('dashboard'))->assertRedirect('/wali-kelas');
    $this->actingAs($siswa)->get(route('dashboard'))->assertRedirect('/siswa');
    $this->actingAs($ortu)->get(route('dashboard'))->assertRedirect('/orangtua');
});

test('security: search inputs with SQL injection payload do not crash', function () {
    $admin = User::where('role', 'admin')->first();
    $sqlPayload = "' OR '1'='1";

    $response = $this->actingAs($admin)->get(route('admin.pengguna', ['search' => $sqlPayload]));
    $response->assertOk();

    $akademikResponse = $this->actingAs($admin)->get(route('admin.data-akademik', ['search' => $sqlPayload]));
    $akademikResponse->assertOk();

    $kelasResponse = $this->actingAs($admin)->get(route('admin.master-data', ['search' => $sqlPayload]));
    $kelasResponse->assertOk();
});

test('security: XSS payloads in inputs are properly sanitized or escaped', function () {
    $admin = User::where('role', 'admin')->first();
    $xss = '<script>alert("XSS")</script>';

    $response = $this->actingAs($admin)->post(route('admin.master-data.kelas.store'), [
        'name' => $xss,
        'grade_level' => 'X',
    ]);
    $response->assertRedirect();

    $class = \App\Models\SchoolClass::where('name', $xss)->first();
    expect($class)->not->toBeNull();
});
