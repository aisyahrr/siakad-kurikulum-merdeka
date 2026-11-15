<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function teacherAttendance(Request $request)
    {
        $teacher = $request->user()->teacher;
        $date = $request->input('date', now()->toDateString());
        $classId = $request->input('class_id');
        $subjectId = $request->input('subject_id');

        $classes = SchoolClass::all();
        $subjects = Subject::all();

        $session = null;
        $attendances = [];

        if ($classId && $subjectId && $teacher) {
            $session = AttendanceSession::with('attendances.student.user')
                ->where('teacher_id', $teacher->id)
                ->where('school_class_id', $classId)
                ->where('subject_id', $subjectId)
                ->where('date', $date)
                ->first();

            if ($session) {
                $attendances = $session->attendances;
            }
        }

        return Inertia::render('guru/PresensiGuruPage', [
            'classes' => $classes,
            'subjects' => $subjects,
            'currentSession' => $session,
            'attendances' => $attendances,
        ]);
    }

    public function saveTeacherAttendance(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'title' => 'nullable|string',
            'meeting_id' => 'nullable|exists:meetings,id',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:Hadir,Izin,Sakit,Alpa',
            'records.*.note' => 'nullable|string|max:255',
        ]);

        $session = AttendanceSession::firstOrCreate(
            [
                'teacher_id' => $teacher?->id,
                'school_class_id' => $validated['school_class_id'],
                'subject_id' => $validated['subject_id'],
                'date' => $validated['date'],
            ],
            [
                'title' => $validated['title'] ?? 'Presensi Harian',
                'meeting_id' => $validated['meeting_id'] ?? null,
            ]
        );

        foreach ($validated['records'] as $record) {
            Attendance::updateOrCreate(
                [
                    'attendance_session_id' => $session->id,
                    'student_id' => $record['student_id'],
                ],
                [
                    'status' => $record['status'],
                    'note' => $record['note'] ?? null,
                    'check_in_time' => now()->toTimeString(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Presensi berhasil disimpan.');
    }

    public function studentAttendance(Request $request)
    {
        $student = $request->user()->student;

        $attendances = Attendance::with(['attendanceSession.subject', 'attendanceSession.schoolClass'])
            ->when($student, fn($q) => $q->where('student_id', $student->id))
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('siswa/PresensiPage', [
            'dbAttendances' => $attendances,
        ]);
    }
}
