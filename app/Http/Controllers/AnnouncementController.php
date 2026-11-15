<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function siswaIndex(Request $request)
    {
        $user = $request->user();
        $student = $user->student;
        $classId = $student?->currentClass()?->id;

        $announcements = Announcement::with('author')
            ->where('is_active', true)
            ->where(function ($q) use ($classId) {
                $q->whereIn('target_role', ['all', 'siswa']);
                if ($classId) {
                    $q->orWhere('school_class_id', $classId);
                }
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('siswa/PengumumanPage', [
            'dbAnnouncements' => $announcements,
        ]);
    }

    public function orangTuaIndex(Request $request)
    {
        $user = $request->user();
        $child = Student::where('parent_user_id', $user->id)->first();
        $classId = $child?->currentClass()?->id;

        $announcements = Announcement::with('author')
            ->where('is_active', true)
            ->where(function ($q) use ($classId) {
                $q->whereIn('target_role', ['all', 'orang-tua']);
                if ($classId) {
                    $q->orWhere('school_class_id', $classId);
                }
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('orangtua/PengumumanOrangTuaPage', [
            'dbAnnouncements' => $announcements,
            'child' => $child?->load('user'),
        ]);
    }

    public function waliKelasIndex(Request $request)
    {
        $user = $request->user();
        $teacher = $user->teacher;
        $myClass = SchoolClass::where('wali_kelas_id', $teacher?->id)->first();

        $announcements = Announcement::with(['author', 'schoolClass'])
            ->where(function ($q) use ($myClass) {
                $q->whereIn('target_role', ['all', 'wali-kelas', 'guru']);
                if ($myClass) {
                    $q->orWhere('school_class_id', $myClass->id);
                }
            })
            ->orderBy('is_pinned', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();

        return Inertia::render('wali-kelas/PengumumanWaliPage', [
            'dbAnnouncements' => $announcements,
            'myClass' => $myClass,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:Akademik,Ujian & Penilaian,Kegiatan Siswa,Penting / Mendesak,Administrasi',
            'target_role' => 'required|in:all,guru,wali-kelas,siswa,orang-tua',
            'school_class_id' => 'nullable|exists:school_classes,id',
            'badge_text' => 'nullable|string|max:100',
            'reference_code' => 'nullable|string|max:100',
            'is_pinned' => 'boolean',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['is_active'] = true;
        $validated['published_at'] = now();

        Announcement::create($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil dipublikasikan.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|in:Akademik,Ujian & Penilaian,Kegiatan Siswa,Penting / Mendesak,Administrasi',
            'target_role' => 'required|in:all,guru,wali-kelas,siswa,orang-tua',
            'school_class_id' => 'nullable|exists:school_classes,id',
            'badge_text' => 'nullable|string|max:100',
            'reference_code' => 'nullable|string|max:100',
            'is_pinned' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $announcement->update($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
