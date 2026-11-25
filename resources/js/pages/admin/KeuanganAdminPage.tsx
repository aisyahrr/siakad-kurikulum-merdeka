import React, { useEffect, useState } from "react";
import { CreditCard, Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { router, useForm, usePage } from "@inertiajs/react";

interface PaymentItem {
  id: number;
  student_id: number;
  title: string;
  amount: string | number;
  status: "pending" | "lunas";
  due_date: string;
  student?: { user?: { name?: string } };
}

interface StudentOption {
  id: number;
  user?: { name?: string };
}

interface KeuanganAdminProps {
  payments?: {
    data: PaymentItem[];
    links?: Array<{ url: string | null; label: string; active: boolean }>;
    total?: number;
  };
  students?: StudentOption[];
  filters?: { status?: string | null };
}

export default function KeuanganAdminPage({
  payments,
  students = [],
  filters,
}: KeuanganAdminProps = {}) {
  const page = usePage<{ flash?: { success?: string; error?: string } }>();
  const flash = page.props.flash;

  const rows = payments?.data ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentItem | null>(null);
  const [statusFilter, setStatusFilter] = useState(filters?.status ?? "Semua");
  const [feedback, setFeedback] = useState("");

  const { data, setData, post, put, reset, processing, errors } = useForm({
    student_id: "",
    title: "",
    amount: "",
    status: "pending" as "pending" | "lunas",
    due_date: "",
  });

  useEffect(() => {
    if (flash?.success) {
      setFeedback(flash.success);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
    if (flash?.error) {
      setFeedback(flash.error);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success, flash?.error]);

  const openCreate = () => {
    setEditing(null);
    reset();
    setModalOpen(true);
  };

  const openEdit = (payment: PaymentItem) => {
    setEditing(payment);
    setData({
      student_id: String(payment.student_id),
      title: payment.title,
      amount: String(payment.amount),
      status: payment.status,
      due_date: payment.due_date?.slice(0, 10) ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        setModalOpen(false);
        setEditing(null);
        reset();
      },
    };

    if (editing) {
      put(`/admin/keuangan/${editing.id}`, options);
    } else {
      post("/admin/keuangan", options);
    }
  };

  const handleDelete = (payment: PaymentItem) => {
    if (!window.confirm(`Hapus tagihan "${payment.title}"?`)) return;

    router.delete(`/admin/keuangan/${payment.id}`, { preserveScroll: true });
  };

  const applyStatusFilter = (status: string) => {
    setStatusFilter(status);
    router.get(
      "/admin/keuangan",
      { status: status === "Semua" ? undefined : status },
      { preserveState: true, preserveScroll: true, replace: true },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#17345b]">Manajemen Keuangan</h1>
          <p className="text-xs text-[#68777c]">Kelola tagihan dan status pembayaran siswa.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white sm:self-auto">
          <Plus size={14} /> Tambah Tagihan
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {["Semua", "pending", "lunas"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => applyStatusFilter(status)}
            className={`rounded-full px-3.5 py-1 text-[11px] font-bold capitalize transition ${
              statusFilter === status
                ? "bg-[#17345b] text-white shadow-sm"
                : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-[#e9eef3] p-4 shadow-lg sm:p-6">
        <table className="w-full min-w-[760px] text-xs">
          <thead>
            <tr className="text-left text-[#68777c]">
              <th className="p-3">Siswa</th>
              <th className="p-3">Tagihan</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Jatuh Tempo</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-[#d8e1e8]">
                <td className="p-3">{p.student?.user?.name ?? "-"}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">Rp {Number(p.amount).toLocaleString("id-ID")}</td>
                <td className="p-3">{p.due_date?.slice(0, 10)}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                      p.status === "lunas"
                        ? "bg-[#dcebea] text-[#087b79]"
                        : "bg-[#fef3c7] text-[#92400e]"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-[#17345b]" title="Ubah Tagihan">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-red-500" title="Hapus Tagihan">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-[#718086]">
                  Belum ada tagihan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-2rem)] w-full max-w-sm space-y-4 overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-[#17345b]">
              {editing ? "Ubah Tagihan" : "Tambah Tagihan"}
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Pilih Siswa</label>
              <select
                value={data.student_id}
                className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                onChange={(e) => setData("student_id", e.target.value)}
                required
              >
                <option value="">Pilih Siswa</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.user?.name ?? `Siswa #${s.id}`}
                  </option>
                ))}
              </select>
              {errors.student_id && (
                <span className="text-[10px] font-semibold text-[#c0392b]">{errors.student_id}</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Judul Tagihan</label>
              <input
                type="text"
                value={data.title}
                placeholder="Contoh: SPP Januari 2026"
                className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                onChange={(e) => setData("title", e.target.value)}
                required
              />
              {errors.title && (
                <span className="text-[10px] font-semibold text-[#c0392b]">{errors.title}</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Jumlah</label>
              <input
                type="number"
                value={data.amount}
                placeholder="0"
                className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                onChange={(e) => setData("amount", e.target.value)}
                required
              />
              {errors.amount && (
                <span className="text-[10px] font-semibold text-[#c0392b]">{errors.amount}</span>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Status</label>
              <select
                value={data.status}
                className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                onChange={(e) => setData("status", e.target.value as "pending" | "lunas")}
              >
                <option value="pending">Pending</option>
                <option value="lunas">Lunas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17345b] mb-1">Jatuh Tempo</label>
              <input
                type="date"
                value={data.due_date}
                className="w-full rounded-2xl bg-[#edf2f6] p-3 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                onChange={(e) => setData("due_date", e.target.value)}
                required
              />
              {errors.due_date && (
                <span className="text-[10px] font-semibold text-[#c0392b]">{errors.due_date}</span>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-full bg-[#e9eef3] px-4 py-2.5 text-xs font-bold text-[#68777c] shadow-[3px_3px_6px_#cbd3db,-3px_-3px_6px_#fff]">Batal</button>
              <button type="submit" disabled={processing} className="flex-1 rounded-full bg-[#17345b] px-4 py-2.5 text-xs font-bold text-white shadow-[3px_3px_6px_#cbd3db] transition hover:bg-[#102743] disabled:opacity-50">
                {editing ? "Simpan Perubahan" : "Simpan Tagihan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
