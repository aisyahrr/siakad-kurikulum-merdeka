import React, { useState } from "react";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function KeuanganAdminPage({ payments, students }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, setData, post, put, delete: destroy, reset } = useForm({
    student_id: "",
    title: "",
    amount: "",
    status: "pending",
    due_date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.keuangan.store'), { onSuccess: () => setModalOpen(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17345b]">Manajemen Keuangan</h1>
          <p className="text-xs text-[#68777c]">Kelola tagihan dan status pembayaran siswa.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white">
          <Plus size={14} /> Tambah Tagihan
        </button>
      </div>

      <div className="rounded-2xl bg-[#e9eef3] p-6 shadow-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[#68777c]">
              <th className="p-3">Siswa</th>
              <th className="p-3">Tagihan</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.data.map((p: any) => (
              <tr key={p.id} className="border-t border-[#d8e1e8]">
                <td className="p-3">{p.student.user.name}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">Rp {Number(p.amount).toLocaleString('id-ID')}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">
                  <button onClick={() => destroy(route('admin.keuangan.destroy', p.id))} className="text-red-500"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Pilih Siswa</label>
              <select className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none" onChange={e => setData('student_id', e.target.value)}>
                <option value="">Pilih Siswa</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.user.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Judul Tagihan</label>
              <input type="text" placeholder="Contoh: SPP Januari 2026" className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none" onChange={e => setData('title', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Jumlah</label>
              <input type="number" placeholder="0" className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none" onChange={e => setData('amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Jatuh Tempo</label>
              <input type="date" className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none" onChange={e => setData('due_date', e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-full bg-[#e9eef3] px-4 py-2.5 text-xs font-bold text-[#68777c] shadow-[3px_3px_6px_#cbd3db,-3px_-3px_6px_#fff]">Batal</button>
              <button type="submit" className="flex-1 rounded-full bg-[#17345b] px-4 py-2.5 text-xs font-bold text-white shadow-[3px_3px_6px_#cbd3db] transition hover:bg-[#102743]">Simpan Tagihan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
