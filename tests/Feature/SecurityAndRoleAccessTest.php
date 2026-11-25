<?php

use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('unauthenticated users are redirected from protected routes', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    $this->get(route('admin.pengguna'))->assertRedirect(route('login'));
    $this->get(route('guru.dashboard'))->assertRedirect(route('login'));
    $this->get(route('wali.dashboard'))->assertRedirect(route('login'));
    $this->get(route('siswa.dashboard'))->assertRedirect(route('login'));
    $this->get(route('orangtua.dashboard'))->assertRedirect(route('login'));
});

test('role middleware prevents cross-role privilege escalation', function () {
    $siswa = User::where('role', 'siswa')->first();
    $guru = User::where('role', 'guru')->first();
    $ortu = User::where('role', 'orang-tua')->first();

    // Siswa cannot access admin routes
    $this->actingAs($siswa)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($siswa)->get(route('admin.pengguna'))->assertForbidden();
    $this->actingAs($siswa)->post(route('admin.pengguna.store'), [])->assertForbidden();

    // Siswa cannot access guru routes
    $this->actingAs($siswa)->get(route('guru.dashboard'))->assertForbidden();
    $this->actingAs($siswa)->get(route('guru.nilai'))->assertForbidden();
    $this->actingAs($siswa)->post(route('guru.nilai.store'), [])->assertForbidden();

    // Guru cannot access admin routes
    $this->actingAs($guru)->get(route('admin.pengguna'))->assertForbidden();
    $this->actingAs($guru)->get(route('admin.keuangan'))->assertForbidden();

    // Ortu cannot access guru or admin routes
    $this->actingAs($ortu)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($ortu)->get(route('guru.dashboard'))->assertForbidden();
});

test('keuangan index privacy test for orang tua', function () {
    $ortu = User::where('role', 'orang-tua')->first();
    $myChild = Student::where('parent_user_id', $ortu->id)->first();

    // Create another parent & another student
    $otherParent = User::factory()->create(['role' => 'orang-tua']);
    $otherStudentUser = User::factory()->create(['role' => 'siswa']);
    $otherStudent = Student::create([
        'user_id' => $otherStudentUser->id,
        'parent_user_id' => $otherParent->id,
        'nisn' => '9999999999',
        'nis' => '99999',
        'gender' => 'L',
        'birth_place' => 'Bandung',
        'birth_date' => '2007-01-01',
        'phone' => '08999999999',
        'address' => 'Bandung',
    ]);

    // Payment for other student
    $otherPayment = Payment::create([
        'student_id' => $otherStudent->id,
        'title' => 'SPP Rahasia Siswa Lain',
        'amount' => 750000,
        'status' => 'pending',
        'due_date' => '2026-12-15',
    ]);

    // Ortu visits /orang-tua/keuangan
    $response = $this->actingAs($ortu)->get(route('orangtua.keuangan'));
    $response->assertOk();

    // In PaymentController@index:
    // $payments = Payment::with('student.user')->latest()->paginate(10);
    // It returns ALL payments to orangtua without scoping to their child!
    $pagePayments = $response->viewData('page')['props']['payments']['data'] ?? [];
    $hasOtherStudentPayment = collect($pagePayments)->contains(fn($p) => $p['id'] === $otherPayment->id);

    // Asserting that it does NOT leak other student payments
    // (This assertion will reveal if data leakage bug exists!)
    expect($hasOtherStudentPayment)->toBeFalse();
});
