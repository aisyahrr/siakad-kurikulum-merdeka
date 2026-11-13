<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExtraFeatureController;

Route::inertia('/', 'welcome')->name('home');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::inertia('/admin', 'admin/DashboardAdminPage')->name('admin.dashboard');
        
        // Manajemen Pengguna
        Route::get('/admin/pengguna', [UserController::class, 'index'])->name('admin.pengguna');
        Route::post('/admin/pengguna', [UserController::class, 'store'])->name('admin.pengguna.store');
        Route::put('/admin/pengguna/{user}', [UserController::class, 'update'])->name('admin.pengguna.update');
        Route::put('/admin/pengguna/{user}/reset-password', [UserController::class, 'resetPassword'])->name('admin.pengguna.reset-password');
        Route::delete('/admin/pengguna/{user}', [UserController::class, 'destroy'])->name('admin.pengguna.destroy');

        // Data Akademik
        Route::get('/admin/data-akademik', [AcademicYearController::class, 'index'])->name('admin.data-akademik');
        Route::post('/admin/data-akademik', [AcademicYearController::class, 'store'])->name('admin.data-akademik.store');
        Route::put('/admin/data-akademik/{academicYear}', [AcademicYearController::class, 'update'])->name('admin.data-akademik.update');
        Route::delete('/admin/data-akademik/{academicYear}', [AcademicYearController::class, 'destroy'])->name('admin.data-akademik.destroy');

        // Master Data (Kelas & Mapel)
        Route::get('/admin/master-data', [SchoolClassController::class, 'index'])->name('admin.master-data');
        Route::post('/admin/master-data/kelas', [SchoolClassController::class, 'store'])->name('admin.master-data.kelas.store');
        Route::put('/admin/master-data/kelas/{schoolClass}', [SchoolClassController::class, 'update'])->name('admin.master-data.kelas.update');
        Route::delete('/admin/master-data/kelas/{schoolClass}', [SchoolClassController::class, 'destroy'])->name('admin.master-data.kelas.destroy');

        Route::post('/admin/master-data/mapel', [SubjectController::class, 'store'])->name('admin.master-data.mapel.store');
        Route::put('/admin/master-data/mapel/{subject}', [SubjectController::class, 'update'])->name('admin.master-data.mapel.update');
        Route::delete('/admin/master-data/mapel/{subject}', [SubjectController::class, 'destroy'])->name('admin.master-data.mapel.destroy');

        // Manajemen Keuangan / SPP Admin
        Route::get('/admin/keuangan', [PaymentController::class, 'index'])->name('admin.keuangan');
        Route::post('/admin/keuangan', [PaymentController::class, 'store'])->name('admin.keuangan.store');
        Route::put('/admin/keuangan/{payment}', [PaymentController::class, 'update'])->name('admin.keuangan.update');
        Route::delete('/admin/keuangan/{payment}', [PaymentController::class, 'destroy'])->name('admin.keuangan.destroy');

        // Presensi Guru
        Route::get('/admin/presensi-guru', [ExtraFeatureController::class, 'teacherAttendance'])->name('admin.presensi-guru');

        Route::inertia('/admin/import', 'admin/ImportDataPage')->name('admin.import');
        Route::inertia('/admin/pengaturan', 'admin/PengaturanAdminPage')->name('admin.pengaturan');
    });

    // Guru
    Route::middleware(['role:guru'])->group(function () {
        Route::inertia('/guru', 'guru/DashboardPage')->name('guru.dashboard');
        Route::inertia('/guru/mata-pelajaran', 'guru/MataPelajaranPage')->name('guru.mata-pelajaran');
        Route::inertia('/guru/jadwal', 'guru/JadwalGuruPage')->name('guru.jadwal');
        Route::inertia('/guru/nilai', 'guru/NilaiGuruPage')->name('guru.nilai');
        Route::inertia('/guru/presensi', 'guru/PresensiGuruPage')->name('guru.presensi');
        Route::inertia('/guru/pertemuan', 'guru/PertemuanPage')->name('guru.pertemuan');
        Route::inertia('/guru/kuis', 'guru/KuisPage')->name('guru.kuis');
        Route::inertia('/guru/pengumuman', 'guru/PengumumanPage')->name('guru.pengumuman');
    });

    // Wali Kelas
    Route::middleware(['role:wali-kelas'])->group(function () {
        Route::inertia('/wali-kelas', 'wali-kelas/DashboardWaliPage')->name('wali.dashboard');
        Route::inertia('/wali-kelas/bimbingan', 'wali-kelas/BimbinganPage')->name('wali.bimbingan');
        Route::inertia('/wali-kelas/dossier', 'wali-kelas/DossierSiswaPage')->name('wali.dossier');
        Route::inertia('/wali-kelas/presensi', 'wali-kelas/PresensiKelasPage')->name('wali.presensi');
        Route::inertia('/wali-kelas/rekap-nilai', 'wali-kelas/RekapNilaiPage')->name('wali.rekap-nilai');
        Route::inertia('/wali-kelas/pengumuman', 'wali-kelas/PengumumanWaliPage')->name('wali.pengumuman');
    });

    // Siswa
    Route::middleware(['role:siswa'])->group(function () {
        Route::inertia('/siswa', 'siswa/StudentDashboardPage')->name('siswa.dashboard');
        Route::get('/siswa/library', [ExtraFeatureController::class, 'library'])->name('siswa.library');
        Route::inertia('/siswa/schedule', 'siswa/SchedulePage')->name('siswa.schedule');
        Route::inertia('/siswa/rapor', 'siswa/RaporPage')->name('siswa.rapor');
        Route::inertia('/siswa/profil', 'siswa/ProfilPage')->name('siswa.profil');
        Route::inertia('/siswa/presensi', 'siswa/PresensiPage')->name('siswa.presensi');
        Route::inertia('/siswa/pengumuman', 'siswa/AnnouncementsPage')->name('siswa.pengumuman');
        Route::inertia('/siswa/nilai', 'siswa/NilaiPage')->name('siswa.nilai');
        Route::inertia('/siswa/materi', 'siswa/MateriPage')->name('siswa.materi');
    });

    // Orang Tua
    Route::middleware(['role:orang-tua'])->group(function () {
        Route::inertia('/orang-tua', 'orangtua/DashboardOrangTuaPage')->name('orangtua.dashboard');
        Route::inertia('/orang-tua/nilai', 'orangtua/NilaiAnakPage')->name('orangtua.nilai');
        Route::inertia('/orang-tua/presensi', 'orangtua/PresensiAnakPage')->name('orangtua.presensi');
        Route::get('/orang-tua/keuangan', [PaymentController::class, 'index'])->name('orangtua.keuangan');
        Route::inertia('/orang-tua/pengumuman', 'orangtua/PengumumanOrangTuaPage')->name('orangtua.pengumuman');
    });
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

require __DIR__ . '/settings.php';
