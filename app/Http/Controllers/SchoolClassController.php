<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $query = SchoolClass::with(['waliKelas.user']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('grade_level', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('admin/MasterDataPage', [
            'classes' => $query->orderBy('grade_level')->paginate(10)->withQueryString(),
            'teachers' => Teacher::with('user')->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'wali_kelas_id' => 'nullable|exists:teachers,id',
        ]);

        SchoolClass::create($validated);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, SchoolClass $schoolClass)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'wali_kelas_id' => 'nullable|exists:teachers,id',
        ]);

        $schoolClass->update($validated);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(SchoolClass $schoolClass)
    {
        $schoolClass->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }
}
