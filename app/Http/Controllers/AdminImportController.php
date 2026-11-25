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

class AdminImportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target' => 'required|in:siswa,guru,rombel',
            'rows' => 'required|array|min:1',
            'rows.*.col1' => 'required|string',
            'rows.*.col2' => 'required|string',
            'rows.*.col3' => 'nullable|string',
            'rows.*.col4' => 'nullable|string',
        ]);

        $imported = 0;

        DB::transaction(function () use ($validated, &$imported) {
            foreach ($validated['rows'] as $row) {
                $col1 = trim($row['col1'] ?? '');
                $col2 = trim($row['col2'] ?? '');
                $col3 = trim($row['col3'] ?? '');
                $col4 = trim($row['col4'] ?? '');

                if ($col1 === '' || $col2 === '') {
                    continue;
                }

                $success = match ($validated['target']) {
                    'siswa' => $this->importStudent($col1, $col2, $col3, $col4),
                    'guru' => $this->importTeacher($col1, $col2, $col3, $col4),
                    'rombel' => $this->importClass($col1, $col2, $col3, $col4),
                };

                if ($success) {
                    $imported++;
                }
            }
        });

        return redirect()->back()->with(
            'success',
            $imported.' baris data berhasil diimpor ke database akademik.'
        );
    }

    private function importStudent(string $name, string $nisn, string $rombel, string $gender): bool
    {
        if (! in_array(strtoupper($gender), ['L', 'P'], true)) {
            return false;
        }

        $user = User::firstOrCreate(
            ['email' => $nisn.'@siswa.siakad.test'],
            [
                'name' => $name,
                'username' => $nisn,
                'password' => 'password',
                'role' => 'siswa',
                'identifier' => $nisn,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $student = Student::firstOrCreate(
            ['nisn' => $nisn],
            [
                'user_id' => $user->id,
                'gender' => strtoupper($gender),
                'entry_year' => (string) now()->year,
                'status' => 'Aktif',
            ]
        );

        $class = SchoolClass::where('name', $rombel)->first();
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

        return true;
    }

    private function importTeacher(string $name, string $nip, string $mainSubject, string $status): bool
    {
        $status = in_array($status, ['PNS', 'PPPK', 'Honorer'], true) ? $status : 'PNS';

        $user = User::firstOrCreate(
            ['email' => $nip.'@guru.siakad.test'],
            [
                'name' => $name,
                'username' => $nip,
                'password' => 'password',
                'role' => 'guru',
                'identifier' => $nip,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        Teacher::firstOrCreate(
            ['nip' => $nip],
            [
                'user_id' => $user->id,
                'main_subject' => $mainSubject !== '' ? $mainSubject : null,
                'employment_status' => $status,
            ]
        );

        return true;
    }

    private function importClass(string $name, string $fase, string $peminatan, string $capacity): bool
    {
        $gradeLevel = match (true) {
            str_contains($fase, '12') || str_contains(strtoupper($fase), 'XII') => 'XII',
            str_contains($fase, '11') || str_contains(strtoupper($fase), 'XI') => 'XI',
            str_contains($fase, '10') => 'X',
            default => 'X',
        };

        $capacityValue = (int) preg_replace('/\D/', '', $capacity);

        SchoolClass::firstOrCreate(
            ['name' => $name],
            [
                'grade_level' => $gradeLevel,
                'peminatan' => $peminatan !== '' ? $peminatan : null,
                'capacity' => $capacityValue > 0 ? $capacityValue : 36,
            ]
        );

        return true;
    }
}
