<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        $materials = Material::with(['subject', 'schoolClass'])
            ->when($teacher, fn ($query) => $query->where('teacher_id', $teacher->id))
            ->latest()
            ->get();

        return Inertia::render('guru/MateriPage', [
            'dbMaterials' => $materials,
            'classes' => SchoolClass::orderBy('name')->get(),
            'subjects' => Subject::orderBy('name')->get(),
        ]);
    }

    public function studentIndex(Request $request)
    {
        $student = $request->user()->student;
        $class = $student?->currentClass();

        if (!$student || !$class) {
            return Inertia::render('siswa/MateriPage', [
                'dbMaterials' => [],
            ]);
        }

        $materials = Material::with(['subject', 'teacher.user'])
            ->where('status', 'Terbit')
            ->where(function ($query) use ($class) {
                $query->whereNull('school_class_id')
                    ->orWhere('school_class_id', $class->id);
            })
            ->latest()
            ->get();

        return Inertia::render('siswa/MateriPage', [
            'dbMaterials' => $materials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['teacher_id'] = $request->user()->teacher?->id;

        Material::create($validated);

        return redirect()->back()->with('success', 'Materi berhasil ditambahkan.');
    }

    public function update(Request $request, Material $material)
    {
        $material->update($request->validate($this->rules()));

        return redirect()->back()->with('success', 'Materi berhasil diperbarui.');
    }

    public function destroy(Material $material)
    {
        $material->delete();

        return redirect()->back()->with('success', 'Materi berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(): array
    {
        return [
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'nullable|exists:school_classes,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'link' => 'nullable|url|max:2048',
            'type' => 'required|in:Modul,Dokumen,Video,Tautan',
            'semester' => 'required|in:Ganjil,Genap',
            'status' => 'required|in:Draft,Terbit',
        ];
    }
}
