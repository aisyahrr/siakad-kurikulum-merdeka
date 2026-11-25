<?php

namespace App\Http\Controllers;

use App\Models\DigitalLibrary;
use App\Models\TeacherAttendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtraFeatureController extends Controller
{
    public function teacherAttendance(Request $request)
    {
        $query = TeacherAttendance::with('teacher.user')->latest('date');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('teacher.user', function ($builder) use ($search) {
                $builder->where('name', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        return Inertia::render('admin/PresensiGuruAdminPage', [
            'attendances' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function library(Request $request)
    {
        return Inertia::render('siswa/LibraryPage', [
            'books' => DigitalLibrary::latest()->paginate(10),
        ]);
    }
}
