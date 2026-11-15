<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        $meetings = Meeting::with(['schoolClass', 'subject', 'teacher.user'])
            ->when($teacher, fn($q) => $q->where('teacher_id', $teacher->id))
            ->orderBy('date', 'desc')
            ->get();

        $classes = SchoolClass::all();
        $subjects = Subject::all();

        return Inertia::render('guru/PertemuanPage', [
            'dbMeetings' => $meetings,
            'classes' => $classes,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'session_no' => 'required|integer',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
            'date' => 'required|date',
            'status' => 'required|in:Draft,Terbit',
        ]);

        if ($teacher) {
            $validated['teacher_id'] = $teacher->id;
        }

        Meeting::create($validated);

        return redirect()->back()->with('success', 'Pertemuan berhasil disimpan.');
    }

    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'session_no' => 'required|integer',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
            'date' => 'required|date',
            'status' => 'required|in:Draft,Terbit',
        ]);

        $meeting->update($validated);

        return redirect()->back()->with('success', 'Pertemuan berhasil diperbarui.');
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return redirect()->back()->with('success', 'Pertemuan berhasil dihapus.');
    }
}
