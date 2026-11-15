<?php

namespace App\Http\Controllers;

use App\Models\Bimbingan;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BimbinganController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        $logs = Bimbingan::with(['student.user', 'schoolClass'])
            ->when($teacher, fn($q) => $q->where('teacher_id', $teacher->id))
            ->orderBy('date', 'desc')
            ->get();

        $students = Student::with('user')->get();

        return Inertia::render('wali-kelas/BimbinganPage', [
            'dbLogs' => $logs,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'school_class_id' => 'nullable|exists:school_classes,id',
            'category' => 'required|in:Akademik,Kedisiplinan,Presensi,Karakter',
            'date' => 'required|date',
            'issue' => 'required|string',
            'action_plan' => 'required|string',
            'parent_contacted' => 'boolean',
            'status' => 'required|in:Dalam Pemantauan,Tuntas',
        ]);

        if ($teacher) {
            $validated['teacher_id'] = $teacher->id;
        }

        Bimbingan::create($validated);

        return redirect()->back()->with('success', 'Catatan bimbingan berhasil disimpan.');
    }

    public function update(Request $request, Bimbingan $bimbingan)
    {
        $validated = $request->validate([
            'category' => 'required|in:Akademik,Kedisiplinan,Presensi,Karakter',
            'date' => 'required|date',
            'issue' => 'required|string',
            'action_plan' => 'required|string',
            'parent_contacted' => 'boolean',
            'status' => 'required|in:Dalam Pemantauan,Tuntas',
        ]);

        $bimbingan->update($validated);

        return redirect()->back()->with('success', 'Catatan bimbingan berhasil diperbarui.');
    }

    public function destroy(Bimbingan $bimbingan)
    {
        $bimbingan->delete();

        return redirect()->back()->with('success', 'Catatan bimbingan berhasil dihapus.');
    }
}
