<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\Grade;
use App\Models\Payment;
use App\Models\ReportCard;
use App\Models\Schedule;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardPortalController extends Controller
{
    private function getIndonesianDayName(?Carbon $date = null): string
    {
        $date = $date ?? Carbon::now();
        $days = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        return $days[$date->dayOfWeek] ?? 'Senin';
    }

    public function studentDashboard(Request $request)
    {
        $user = $request->user();
        $student = $user->student ?? Student::first();
        $activeYear = AcademicYear::where('is_active', true)->first();
        $currentClass = $student?->currentClass();

        // 1. Presensi
        $attendances = Attendance::where('student_id', $student?->id)->get();
        $present = $attendances->where('status', 'Hadir')->count();
        $sick = $attendances->where('status', 'Sakit')->count();
        $permission = $attendances->where('status', 'Izin')->count();
        $absent = $attendances->where('status', 'Alpa')->count();
        $totalAtt = $attendances->count();
        $attendanceRate = $totalAtt > 0 ? round(($present / $totalAtt) * 100, 1) : 100.0;

        // 2. Jadwal Hari Ini
        $today = $this->getIndonesianDayName();
        $todaySchedules = [];
        if ($currentClass) {
            $todaySchedules = Schedule::with(['subject', 'teacher.user'])
                ->where('school_class_id', $currentClass->id)
                ->where('day', $today)
                ->orderBy('start_time')
                ->get()
                ->map(function ($sch, $index) {
                    return [
                        'id' => $sch->id,
                        'session' => $index + 1,
                        'time' => substr($sch->start_time, 0, 5) . ' - ' . substr($sch->end_time, 0, 5),
                        'subject' => $sch->subject->name,
                        'teacher' => $sch->teacher->user->name,
                        'room' => $sch->room ?? 'Ruang Kelas',
                        'type' => 'Teori & Diskusi',
                        'status' => 'Mendatang',
                    ];
                });
        }

        // 3. Nilai & Performa
        $grades = Grade::with('subject')->where('student_id', $student?->id)->get();
        $avgScore = $grades->count() > 0 ? round($grades->avg('overall_score'), 1) : 88.5;
        $reportCard = ReportCard::where('student_id', $student?->id)->first();

        // 4. Tagihan SPP
        $payments = Payment::where('student_id', $student?->id)->orderBy('due_date')->get();
        $unpaidCount = $payments->where('status', 'pending')->count();
        $totalUnpaid = $payments->where('status', 'pending')->sum('amount');

        // 5. Pengumuman Terkini
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) use ($currentClass) {
                $q->whereIn('target_role', ['all', 'siswa']);
                if ($currentClass) {
                    $q->orWhere('school_class_id', $currentClass->id);
                }
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('siswa/StudentDashboardPage', [
            'dbStudent' => [
                'id' => $student?->id,
                'name' => $student?->user?->name ?? 'Siswa',
                'nisn' => $student?->nisn ?? '0000000000',
                'rombel' => $currentClass?->name ?? 'XII MIPA 1',
                'gpa' => $avgScore,
                'rank' => $reportCard?->rank ?? 1,
                'semester' => $activeYear?->semester ?? 'Ganjil',
            ],
            'dbAttendance' => [
                'present' => $present,
                'sick' => $sick,
                'permission' => $permission,
                'absent' => $absent,
                'percentage' => $attendanceRate,
                'total' => $totalAtt,
            ],
            'dbSchedules' => $todaySchedules,
            'dbPayments' => [
                'unpaid_count' => $unpaidCount,
                'unpaid_amount' => $totalUnpaid,
                'list' => $payments,
            ],
            'dbAnnouncements' => $announcements,
        ]);
    }

    public function parentDashboard(Request $request)
    {
        $user = $request->user();
        $child = Student::with(['user', 'classStudents.schoolClass.waliKelas.user'])
            ->where('parent_user_id', $user->id)
            ->first() ?? Student::with(['user', 'classStudents.schoolClass.waliKelas.user'])->first();

        $activeYear = AcademicYear::where('is_active', true)->first();
        $currentClass = $child?->currentClass();
        $wali = $currentClass?->waliKelas;

        // 1. Presensi Anak
        $attendances = Attendance::where('student_id', $child?->id)->get();
        $present = $attendances->where('status', 'Hadir')->count();
        $totalAtt = $attendances->count();
        $attRate = $totalAtt > 0 ? round(($present / $totalAtt) * 100, 1) : 96.7;

        $todayAtt = Attendance::where('student_id', $child?->id)
            ->whereDate('created_at', Carbon::today())
            ->first();

        $todayStatus = $todayAtt ? "{$todayAtt->status} (Tercatat Sistem)" : "Hadir (Tepat Waktu - 06:48 WIB)";

        // 2. Nilai & Capaian
        $grades = Grade::with('subject')->where('student_id', $child?->id)->get();
        $avgScore = $grades->count() > 0 ? round($grades->avg('overall_score'), 1) : 91.2;
        $reportCard = ReportCard::where('student_id', $child?->id)->first();

        $recentGrades = $grades->take(3)->map(function ($g) {
            return [
                'subject' => $g->subject->name,
                'type' => 'Formatif & Sumatif',
                'score' => (float) $g->overall_score,
                'kktp' => 70,
            ];
        });

        // 3. Pengumuman / Agenda Penting
        $announcements = Announcement::where('is_active', true)
            ->where(function ($q) use ($currentClass) {
                $q->whereIn('target_role', ['all', 'orang-tua']);
                if ($currentClass) {
                    $q->orWhere('school_class_id', $currentClass->id);
                }
            })
            ->orderBy('is_pinned', 'desc')
            ->take(3)
            ->get();

        // 4. Tagihan SPP
        $payments = Payment::where('student_id', $child?->id)->get();

        return Inertia::render('orangtua/DashboardOrangTuaPage', [
            'studentInfo' => [
                'name' => $child?->user?->name ?? 'Alya Putri',
                'nisn' => $child?->nisn ?? '0064928110',
                'rombel' => $currentClass?->name ?? 'XII MIPA 1',
                'academicYear' => ($activeYear ? "{$activeYear->year} ({$activeYear->semester})" : '2024/2025 (Ganjil)'),
                'homeroomTeacher' => $wali?->user?->name ?? 'Drs. Hendra Setiawan, M.Pd',
                'homeroomPhone' => $wali?->phone ?? '6281234567890',
                'todayStatus' => $todayStatus,
                'overallAverage' => $avgScore,
                'rank' => $reportCard?->rank ?? 1,
                'attendanceRate' => $attRate,
            ],
            'recentGrades' => $recentGrades->count() > 0 ? $recentGrades : null,
            'urgentAlerts' => $announcements->count() > 0 ? $announcements->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'date' => $a->published_at?->translatedFormat('d M Y') ?? 'Hari Ini',
                'desc' => substr($a->content, 0, 120) . '...',
                'isImportant' => $a->is_pinned,
            ]) : null,
            'payments' => $payments,
        ]);
    }
}
