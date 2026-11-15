<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\ReportCard;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportCardController extends Controller
{
    public function rekapNilai(Request $request)
    {
        $teacher = $request->user()->teacher;
        $activeYear = AcademicYear::where('is_active', true)->first();

        // Cari kelas yang dibimbing oleh wali kelas ini
        $myClass = SchoolClass::with(['students.user', 'students.grades.subject'])
            ->where('wali_kelas_id', $teacher?->id)
            ->first() ?? SchoolClass::with(['students.user', 'students.grades.subject'])->first();

        $studentsData = [];
        if ($myClass) {
            foreach ($myClass->students as $index => $student) {
                $grades = $student->grades;
                $avgScore = $grades->count() > 0 ? round($grades->avg('overall_score'), 1) : 0;

                $report = ReportCard::where('student_id', $student->id)
                    ->when($activeYear, fn($q) => $q->where('academic_year_id', $activeYear->id))
                    ->first();

                $studentsData[] = [
                    'id' => (string) $student->id,
                    'name' => $student->user->name,
                    'nisn' => $student->nisn,
                    'gpa' => $avgScore,
                    'rank' => $report?->rank ?? ($index + 1),
                    'notes' => $report?->notes ?? 'Menunjukkan perkembangan belajar yang baik.',
                    'status' => $report?->status ?? 'Terbit',
                    'grades' => $grades,
                ];
            }
        }

        return Inertia::render('wali-kelas/RekapNilaiPage', [
            'myClass' => $myClass,
            'dbStudents' => $studentsData,
        ]);
    }

    public function publish(Request $request)
    {
        $teacher = $request->user()->teacher;
        $activeYear = AcademicYear::where('is_active', true)->first();

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'gpa' => 'required|numeric|min:0|max:100',
            'rank' => 'nullable|integer',
            'notes' => 'nullable|string',
            'status' => 'required|in:Draft,Terbit',
        ]);

        ReportCard::updateOrCreate(
            [
                'academic_year_id' => $activeYear?->id ?? 1,
                'student_id' => $validated['student_id'],
            ],
            [
                'school_class_id' => $validated['school_class_id'],
                'homeroom_teacher_id' => $teacher?->id,
                'gpa' => $validated['gpa'],
                'rank' => $validated['rank'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'],
            ]
        );

        return redirect()->back()->with('success', 'Rapor hasil belajar berhasil disimpan.');
    }

    public function studentReport(Request $request)
    {
        $student = $request->user()->student;
        $activeYear = AcademicYear::where('is_active', true)->first();

        $reportCard = ReportCard::with(['schoolClass', 'homeroomTeacher.user'])
            ->where('student_id', $student?->id)
            ->when($activeYear, fn($q) => $q->where('academic_year_id', $activeYear->id))
            ->first();

        $grades = Grade::with(['subject', 'teacher.user'])
            ->where('student_id', $student?->id)
            ->get();

        return Inertia::render('siswa/RaporPage', [
            'reportCard' => $reportCard,
            'dbGrades' => $grades,
            'activeYear' => $activeYear,
        ]);
    }
}
