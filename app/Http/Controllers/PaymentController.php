<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $query = Payment::with('student.user')->latest();

            if ($request->filled('status') && $request->status !== 'Semua') {
                $query->where('status', $request->status);
            }

            return Inertia::render('admin/KeuanganAdminPage', [
                'payments' => $query->paginate(10)->withQueryString(),
                'students' => Student::with('user')->get(),
                'filters' => $request->only(['status']),
            ]);
        }

        $childIds = Student::where('parent_user_id', $user->id)->pluck('id');

        $payments = Payment::with('student.user')
            ->whereIn('student_id', $childIds)
            ->orderByDesc('due_date')
            ->paginate(10);

        return Inertia::render('orangtua/KeuanganAnakPage', [
            'payments' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'due_date' => 'required|date',
        ]);

        if ($validated['status'] === 'lunas') {
            $validated['paid_date'] = now();
        }

        Payment::create($validated);

        return redirect()->back()->with('success', 'Tagihan berhasil ditambahkan.');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,lunas',
            'due_date' => 'required|date',
        ]);

        if ($validated['status'] === 'lunas' && $payment->status !== 'lunas') {
            $validated['paid_date'] = now();
        } elseif ($validated['status'] === 'pending') {
            $validated['paid_date'] = null;
        }

        $payment->update($validated);

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->back()->with('success', 'Tagihan berhasil dihapus.');
    }
}
