<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    private function normalizeGradeLevel(?string $gradeLevel, ?string $fase): string
    {
        $raw = trim((string) ($gradeLevel ?? $fase ?? ''));

        if ($raw === '') {
            return 'X';
        }

        $upper = strtoupper($raw);

        if (str_contains($upper, 'XII') || str_contains($raw, '12')) {
            return 'XII';
        }

        if (str_contains($upper, 'XI') || str_contains($raw, '11')) {
            return 'XI';
        }

        if (str_contains($upper, 'X') || str_contains($raw, '10')) {
            return 'X';
        }

        return $raw;
    }

    private function faseLabel(string $gradeLevel): string
    {
        return match (strtoupper($gradeLevel)) {
            'X' => 'Fase E (Kelas 10)',
            'XI' => 'Fase F (Kelas 11)',
            'XII' => 'Fase F (Kelas 12)',
            default => $gradeLevel,
        };
    }

    public function index(Request $request)
    {
        $query = SchoolClass::with(['waliKelas.user'])->withCount('classStudents');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', '%'.$search.'%')
                    ->orWhere('grade_level', 'like', '%'.$search.'%')
                    ->orWhere('peminatan', 'like', '%'.$search.'%');
            });
        }

        $classes = $query->orderBy('grade_level')->get()->map(
            fn (SchoolClass $class) => [
                'id' => (string) $class->id,
                'name' => $class->name,
                'grade_level' => $class->grade_level,
                'fase' => $this->faseLabel($class->grade_level),
                'peminatan' => $class->peminatan ?? 'Umum',
                'capacity' => $class->capacity ?? 36,
                'totalStudents' => $class->class_students_count,
                'homeroomTeacher' => $class->waliKelas?->user?->name ?? 'Belum ditentukan',
                'wali_kelas_id' => $class->wali_kelas_id,
            ]
        );

        $subjects = Subject::orderBy('code')->get()->map(fn (Subject $subject) => [
            'id' => (string) $subject->id,
            'code' => $subject->code,
            'name' => $subject->name,
            'category' => $subject->category ?? 'Wajib',
            'hoursPerWeek' => $subject->hours_per_week ?? 3,
            'kktp' => $subject->kktp ?? 70,
            'teacherCount' => $subject->schedules()->distinct('teacher_id')->count('teacher_id'),
        ]);

        return Inertia::render('admin/MasterDataPage', [
            'classes' => $classes,
            'subjects' => $subjects,
            'teachers' => Teacher::with('user')->get()->map(fn (Teacher $teacher) => [
                'id' => $teacher->id,
                'name' => $teacher->user?->name ?? '-',
            ]),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'nullable|string|max:50',
            'fase' => 'nullable|string|max:50',
            'peminatan' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1|max:100',
            'wali_kelas_id' => 'nullable|exists:teachers,id',
        ]);

        $validated['grade_level'] = $this->normalizeGradeLevel(
            $validated['grade_level'] ?? null,
            $validated['fase'] ?? null
        );

        unset($validated['fase']);

        SchoolClass::create($validated);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'nullable|string|max:50',
            'fase' => 'nullable|string|max:50',
            'peminatan' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1|max:100',
            'wali_kelas_id' => 'nullable|exists:teachers,id',
        ]);

        $validated['grade_level'] = $this->normalizeGradeLevel(
            $validated['grade_level'] ?? null,
            $validated['fase'] ?? null
        );

        unset($validated['fase']);

        $schoolClass->update($validated);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
