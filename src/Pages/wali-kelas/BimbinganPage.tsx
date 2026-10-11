import { useState, useMemo } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  CheckCircle2,
  Phone,
  X,
  Save,
} from "lucide-react";

interface GuidanceLog {
  id: string;
  studentName: string;
  nisn: string;
  category: "Akademik" | "Kedisiplinan" | "Presensi" | "Karakter";
  date: string;
  issue: string;
  actionPlan: string;
  parentContacted: boolean;
  parentPhone: string;
  status: "Dalam Pemantauan" | "Tuntas";
}

export function BimbinganPage() {
  const [logs, setLogs] = useState<GuidanceLog[]>([
    {
      id: "log-1",
      studentName: "Bagas Ramadhan",
      nisn: "0064928111",
      category: "Presensi",
      date: "25 Oktober 2024",
      issue: "Akumulasi ketidakhadiran tanpa keterangan (alpa) mencapai 10 sesi.",
      actionPlan: "Konseling individual, pembuatan komitmen kehadiran tertulis, dan pemanggilan orang tua ke sekolah.",
      parentContacted: true,
      parentPhone: "6281298765432",
      status: "Dalam Pemantauan",
    },
    {
      id: "log-2",
      studentName: "Dimas Pratama",
      nisn: "0064928113",
      category: "Akademik",
      date: "20 Oktober 2024",
      issue: "Penurunan performa pada asesmen tengah semester Fisika Lanjutan (<KKTP).",
      actionPlan: "Pemberian materi pengayaan dan tutor sebaya bersama Alya Putri (Rank #1).",
      parentContacted: false,
      parentPhone: "6281234567890",
      status: "Dalam Pemantauan",
    },
    {
      id: "log-3",
      studentName: "Fajar Nugraha",
      nisn: "0064928115",
      category: "Kedisiplinan",
      date: "14 Oktober 2024",
      issue: "Keterlambatan masuk kelas jam pertama sebanyak 4 kali dalam sebulan.",
      actionPlan: "Pemberian sanksi edukatif merangkum buku literasi dan evaluasi jam keberangkatan dari rumah.",
      parentContacted: true,
      parentPhone: "6281311223344",
      status: "Tuntas",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Dalam Pemantauan" | "Tuntas">("Semua");
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const categories = ["Semua", "Akademik", "Kedisiplinan", "Presensi", "Karakter"];

  // Metrics summary
  const summary = useMemo(() => {
    const total = logs.length;
    const monitoring = logs.filter((l) => l.status === "Dalam Pemantauan").length;
    const resolved = logs.filter((l) => l.status === "Tuntas").length;
    const parentCalls = logs.filter((l) => l.parentContacted).length;
    return { total, monitoring, resolved, parentCalls };
  }, [logs]);

  // Filtered log items
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "Semua" || item.category === categoryFilter;
      const matchStatus = statusFilter === "Semua" || item.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [logs, searchQuery, categoryFilter, statusFilter]);

  const handleCreateLog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newEntry: GuidanceLog = {
      id: `log-${Date.now()}`,
      studentName: String(form.get("studentName")),
      nisn: "0064928120",
      category: form.get("category") as GuidanceLog["category"],
      date: String(form.get("date")),
      issue: String(form.get("issue")),
      actionPlan: String(form.get("actionPlan")),
      parentContacted: Boolean(form.get("parentContacted")),
      parentPhone: String(form.get("parentPhone") || "6281234567890"),
      status: "Dalam Pemantauan",
    };

    setLogs((prev) => [newEntry, ...prev]);
    setModalOpen(false);
    setFeedback(`Catatan pembinaan untuk ${newEntry.studentName} berhasil ditambahkan.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const toggleStatus = (id: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: l.status === "Dalam Pemantauan" ? "Tuntas" : "Dalam Pemantauan",
            }
          : l
      )
    );
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Rombel Binaan • XII MIPA 1
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Catatan Bimbingan & Konseling Kelas
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Dokumentasi pendampingan personal, evaluasi kedisiplinan, dan koordinasi dengan orang tua.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <Plus size={14} />
          Catat Kasus / Pembinaan
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Catatan",
            value: summary.total,
            sub: "Kasus & Pendampingan",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
          {
            label: "Dalam Pemantauan",
            value: summary.monitoring,
            sub: "Butuh Evaluasi Berkala",
            colorText: "text-[#c0392b]",
            isAlert: true,
          },
          {
            label: "Kasus Tuntas",
            value: summary.resolved,
            sub: "Target Pembinaan Selesai",
            colorText: "text-[#087b79]",
            isAlert: false,
          },
          {
            label: "Koordinasi Ortu",
            value: summary.parentCalls,
            sub: "Telah Dikomunikasikan",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] ${
              item.isAlert ? "border-l-4 border-[#ef4444]" : ""
            }`}
          >
            <span className={`block text-[11px] font-bold ${item.colorText}`}>
              {item.label}
            </span>
            <strong className={`mt-1 block text-2xl font-black ${item.colorText}`}>
              {item.value}
            </strong>
            <span className={`text-[10px] ${item.isAlert ? "text-[#c0392b]" : "text-[#68777c]"}`}>
              {item.sub}
            </span>
          </div>
        ))}
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Search size={16} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari nama siswa atau uraian masalah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            />
          </div>

          {/* STATUS TABS */}
          <div className="flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] sm:self-auto">
            {(["Semua", "Dalam Pemantauan", "Tuntas"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                  statusFilter === tab
                    ? "bg-[#17345b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                categoryFilter === cat
                  ? "bg-[#087b79] text-white shadow-sm"
                  : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GUIDANCE LOGS LIST */}
      <div className="space-y-4">
        {filteredLogs.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 sm:p-6 ${
              item.status === "Dalam Pemantauan" ? "border-l-4 border-[#ef4444]" : ""
            }`}
          >
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      {item.date}
                    </span>
                    <span className="text-[#a8b5bc]">•</span>
                    <span className="text-[11px] text-[#718086]">
                      NISN: {item.nisn}
                    </span>
                  </div>

                  <h2 className="mt-1 text-base font-extrabold tracking-tight text-[#20272d]">
                    {item.studentName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className={`self-start rounded-full px-3 py-1 text-[10px] font-extrabold uppercase transition sm:self-auto ${
                    item.status === "Tuntas"
                      ? "bg-[#dcebea] text-[#087b79]"
                      : "bg-[#fadbd8] text-[#c0392b] hover:bg-[#f8b4b4]"
                  }`}
                  title="Klik untuk ubah status"
                >
                  {item.status}
                </button>
              </div>

              {/* URAIAN MASALAH */}
              <div className="mt-3.5 rounded-2xl bg-[#edf2f6] p-3 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
                  Uraian Masalah / Indikasi:
                </span>
                <p className="mt-0.5 leading-relaxed text-[#20272d]">
                  {item.issue}
                </p>
              </div>

              {/* TINDAK LANJUT */}
              <div className="mt-2.5 rounded-2xl bg-[#edf2f6] p-3 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#087b79]">
                  Kesepakatan & Tindak Lanjut Wali Kelas:
                </span>
                <p className="mt-0.5 leading-relaxed text-[#20272d]">
                  {item.actionPlan}
                </p>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-4 flex flex-col gap-2 border-t border-[#d8e1e8] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] text-[#68777c]">
                Status Ortu:{" "}
                <b className={item.parentContacted ? "text-[#087b79]" : "text-[#c0392b]"}>
                  {item.parentContacted ? "Sudah Dihubungi" : "Belum Dikoordinasikan"}
                </b>
              </span>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Yth. Orang Tua dari ${item.studentName}, terkait catatan bimbingan kelas: "${item.issue}", kami mohon waktu untuk tindak lanjut bersama.`;
                    window.open(`https://wa.me/${item.parentPhone}?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#087b79] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#066361]"
                >
                  <Phone size={12} />
                  Hubungi Ortu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <MessageSquare size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada catatan bimbingan ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci pencarian atau ubah filter di atas.
          </p>
        </div>
      )}

      {/* MODAL INPUT LOG BIMBINGAN BARU */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Formulir Bimbingan
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Catat Kasus & Pembinaan Siswa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nama Siswa Binaan
                </label>
                <select
                  name="studentName"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                >
                  <option>Bagas Ramadhan</option>
                  <option>Dimas Pratama</option>
                  <option>Fajar Nugraha</option>
                  <option>Citra Lestari</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kategori Kasus
                  </label>
                  <select
                    name="category"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option>Presensi</option>
                    <option>Akademik</option>
                    <option>Kedisiplinan</option>
                    <option>Karakter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Tanggal Konseling
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue="2024-10-28"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Uraian Masalah / Temuan
                </label>
                <textarea
                  name="issue"
                  placeholder="Jelaskan indikasi permasalahan siswa..."
                  rows={2}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Rencana Tindak Lanjut & Kesepakatan
                </label>
                <textarea
                  name="actionPlan"
                  placeholder="Tuliskan komitmen atau langkah pemecahan masalah..."
                  rows={2}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="parentContacted"
                  name="parentContacted"
                  className="h-4 w-4 rounded accent-[#17345b]"
                />
                <label htmlFor="parentContacted" className="text-xs font-bold text-[#20272d] cursor-pointer">
                  Sudah dikoordinasikan langsung ke orang tua/wali
                </label>
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
                  <Save size={13} />
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}