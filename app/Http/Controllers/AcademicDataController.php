<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\ClassStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AcademicDataController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::with(['user', 'classStudents.schoolClass'])
            ->orderByDesc('id')
            ->get()
            ->map(function (Student $student) {
                $enrolment = $student->classStudents->sortByDesc('id')->first();

                return [
                    'id' => $student->id,
                    'name' => $student->user?->name ?? '-',
                    'nisn' => $student->nisn,
                    'rombel' => $enrolment?->schoolClass?->name ?? '-',
                    'rombelId' => $enrolment?->schoolClass?->id,
                    'angkatan' => $student->entry_year ?? '-',
                    'gender' => $student->gender ?? '-',
                    'status' => $student->status ?? 'Aktif',
                ];
            })
            ->values();

        $teachers = Teacher::with(['user', 'classes'])
            ->orderBy('id')
            ->get()
            ->map(fn (Teacher $teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->user?->name ?? '-',
                'nip' => $teacher->nip ?? '-',
                'mainSubject' => $teacher->main_subject ?? '-',
                'homeroomClass' => $teacher->classes->first()?->name,
                'homeroomClassId' => $teacher->classes->first()?->id,
                'teachingHours' => $teacher->teaching_hours ?? 0,
                'status' => $teacher->employment_status ?? 'PNS',
            ])
            ->values();

        return Inertia::render('admin/DataAkademikPage', [
            'students' => $students,
            'teachers' => $teachers,
            'classes' => SchoolClass::orderBy('grade_level')
                ->get(['id', 'name'])
                ->map(fn (SchoolClass $class) => [
                    'id' => $class->id,
                    'name' => $class->name,
                ]),
        ]);
    }

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nisn' => 'required|string|max:20|unique:students,nisn',
            'gender' => 'required|in:L,P',
            'rombel' => 'nullable|string|max:255',
            'angkatan' => 'nullable|string|max:4',
        ]);

        DB::transaction(function () use ($validated) {
            $email = $validated['nisn'].'@siswa.siakad.test';

            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['nisn'],
                'email' => $email,
                'password' => 'password',
                'role' => 'siswa',
                'identifier' => $validated['nisn'],
                'is_active' => true,
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'nisn' => $validated['nisn'],
                'gender' => $validated['gender'],
                'entry_year' => $validated['angkatan'] ?? null,
                'status' => 'Aktif',
            ]);

            $class = null;

            if (! empty($validated['rombel'])) {
                $class = SchoolClass::where('id', $validated['rombel'])
                    ->orWhere('name', $validated['rombel'])
                    ->first();
            }

            $activeYear = AcademicYear::where('is_active', true)->first();

            if ($class && $activeYear) {
                ClassStudent::firstOrCreate(
                    [
                        'student_id' => $student->id,
                        'academic_year_id' => $activeYear->id,
                    ],
                    ['class_id' => $class->id]
                );
            }
        });

        return redirect()->back()->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function assignHomeroom(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'class_id' => 'nullable|exists:school_classes,id',
        ]);

        DB::transaction(function () use ($teacher, $validated) {
            SchoolClass::where('wali_kelas_id', $teacher->id)
                ->update(['wali_kelas_id' => null]);

            if (! empty($validated['class_id'])) {
                SchoolClass::where('id', $validated['class_id'])
                    ->update(['wali_kelas_id' => $teacher->id]);
            }
        });

        return redirect()->back()->with('success', 'Penugasan wali kelas berhasil diperbarui.');
    }
}
