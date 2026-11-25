<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with(['teacher', 'student']);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('username', 'like', '%'.$search.'%')
                    ->orWhere('identifier', 'like', '%'.$search.'%')
                    ->orWhere('role', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('role') && $request->role !== 'Semua') {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('name')->paginate(10)->withQueryString()->through(
            fn (User $user) => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'username' => $user->username ?? strstr($user->email, '@', true),
                'email' => $user->email,
                'role' => $user->role,
                'identifier' => $user->identifier
                    ?? $user->teacher?->nip
                    ?? $user->student?->nisn
                    ?? '-',
                'isActive' => (bool) $user->is_active,
                'lastLogin' => $user->last_login_at?->diffForHumans() ?? 'Belum pernah',
            ]
        );

        return Inertia::render('admin/ManajemenPenggunaPage', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'summary' => [
                'total' => User::count(),
                'students' => User::where('role', 'siswa')->count(),
                'teachers' => User::whereIn('role', ['guru', 'wali-kelas'])->count(),
                'active' => User::where('is_active', true)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:100|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,guru,wali-kelas,siswa,orang-tua',
            'identifier' => 'nullable|string|max:255',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'identifier' => $validated['identifier'] ?? null,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:100|unique:users,username,'.$user->id,
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|string|in:admin,guru,wali-kelas,siswa,orang-tua',
            'identifier' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function toggleStatus(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menonaktifkan akun sendiri.');
        }

        $user->update(['is_active' => ! $user->is_active]);

        return redirect()->back()->with(
            'success',
            $user->is_active ? 'Akun berhasil diaktifkan.' : 'Akun berhasil dinonaktifkan.'
        );
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password pengguna berhasil direset.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
