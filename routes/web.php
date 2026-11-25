<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExtraFeatureController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\ReportCardController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DashboardPortalController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AcademicDataController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\AdminImportController;

Route::inertia('/', 'welcome')->name('home');
Route::get('/login', fn () => \Inertia\Inertia::render('auth/LoginPage'))->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login.store');

Route::get('/forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
Route::post('/forgot-password/send-otp', [PasswordResetController::class, 'sendOtp'])->name('password.otp.send');
Route::post('/forgot-password/verify-otp', [PasswordResetController::class, 'verifyOtp'])->name('password.otp.verify');
Route::post('/forgot-password/reset', [PasswordResetController::class, 'resetPassword'])->name('password.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        return match ($request->user()->role) {
            'admin' => redirect('/admin'),
            'guru' => redirect('/guru'),
            'wali-kelas' => redirect('/wali-kelas'),
            'siswa' => redirect('/siswa'),
            'orang-tua' => redirect('/orangtua'),
            default => redirect('/'),
        };
    })->name('dashboard');

    // Admin
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

        // Manajemen Pengguna
        Route::get('/admin/pengguna', [UserController::class, 'index'])->name('admin.pengguna');
        Route::post('/admin/pengguna', [UserController::class, 'store'])->name('admin.pengguna.store');
        Route::put('/admin/pengguna/{user}', [UserController::class, 'update'])->name('admin.pengguna.update');
        Route::patch('/admin/pengguna/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('admin.pengguna.toggle-status');
        Route::put('/admin/pengguna/{user}/reset-password', [UserController::class, 'resetPassword'])->name('admin.pengguna.reset-password');
        Route::delete('/admin/pengguna/{user}', [UserController::class, 'destroy'])->name('admin.pengguna.destroy');

        // Data Akademik
        Route::get('/admin/data-akademik', [AcademicDataController::class, 'index'])->name('admin.data-akademik');
        Route::post('/admin/data-akademik/siswa', [AcademicDataController::class, 'storeStudent'])->name('admin.data-akademik.siswa.store');
        Route::post('/admin/data-akademik/guru/{teacher}/wali-kelas', [AcademicDataController::class, 'assignHomeroom'])->name('admin.data-akademik.wali-kelas');
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

        Route::post('/admin/import', [AdminImportController::class, 'store'])->name('admin.import.store');
        Route::get('/admin/import', fn () => \Inertia\Inertia::render('admin/ImportDataPage'))->name('admin.import');

        Route::get('/admin/pengaturan', [AdminSettingsController::class, 'edit'])->name('admin.pengaturan');
        Route::put('/admin/pengaturan', [AdminSettingsController::class, 'update'])->name('admin.pengaturan.update');
    });

    // Guru
    Route::middleware(['role:guru'])->group(function () {
        Route::inertia('/guru', 'guru/DashboardPage')->name('guru.dashboard');
        Route::inertia('/guru/mata-pelajaran', 'guru/MataPelajaranPage')->name('guru.mata-pelajaran');
        
        // Jadwal Mengajar Guru
        Route::get('/guru/jadwal', [ScheduleController::class, 'teacherSchedule'])->name('guru.jadwal');
        Route::post('/guru/jadwal', [ScheduleController::class, 'store'])->name('guru.jadwal.store');
        Route::put('/guru/jadwal/{schedule}', [ScheduleController::class, 'update'])->name('guru.jadwal.update');
        Route::delete('/guru/jadwal/{schedule}', [ScheduleController::class, 'destroy'])->name('guru.jadwal.destroy');

        // Nilai Guru
        Route::get('/guru/nilai', [GradeController::class, 'teacherGradebook'])->name('guru.nilai');
        Route::post('/guru/nilai', [GradeController::class, 'saveGrade'])->name('guru.nilai.store');

        // Presensi Guru
        Route::get('/guru/presensi', [AttendanceController::class, 'teacherAttendance'])->name('guru.presensi');
        Route::post('/guru/presensi', [AttendanceController::class, 'saveTeacherAttendance'])->name('guru.presensi.store');

        // Pertemuan / Modul Guru
        Route::get('/guru/pertemuan', [MeetingController::class, 'index'])->name('guru.pertemuan');
        Route::post('/guru/pertemuan', [MeetingController::class, 'store'])->name('guru.pertemuan.store');
        Route::put('/guru/pertemuan/{meeting}', [MeetingController::class, 'update'])->name('guru.pertemuan.update');
        Route::delete('/guru/pertemuan/{meeting}', [MeetingController::class, 'destroy'])->name('guru.pertemuan.destroy');

        // Materi Pembelajaran Guru
        Route::get('/guru/materi', [MaterialController::class, 'index'])->name('guru.materi');
        Route::post('/guru/materi', [MaterialController::class, 'store'])->name('guru.materi.store');
        Route::put('/guru/materi/{material}', [MaterialController::class, 'update'])->name('guru.materi.update');
        Route::delete('/guru/materi/{material}', [MaterialController::class, 'destroy'])->name('guru.materi.destroy');

        // Kuis Online Guru
        Route::get('/guru/kuis', [QuizController::class, 'index'])->name('guru.kuis');
        Route::post('/guru/kuis', [QuizController::class, 'store'])->name('guru.kuis.store');
        Route::put('/guru/kuis/{quiz}', [QuizController::class, 'update'])->name('guru.kuis.update');
        Route::delete('/guru/kuis/{quiz}', [QuizController::class, 'destroy'])->name('guru.kuis.destroy');
        Route::post('/guru/kuis/grade/{submission}', [QuizController::class, 'gradeEssay'])->name('guru.kuis.grade');
        Route::inertia('/guru/pengumuman', 'guru/PengumumanPage')->name('guru.pengumuman');
    });

    // Wali Kelas
    Route::middleware(['role:wali-kelas'])->group(function () {
        Route::inertia('/wali-kelas', 'wali-kelas/DashboardWaliPage')->name('wali.dashboard');
        
        // Bimbingan Konseling Wali Kelas
        Route::get('/wali-kelas/bimbingan', [BimbinganController::class, 'index'])->name('wali.bimbingan');
        Route::post('/wali-kelas/bimbingan', [BimbinganController::class, 'store'])->name('wali.bimbingan.store');
        Route::put('/wali-kelas/bimbingan/{bimbingan}', [BimbinganController::class, 'update'])->name('wali.bimbingan.update');
        Route::delete('/wali-kelas/bimbingan/{bimbingan}', [BimbinganController::class, 'destroy'])->name('wali.bimbingan.destroy');

        Route::inertia('/wali-kelas/dossier', 'wali-kelas/DossierSiswaPage')->name('wali.dossier');
        Route::inertia('/wali-kelas/presensi', 'wali-kelas/PresensiKelasPage')->name('wali.presensi');
        
        // Rekap Nilai & Rapor Wali Kelas
        Route::get('/wali-kelas/rekap-nilai', [ReportCardController::class, 'rekapNilai'])->name('wali.rekap-nilai');
        Route::post('/wali-kelas/rapor/publish', [ReportCardController::class, 'publish'])->name('wali.rapor.publish');

        Route::get('/wali-kelas/pengumuman', [AnnouncementController::class, 'waliKelasIndex'])->name('wali.pengumuman');
    });

    // Siswa
    Route::middleware(['role:siswa'])->group(function () {
        Route::get('/siswa', [DashboardPortalController::class, 'studentDashboard'])->name('siswa.dashboard');
        Route::get('/siswa/library', [ExtraFeatureController::class, 'library'])->name('siswa.library');
        Route::get('/siswa/schedule', [ScheduleController::class, 'studentSchedule'])->name('siswa.schedule');
        Route::get('/siswa/rapor', [ReportCardController::class, 'studentReport'])->name('siswa.rapor');
        Route::get('/siswa/profil', [DashboardPortalController::class, 'studentDashboard'])->name('siswa.profil');
        Route::get('/siswa/presensi', [AttendanceController::class, 'studentAttendance'])->name('siswa.presensi');
        Route::get('/siswa/pengumuman', [AnnouncementController::class, 'siswaIndex'])->name('siswa.pengumuman');
        Route::get('/siswa/nilai', [GradeController::class, 'studentGrades'])->name('siswa.nilai');
        Route::get('/siswa/materi', [MaterialController::class, 'studentIndex'])->name('siswa.materi');

        // Kuis Online Siswa
        Route::get('/siswa/kuis', [QuizController::class, 'studentIndex'])->name('siswa.kuis');
        Route::post('/siswa/kuis/{quiz}/submit', [QuizController::class, 'submit'])->name('siswa.kuis.submit');
    });

    // Orang Tua
    Route::middleware(['role:orang-tua'])->group(function () {
        Route::get('/orang-tua', [DashboardPortalController::class, 'parentDashboard'])->name('orangtua.dashboard');
        Route::get('/orang-tua/nilai', [GradeController::class, 'childGrades'])->name('orangtua.nilai');
        Route::inertia('/orang-tua/presensi', 'orangtua/PresensiAnakPage')->name('orangtua.presensi');
        Route::get('/orang-tua/keuangan', [PaymentController::class, 'index'])->name('orangtua.keuangan');
        Route::get('/orang-tua/pengumuman', [AnnouncementController::class, 'orangTuaIndex'])->name('orangtua.pengumuman');
    });

    // Pengumuman CRUD (Admin & Wali Kelas & Guru)
    Route::post('/pengumuman', [AnnouncementController::class, 'store'])->name('pengumuman.store');
    Route::put('/pengumuman/{announcement}', [AnnouncementController::class, 'update'])->name('pengumuman.update');
    Route::delete('/pengumuman/{announcement}', [AnnouncementController::class, 'destroy'])->name('pengumuman.destroy');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

require __DIR__ . '/settings.php';
