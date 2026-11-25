<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function edit(Request $request)
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        return Inertia::render('admin/PengaturanAdminPage', [
            'academicYear' => $activeYear?->name ?? '',
            'semester' => $activeYear?->semester ?? 'Ganjil',
            'globalKktp' => (int) Setting::get('global_kktp', 70),
            'minAttendanceWarning' => (int) Setting::get('min_attendance_warning', 75),
            'isGradeEntryLocked' => (bool) Setting::get('grade_entry_locked', false),
            'schoolProfile' => Setting::get('school_profile', [
                'name' => '',
                'npsn' => '',
                'akreditasi' => '',
                'headmaster' => '',
                'nipHeadmaster' => '',
                'address' => '',
                'website' => '',
                'phone' => '',
            ]),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'academicYear' => 'required|string|max:50',
            'semester' => 'required|in:Ganjil,Genap',
            'globalKktp' => 'required|integer|min:50|max:100',
            'minAttendanceWarning' => 'required|integer|min:50|max:95',
            'isGradeEntryLocked' => 'boolean',
            'schoolProfile' => 'required|array',
            'schoolProfile.name' => 'required|string|max:255',
            'schoolProfile.npsn' => 'nullable|string|max:50',
            'schoolProfile.akreditasi' => 'nullable|string|max:50',
            'schoolProfile.headmaster' => 'nullable|string|max:255',
            'schoolProfile.nipHeadmaster' => 'nullable|string|max:50',
            'schoolProfile.address' => 'nullable|string|max:500',
            'schoolProfile.website' => 'nullable|string|max:255',
            'schoolProfile.phone' => 'nullable|string|max:50',
        ]);

        AcademicYear::where('is_active', true)->update(['is_active' => false]);

        AcademicYear::updateOrCreate(
            [
                'name' => $validated['academicYear'],
                'semester' => $validated['semester'],
            ],
            [
                'is_active' => true,
            ]
        );

        Setting::set('global_kktp', $validated['globalKktp']);
        Setting::set('min_attendance_warning', $validated['minAttendanceWarning']);
        Setting::set('grade_entry_locked', (bool) ($validated['isGradeEntryLocked'] ?? false));
        Setting::set('school_profile', $validated['schoolProfile']);

        return redirect()->back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}
