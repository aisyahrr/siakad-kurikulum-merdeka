<?php

namespace App\Http\Controllers;

use App\Models\TeacherAttendance;
use App\Models\DigitalLibrary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtraFeatureController extends Controller
{
    public function teacherAttendance(Request $request)
    {
        return Inertia::render('admin/PresensiGuruAdminPage', [
            'attendances' => TeacherAttendance::with('teacher.user')->latest()->paginate(10)
        ]);
    }

    public function library(Request $request)
    {
        return Inertia::render('siswa/LibraryPage', [
            'books' => DigitalLibrary::latest()->paginate(10)
        ]);
    }
}
