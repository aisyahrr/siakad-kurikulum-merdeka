<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function teacherSchedule(Request $request)
    {
        $teacher = $request->user()->teacher;

        $schedules = Schedule::with(['schoolClass', 'subject'])
            ->when($teacher, fn($q) => $q->where('teacher_id', $teacher->id))
            ->get()
            ->map(fn($item) => [
                'id' => (string) $item->id,
                'day' => $item->day,
                'time' => substr($item->start_time, 0, 5) . ' – ' . substr($item->end_time, 0, 5) . ' WIB',
                'subjectId' => (string) $item->subject_id,
                'teacherId' => (string) $item->teacher_id,
                'rombelId' => (string) $item->school_class_id,
                'room' => $item->room ?? 'Kelas',
                'topic' => $item->topic ?? $item->subject->name,
                'sks' => $item->sks,
                'subjectName' => $item->subject->name,
                'rombelName' => $item->schoolClass->name,
            ]);

        return Inertia::render('guru/JadwalGuruPage', [
            'dbSchedules' => $schedules,
        ]);
    }

    public function studentSchedule(Request $request)
    {
        $student = $request->user()->student;
        $activeClassStudent = $student?->classStudents()->latest()->first();

        $schedules = Schedule::with(['teacher.user', 'subject', 'schoolClass'])
            ->when($activeClassStudent, fn($q) => $q->where('school_class_id', $activeClassStudent->class_id))
            ->get();

        return Inertia::render('siswa/SchedulePage', [
            'dbSchedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'start_time' => 'required',
            'end_time' => 'required',
            'room' => 'nullable|string|max:100',
            'topic' => 'nullable|string|max:255',
            'sks' => 'nullable|integer|min:1',
        ]);

        Schedule::create($validated);

        return redirect()->back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'start_time' => 'required',
            'end_time' => 'required',
            'room' => 'nullable|string|max:100',
            'topic' => 'nullable|string|max:255',
            'sks' => 'nullable|integer|min:1',
        ]);

        $schedule->update($validated);

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
