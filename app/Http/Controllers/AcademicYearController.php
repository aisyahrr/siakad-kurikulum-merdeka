<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('semester', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('admin/DataAkademikPage', [
            'academicYears' => $query->orderBy('is_active', 'desc')->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'semester' => 'required|string|in:Ganjil,Genap',
            'is_active' => 'boolean',
        ]);

        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        AcademicYear::create($validated);

        return redirect()->back()->with('success', 'Tahun ajaran berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'semester' => 'required|string|in:Ganjil,Genap',
            'is_active' => 'boolean',
        ]);

        if (!empty($validated['is_active']) && $validated['is_active']) {
            AcademicYear::query()->update(['is_active' => false]);
        }

        $academicYear->update($validated);

        return redirect()->back()->with('success', 'Tahun ajaran berhasil diperbarui.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        $academicYear->delete();

        return redirect()->back()->with('success', 'Tahun ajaran berhasil dihapus.');
    }
}
