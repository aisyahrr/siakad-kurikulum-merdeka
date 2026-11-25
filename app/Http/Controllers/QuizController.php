<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\QuizSubmission;
use App\Models\SchoolClass;
use App\Models\StudentAnswer;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        $quizzes = Quiz::with([
            'schoolClass',
            'subject',
            'questions.options',
            'submissions.student.user',
            'submissions.answers',
        ])
            ->withCount('submissions')
            ->when($teacher, fn ($query) => $query->where('teacher_id', $teacher->id))
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('guru/KuisPage', [
            'dbQuizzes' => $quizzes,
            'classes' => SchoolClass::orderBy('name')->get(),
            'subjects' => Subject::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate($this->quizRules());
        $questions = $request->filled('questions') ? $this->validateQuestions($request) : [];

        $validated['teacher_id'] = $teacher?->id;

        DB::transaction(function () use ($validated, $questions) {
            $quiz = Quiz::create($validated);

            foreach ($questions as $question) {
                $this->createQuestion($quiz, $question);
            }
        });

        return redirect()->back()->with('success', 'Kuis berhasil dibuat.');
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate($this->quizRules());

        $quiz->update($validated);

        if ($request->has('questions') && $quiz->submissions()->count() === 0) {
            $questions = $this->validateQuestions($request);

            DB::transaction(function () use ($quiz, $questions) {
                $quiz->questions()->delete();

                foreach ($questions as $question) {
                    $this->createQuestion($quiz, $question);
                }
            });
        }

        return redirect()->back()->with('success', 'Kuis berhasil diperbarui.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();

        return redirect()->back()->with('success', 'Kuis berhasil dihapus.');
    }

    public function gradeEssay(Request $request, QuizSubmission $submission)
    {
        $validated = $request->validate([
            'essay_score' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $totalScore = round(((float) $submission->mcq_score + (float) $validated['essay_score']) / 2, 2);

        $submission->update([
            'essay_score' => $validated['essay_score'],
            'total_score' => $totalScore,
            'is_graded' => true,
            'feedback' => $validated['feedback'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Koreksi essay berhasil disimpan.');
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()->student;
        $class = $student?->currentClass();

        if (!$student || !$class) {
            return Inertia::render('siswa/KuisPage', [
                'dbQuizzes' => [],
            ]);
        }

        $quizzes = Quiz::with(['schoolClass', 'subject', 'questions.options'])
            ->with([
                'submissions' => fn ($query) => $query
                    ->where('student_id', $student?->id)
                    ->with('answers'),
            ])
            ->where('status', 'Terbit')
            ->where('school_class_id', $class->id)
            ->latest()
            ->get()
            ->map(fn (Quiz $quiz) => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'type' => $quiz->type,
                'duration' => $quiz->duration,
                'status' => $quiz->status,
                'start_time' => $quiz->start_time,
                'end_time' => $quiz->end_time,
                'subject' => $quiz->subject,
                'school_class' => $quiz->schoolClass,
                'questions' => $quiz->questions->map(fn (QuizQuestion $question) => [
                    'id' => $question->id,
                    'type' => $question->type,
                    'question_text' => $question->question_text,
                    'points' => $question->points,
                    'options' => $question->options->map(fn (QuizOption $option) => [
                        'id' => $option->id,
                        'option_text' => $option->option_text,
                    ])->values(),
                ])->values(),
                'my_submission' => $quiz->submissions->first(),
            ]);

        return Inertia::render('siswa/KuisPage', [
            'dbQuizzes' => $quizzes,
        ]);
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $student = $request->user()->student;

        if (! $student) {
            return redirect()->back()->with('error', 'Profil siswa tidak ditemukan.');
        }

        if ($quiz->status !== 'Terbit') {
            return redirect()->back()->with('error', 'Kuis ini belum diterbitkan.');
        }

        $class = $student->currentClass();

        if ($quiz->school_class_id && $class && $quiz->school_class_id !== $class->id) {
            abort(403, 'Kuis ini bukan untuk kelas Anda.');
        }

        if (QuizSubmission::where('quiz_id', $quiz->id)->where('student_id', $student->id)->exists()) {
            return redirect()->back()->with('error', 'Anda sudah mengumpulkan jawaban kuis ini.');
        }

        $validated = $request->validate([
            'answers' => 'nullable|array',
            'answers.*.question_id' => 'required|exists:quiz_questions,id',
            'answers.*.option_id' => 'nullable|exists:quiz_options,id',
            'answers.*.essay_answer' => 'nullable|string',
        ]);

        $quiz->load('questions.options');
        $answers = collect($validated['answers'] ?? []);

        DB::transaction(function () use ($quiz, $student, $answers) {
            $submission = QuizSubmission::create([
                'quiz_id' => $quiz->id,
                'student_id' => $student->id,
                'mcq_score' => 0,
                'essay_score' => null,
                'total_score' => null,
                'is_graded' => false,
                'submitted_at' => now(),
            ]);

            $mcqTotal = 0;
            $mcqEarned = 0;
            $hasEssay = false;

            foreach ($quiz->questions as $question) {
                $answer = $answers->firstWhere('question_id', $question->id);

                if ($question->type === 'essay') {
                    $hasEssay = true;
                    StudentAnswer::create([
                        'quiz_submission_id' => $submission->id,
                        'quiz_question_id' => $question->id,
                        'essay_answer' => $answer['essay_answer'] ?? null,
                    ]);

                    continue;
                }

                $mcqTotal += $question->points;

                $optionId = isset($answer['option_id']) ? (int) $answer['option_id'] : null;
                $selected = $optionId ? $question->options->firstWhere('id', $optionId) : null;
                $correct = $question->options->firstWhere('is_correct', true);
                $score = $correct && $selected && $selected->id === $correct->id
                    ? $question->points
                    : 0;

                $mcqEarned += $score;

                StudentAnswer::create([
                    'quiz_submission_id' => $submission->id,
                    'quiz_question_id' => $question->id,
                    'quiz_option_id' => $selected?->id,
                    'score' => $score,
                ]);
            }

            $mcqScore = $mcqTotal > 0 ? round(($mcqEarned / $mcqTotal) * 100, 2) : 0;

            $submission->update([
                'mcq_score' => $mcqScore,
                'total_score' => $hasEssay ? null : $mcqScore,
                'is_graded' => ! $hasEssay,
            ]);
        });

        return redirect()->back()->with('success', 'Jawaban kuis berhasil dikumpulkan.');
    }

    /**
     * @return array<string, mixed>
     */
    private function quizRules(): array
    {
        return [
            'school_class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'duration' => 'required|integer|min:5|max:300',
            'status' => 'required|in:Draft,Terbit',
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function validateQuestions(Request $request): array
    {
        $validated = $request->validate([
            'questions' => 'nullable|array',
            'questions.*.question_text' => 'required|string',
            'questions.*.type' => 'required|in:mcq,essay',
            'questions.*.points' => 'nullable|integer|min:1|max:100',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'nullable|boolean',
        ]);

        foreach ($validated['questions'] ?? [] as $index => $question) {
            if ($question['type'] !== 'mcq') {
                continue;
            }

            $options = $question['options'] ?? [];
            $correct = collect($options)->where('is_correct', true)->count();

            if (count($options) < 2) {
                throw ValidationException::withMessages([
                    "questions.$index.options" => 'Soal pilihan ganda minimal memiliki 2 opsi jawaban.',
                ]);
            }

            if ($correct !== 1) {
                throw ValidationException::withMessages([
                    "questions.$index.options" => 'Pilih tepat satu jawaban benar pada soal pilihan ganda.',
                ]);
            }
        }

        return $validated['questions'];
    }

    /**
     * @param  array<string, mixed>  $question
     */
    private function createQuestion(Quiz $quiz, array $question): void
    {
        $created = $quiz->questions()->create([
            'question_text' => $question['question_text'],
            'type' => $question['type'],
            'points' => $question['points'] ?? 10,
        ]);

        if ($question['type'] !== 'mcq') {
            return;
        }

        foreach ($question['options'] ?? [] as $option) {
            $created->options()->create([
                'option_text' => $option['option_text'],
                'is_correct' => (bool) ($option['is_correct'] ?? false),
            ]);
        }
    }
}
