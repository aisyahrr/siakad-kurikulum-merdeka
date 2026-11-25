<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Payment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $recentUsers = User::whereNotNull('last_login_at')
            ->orderByDesc('last_login_at')
            ->take(5)
            ->get();

        $activities = $recentUsers->map(fn (User $user) => [
            'id' => 'user-'.$user->id,
            'user' => $user->name,
            'role' => match ($user->role) {
                'admin' => 'Administrator',
                'wali-kelas' => 'Wali Kelas',
                'guru' => 'Guru',
                'siswa' => 'Siswa',
                'orang-tua' => 'Orang Tua',
                default => $user->role,
            },
            'action' => 'Login terakhir ke sistem.',
            'timestamp' => optional($user->last_login_at)->diffForHumans() ?? '-',
            'ip' => null,
        ])->values();

        if ($activities->isEmpty()) {
            $activities = Announcement::with('author')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn (Announcement $announcement) => [
                    'id' => 'announcement-'.$announcement->id,
                    'user' => $announcement->author?->name ?? 'Sistem',
                    'role' => 'Pengumuman',
                    'action' => $announcement->title,
                    'timestamp' => optional($announcement->created_at)->diffForHumans() ?? '-',
                    'ip' => null,
                ])->values();
        }

        $pendingPayments = Payment::where('status', 'pending');

        return Inertia::render('admin/DashboardAdminPage', [
            'metrics' => [
                'totalStudents' => Student::count(),
                'totalTeachers' => Teacher::count(),
                'totalClasses' => SchoolClass::count(),
                'totalUsers' => User::count(),
                'pendingPayments' => (clone $pendingPayments)->count(),
                'unpaidAmount' => (float) (clone $pendingPayments)->sum('amount'),
            ],
            'activeYear' => $activeYear ? [
                'name' => $activeYear->name,
                'semester' => $activeYear->semester,
            ] : null,
            'activities' => $activities,
        ]);
    }
}
