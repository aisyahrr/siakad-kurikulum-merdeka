<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
{
    public function teacherGradebook(Request $request)
    {
        $teacher = $request->user()->teacher;
        $classId = $request->input('class_id');
        $subjectId = $request->input('subject_id');

        $classes = SchoolClass::all();
        $subjects = Subject::all();

        $students = [];
        $grades = [];

        if ($classId && $subjectId) {
            $class = SchoolClass::with('students.user')->find($classId);
            if ($class) {
                $students = $class->students;
            }

            $grades = Grade::with('student.user')
                ->where('school_class_id', $classId)
                ->where('subject_id', $subjectId)
                ->when($teacher, fn($q) => $q->where('teacher_id', $teacher->id))
                ->get();
        }

        return Inertia::render('guru/NilaiGuruPage', [
            'classes' => $classes,
            'subjects' => $subjects,
            'students' => $students,
            'dbGrades' => $grades,
        ]);
    }

    public function saveGrade(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.assignment' => 'required|numeric|min:0|max:100',
            'grades.*.midterm' => 'required|numeric|min:0|max:100',
            'grades.*.final' => 'required|numeric|min:0|max:100',
            'grades.*.competency_achieved' => 'nullable|string',
            'grades.*.competency_improved' => 'nullable|string',
        ]);

        $activeYear = AcademicYear::where('is_active', true)->first();

        foreach ($validated['grades'] as $item) {
            $assignment = (float) $item['assignment'];
            $midterm = (float) $item['midterm'];
            $final = (float) $item['final'];
            $overall = round(($assignment * 0.4) + ($midterm * 0.3) + ($final * 0.3));

            $letter = 'D';
            if ($overall >= 90) $letter = 'A';
            elseif ($overall >= 80) $letter = 'B';
            elseif ($overall >= 70) $letter = 'C';

            Grade::updateOrCreate(
                [
                    'school_class_id' => $validated['school_class_id'],
                    'subject_id' => $validated['subject_id'],
                    'student_id' => $item['student_id'],
                ],
                [
                    'teacher_id' => $teacher?->id,
                    'academic_year_id' => $activeYear?->id,
                    'assignment_score' => $assignment,
                    'midterm_score' => $midterm,
                    'final_score' => $final,
                    'overall_score' => $overall,
                    'letter_grade' => $letter,
                    'competency_achieved' => $item['competency_achieved'] ?? 'Menunjukkan penguasaan sangat baik dalam capaian kompetensi dasar.',
                    'competency_improved' => $item['competency_improved'] ?? 'Perlu bimbingan lebih lanjut pada penerapan konsep terapan.',
                ]
            );
        }

        return redirect()->back()->with('success', 'Nilai asesmen Kurikulum Merdeka berhasil disimpan.');
    }

    public function studentGrades(Request $request)
    {
        $student = $request->user()->student;

        $grades = Grade::with(['subject', 'teacher.user', 'schoolClass'])
            ->when($student, fn($q) => $q->where('student_id', $student->id))
            ->get();

        return Inertia::render('siswa/NilaiPage', [
            'dbGrades' => $grades,
        ]);
    }

    public function childGrades(Request $request)
    {
        $user = $request->user();
        $child = $user->children()->with(['user', 'classStudents.schoolClass'])->first();

        $grades = [];
        if ($child) {
            $grades = Grade::with(['subject', 'teacher.user'])
                ->where('student_id', $child->id)
                ->get();
        }

        return Inertia::render('orangtua/NilaiAnakPage', [
            'child' => $child,
            'dbGrades' => $grades,
        ]);
    }
}
