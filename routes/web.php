<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::inertia('/', 'welcome')->name('home');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::inertia('/admin', 'admin/DashboardAdminPage')->name('admin.dashboard');
        Route::inertia('/admin/pengguna', 'admin/ManajemenPenggunaPage')->name('admin.pengguna');
        Route::inertia('/admin/data-akademik', 'admin/DataAkademikPage')->name('admin.data-akademik');
        Route::inertia('/admin/master-data', 'admin/MasterDataPage')->name('admin.master-data');
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
        Route::inertia('/orangtua', 'orangtua/DashboardOrangTuaPage')->name('orangtua.dashboard');
        Route::inertia('/orangtua/nilai', 'orangtua/NilaiAnakPage')->name('orangtua.nilai');
        Route::inertia('/orangtua/presensi', 'orangtua/PresensiAnakPage')->name('orangtua.presensi');
        Route::inertia('/orangtua/pengumuman', 'orangtua/PengumumanOrangTuaPage')->name('orangtua.pengumuman');
    });
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

require __DIR__ . '/settings.php';
