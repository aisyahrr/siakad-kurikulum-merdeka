import { useState } from "react";
import { CheckCircle2, Plus, Send, X } from "lucide-react";

interface LeaveHistory {
  id: string;
  category: "Sakit" | "Izin Dispensasi";
  date: string;
  reason: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
}

export function PresensiAnakPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const attendanceStats = {
    hadir: 58,
    izin: 2,
    sakit: 0,
    alpa: 0,
    totalSessions: 60,
    rate: 96.7,
  };

  const [history, setHistory] = useState<LeaveHistory[]>([
    {
      id: "1",
      category: "Izin Dispensasi",
      date: "14 Oktober 2024",
      reason: "Acara keluarga di luar kota terkonfirmasi wali kelas.",
      status: "Disetujui",
    },
    {
      id: "2",
      category: "Izin Dispensasi",
      date: "02 September 2024",
      reason: "Mengikuti tes sertifikasi bahasa inggris tingkat provinsi.",
      status: "Disetujui",
    },
  ]);

  const handleSubmitLeave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newEntry: LeaveHistory = {
      id: String(Date.now()),
      category: form.get("category") as LeaveHistory["category"],
      date: String(form.get("date")),
      reason: String(form.get("reason")),
      status: "Menunggu",
    };

    setHistory((prev) => [newEntry, ...prev]);
    setModalOpen(false);
    setFeedback(
      "Permohonan izin berhasil diajukan dan sedang menunggu verifikasi wali kelas.",
    );
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Alya Putri • XII MIPA 1
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Presensi & Pengajuan Izin
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Riwayat kehadiran anak dan form permohonan surat izin/sakit
            terverifikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <Plus size={14} />
          Ajukan Surat Izin / Sakit
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Tingkat Kehadiran",
            value: `${attendanceStats.rate}%`,
            sub: "Akumulasi Semester",
            color: "text-[#087b79]",
          },
          {
            label: "Hadir",
            value: attendanceStats.hadir,
            sub: "Sesi Tatap Muka",
            color: "text-[#17345b]",
          },
          {
            label: "Izin",
            value: attendanceStats.izin,
            sub: "Dispensasi Disetujui",
            color: "text-[#566573]",
          },
          {
            label: "Sakit",
            value: attendanceStats.sakit,
            sub: "Surat Dokter",
            color: "text-[#d97706]",
          },
          {
            label: "Alpa",
            value: attendanceStats.alpa,
            sub: "Tanpa Keterangan",
            color: "text-[#ef4444]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
          >
            <span className={`block text-[11px] font-bold ${item.color}`}>
              {item.label}
            </span>
            <strong className={`mt-1 block text-2xl font-black ${item.color}`}>
              {item.value}
            </strong>
            <span className="text-[10px] text-[#68777c]">{item.sub}</span>
          </div>
        ))}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#17345b] pb-3 border-b border-[#d8e1e8]">
          Riwayat Pengajuan Izin / Sakit
        </h2>

        <div className="mt-4 space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] gap-2 sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs font-bold text-[#20272d]">
                    {item.category}
                  </strong>
                  <span className="text-[10px] text-[#718086]">
                    • {item.date}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#526066] leading-relaxed">
                  {item.reason}
                </p>
              </div>
              <span
                className={`self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase sm:self-auto ${
                  item.status === "Disetujui"
                    ? "bg-[#dcebea] text-[#087b79]"
                    : item.status === "Ditolak"
                      ? "bg-[#fadbd8] text-[#c0392b]"
                      : "bg-[#fef3c7] text-[#b45309]"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <h3 className="text-base font-extrabold text-[#17345b]">
                Form Pengajuan Izin Siswa
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Kategori Permohonan
                </label>
                <select
                  name="category"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                >
                  <option value="Sakit">Sakit</option>
                  <option value="Izin Dispensasi">Izin Dispensasi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Tanggal Ketidakhadiran
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue="2024-10-28"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Alasan / Keterangan
                </label>
                <textarea
                  name="reason"
                  placeholder="Tuliskan keterangan detail sakit atau permohonan izin..."
                  rows={2}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Lampiran Surat Bukti (Opsional)
                </label>
                <input
                  type="file"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Send size={13} /> Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
