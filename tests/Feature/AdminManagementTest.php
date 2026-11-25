<?php

use App\Models\AcademicYear;
use App\Models\Payment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Database\Seeders\AcademicMasterSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(UserSeeder::class);
    $this->seed(AcademicMasterSeeder::class);
});

test('admin can view user management page with filters', function () {
    $admin = User::where('role', 'admin')->first();

    $response = $this->actingAs($admin)->get(route('admin.pengguna', ['search' => 'Guru', 'role' => 'guru']));
    $response->assertOk();
});

test('admin can create user with validation', function () {
    $admin = User::where('role', 'admin')->first();

    // Happy path
    $response = $this->actingAs($admin)->post(route('admin.pengguna.store'), [
        'name' => 'Guru Baru',
        'email' => 'gurubaru@siakad.test',
        'password' => 'password123',
        'role' => 'guru',
    ]);
    $response->assertRedirect();
    expect(User::where('email', 'gurubaru@siakad.test')->exists())->toBeTrue();

    // Negative case: duplicate email
    $duplicateResponse = $this->actingAs($admin)->post(route('admin.pengguna.store'), [
        'name' => 'Guru Duplikat',
        'email' => 'gurubaru@siakad.test',
        'password' => 'password123',
        'role' => 'guru',
    ]);
    $duplicateResponse->assertSessionHasErrors(['email']);

    // Negative case: short password and invalid role
    $invalidResponse = $this->actingAs($admin)->post(route('admin.pengguna.store'), [
        'name' => 'Invalid',
        'email' => 'invalid@siakad.test',
        'password' => '123',
        'role' => 'superadmin',
    ]);
    $invalidResponse->assertSessionHasErrors(['password', 'role']);
});

test('admin can update user and reset password', function () {
    $admin = User::where('role', 'admin')->first();
    $targetUser = User::where('email', 'siswa@siakad.test')->first();

    // Update user
    $response = $this->actingAs($admin)->put(route('admin.pengguna.update', $targetUser), [
        'name' => 'Siswa Diupdate',
        'email' => 'siswadiupdate@siakad.test',
        'role' => 'siswa',
    ]);
    $response->assertRedirect();
    expect($targetUser->fresh()->name)->toBe('Siswa Diupdate');

    // Reset password happy path
    $resetResponse = $this->actingAs($admin)->put(route('admin.pengguna.reset-password', $targetUser), [
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);
    $resetResponse->assertRedirect();
    expect(Hash::check('newpassword123', $targetUser->fresh()->password))->toBeTrue();

    // Reset password negative case: mismatch confirmation
    $mismatchResponse = $this->actingAs($admin)->put(route('admin.pengguna.reset-password', $targetUser), [
        'password' => 'newpassword123',
        'password_confirmation' => 'different123',
    ]);
    $mismatchResponse->assertSessionHasErrors(['password']);
});

test('admin can delete user', function () {
    $admin = User::where('role', 'admin')->first();
    $userToDelete = User::factory()->create(['role' => 'siswa']);

    $response = $this->actingAs($admin)->delete(route('admin.pengguna.destroy', $userToDelete));
    $response->assertRedirect();
    expect(User::find($userToDelete->id))->toBeNull();
});

test('admin can manage keuangan and payments', function () {
    $admin = User::where('role', 'admin')->first();
    $student = Student::first();

    // View index
    $indexResponse = $this->actingAs($admin)->get(route('admin.keuangan'));
    $indexResponse->assertOk();

    // Create payment
    $storeResponse = $this->actingAs($admin)->post(route('admin.keuangan.store'), [
        'student_id' => $student->id,
        'title' => 'SPP Bulan Desember 2026',
        'amount' => 500000,
        'status' => 'pending',
        'due_date' => '2026-12-10',
    ]);
    $storeResponse->assertRedirect();
    $payment = Payment::where('title', 'SPP Bulan Desember 2026')->first();
    expect($payment)->not->toBeNull();
    expect($payment->status)->toBe('pending');
    expect($payment->paid_date)->toBeNull();

    // Update payment to lunas -> paid_date auto populated
    $updateResponse = $this->actingAs($admin)->put(route('admin.keuangan.update', $payment), [
        'title' => 'SPP Bulan Desember 2026 (Updated)',
        'amount' => 500000,
        'status' => 'lunas',
        'due_date' => '2026-12-10',
    ]);
    $updateResponse->assertRedirect();
    expect($payment->fresh()->status)->toBe('lunas');
    expect($payment->fresh()->paid_date)->not->toBeNull();

    // Delete payment
    $deleteResponse = $this->actingAs($admin)->delete(route('admin.keuangan.destroy', $payment));
    $deleteResponse->assertRedirect();
    expect(Payment::find($payment->id))->toBeNull();
});

test('admin can update and delete school class and subject', function () {
    $admin = User::where('role', 'admin')->first();
    $class = SchoolClass::first();
    $subject = Subject::first();

    // Update class
    $updateClassResponse = $this->actingAs($admin)->put(route('admin.master-data.kelas.update', $class), [
        'name' => 'XII MIPA 1 Updated',
        'grade_level' => 'XII',
    ]);
    $updateClassResponse->assertRedirect();
    expect($class->fresh()->name)->toBe('XII MIPA 1 Updated');

    // Update subject
    $updateSubjResponse = $this->actingAs($admin)->put(route('admin.master-data.mapel.update', $subject), [
        'code' => 'MAT-P-MOD',
        'name' => 'Matematika Peminatan Modern',
    ]);
    $updateSubjResponse->assertRedirect();
    expect($subject->fresh()->code)->toBe('MAT-P-MOD');

    // Delete class and subject
    $this->actingAs($admin)->delete(route('admin.master-data.kelas.destroy', $class))->assertRedirect();
    $this->actingAs($admin)->delete(route('admin.master-data.mapel.destroy', $subject))->assertRedirect();
    expect(SchoolClass::find($class->id))->toBeNull();
    expect(Subject::find($subject->id))->toBeNull();
});

test('admin can update and delete academic year', function () {
    $admin = User::where('role', 'admin')->first();
    $academicYear = AcademicYear::where('is_active', false)->first();

    $response = $this->actingAs($admin)->put(route('admin.data-akademik.update', $academicYear), [
        'name' => '2025/2026',
        'semester' => 'Genap',
        'is_active' => true,
    ]);
    $response->assertRedirect();
    expect($academicYear->fresh()->is_active)->toBeTrue();

    $delResponse = $this->actingAs($admin)->delete(route('admin.data-akademik.destroy', $academicYear));
    $delResponse->assertRedirect();
    expect(AcademicYear::find($academicYear->id))->toBeNull();
});
