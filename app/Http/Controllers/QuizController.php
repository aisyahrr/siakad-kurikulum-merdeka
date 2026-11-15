<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizSubmission;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        $quizzes = Quiz::with(['schoolClass', 'subject', 'questions'])
            ->withCount('submissions')
            ->when($teacher, fn($q) => $q->where('teacher_id', $teacher->id))
            ->orderBy('created_at', 'desc')
            ->get();

        $classes = SchoolClass::all();
        $subjects = Subject::all();

        return Inertia::render('guru/KuisPage', [
            'dbQuizzes' => $quizzes,
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
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'duration' => 'required|integer|min:5|max:300',
            'status' => 'required|in:Draft,Terbit',
        ]);

        if ($teacher) {
            $validated['teacher_id'] = $teacher->id;
        }

        $quiz = Quiz::create($validated);

        return redirect()->back()->with('success', 'Kuis berhasil dibuat.');
    }

    public function gradeEssay(Request $request, QuizSubmission $submission)
    {
        $validated = $request->validate([
            'essay_score' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $totalScore = round(($submission->mcq_score + $validated['essay_score']) / 2);

        $submission->update([
            'essay_score' => $validated['essay_score'],
            'total_score' => $totalScore,
            'is_graded' => true,
            'feedback' => $validated['feedback'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Koreksi essay berhasil disimpan.');
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'duration' => 'required|integer|min:5|max:300',
            'status' => 'required|in:Draft,Terbit',
        ]);

        $quiz->update($validated);

        return redirect()->back()->with('success', 'Kuis berhasil diperbarui.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->back()->with('success', 'Kuis berhasil dihapus.');
    }
}
