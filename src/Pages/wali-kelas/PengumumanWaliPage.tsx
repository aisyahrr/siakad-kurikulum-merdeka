import { useState, useMemo } from "react";
import {
  Megaphone,
  Search,
  Plus,
  Calendar,
  FileText,
  Download,
  ArrowRight,
  AlertCircle,
  X,
  CheckCircle2,
  Send,
} from "lucide-react";

interface WaliAnnouncement {
  id: string;
  title: string;
  category: "Akademik" | "Pertemuan Ortu" | "Disiplin & Tata Tertib" | "Darurat";
  targetAudience: "Semua" | "Siswa Rombel" | "Wali Murid";
  date: string;
  author: string;
  excerpt: string;
  content: string;
  attachmentName?: string;
  isUrgent: boolean;
}

export function PengumumanWaliPage() {
  const [announcements, setAnnouncements] = useState<WaliAnnouncement[]>([
    {
      id: "ann-1",
      title: "Undangan Rapat Evaluasi Capaian Belajar Tengah Semester (STS)",
      category: "Pertemuan Ortu",
      targetAudience: "Wali Murid",
      date: "26 Oktober 2024",
      author: "Drs. Hendra Setiawan (Wali Kelas)",
      excerpt: "Mengundang bapak/ibu orang tua/wali murid XII MIPA 1 dalam rangka koordinasi hasil belajar dan penguatan karakter siswa.",
      content: "Yth. Bapak/Ibu Orang Tua/Wali Murid kelas XII MIPA 1, sehubungan dengan telah berakhirnya masa Asesmen Sumatif Tengah Semester (STS) Ganjil, kami mengundang kehadiran Bapak/Ibu pada hari Sabtu, 2 November 2024 pukul 09.00 WIB bertempat di Ruang Kelas XII MIPA 1. Agenda rapat meliputi evaluasi capaian KKTP dan persiapan menuju ujian semester.",
      attachmentName: "Undangan_Rapat_Wali_Murid_XII_MIPA1.pdf",
      isUrgent: true,
    },
    {
      id: "ann-2",
      title: "Jadwal Pengumpulan Berkas Dispensasi dan Surat Dokter",
      category: "Disiplin & Tata Tertib",
      targetAudience: "Siswa Rombel",
      date: "23 Oktober 2024",
      author: "Drs. Hendra Setiawan (Wali Kelas)",
      excerpt: "Batas akhir verifikasi surat izin ketidakhadiran bulan Oktober maksimal diserahkan setiap hari Jumat pukul 15.00 WIB.",
      content: "Diberitahukan kepada seluruh siswa kelas XII MIPA 1, segala bentuk ketidakhadiran karena sakit wajib melampirkan surat dokter asli dan diserahkan ke meja wali kelas atau diunggah mandiri via SIAKAD paling lambat 2 hari setelah masa sakit berakhir agar tidak tercatat alpa.",
      isUrgent: false,
    },
    {
      id: "ann-3",
      title: "Pemberitahuan Pendampingan Tambahan (Tutor Sebaya)",
      category: "Akademik",
      targetAudience: "Semua",
      date: "18 Oktober 2024",
      author: "Drs. Hendra Setiawan (Wali Kelas)",
      excerpt: "Program klinik belajar mandiri mata pelajaran Matematika Peminatan dan Fisika setiap hari Rabu setelah jam KBM.",
      content: "Dalam rangka mitigasi capaian KKTP bagi siswa yang memerlukan penguatan materi terapan, mulai pekan depan diadakan sesi klinik belajar bersama perwakilan siswa berprestasi. Kegiatan ini bersifat terbuka dan didampingi langsung oleh guru mapel terkait.",
      attachmentName: "Jadwal_Klinik_Belajar_Rombel.pdf",
      isUrgent: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<WaliAnnouncement | null>(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [feedback, setFeedback] = useState("");

  const audienceFilters = ["Semua", "Wali Murid", "Siswa Rombel"];

  // Top summary metrics
  const summary = useMemo(() => {
    const total = announcements.length;
    const urgent = announcements.filter((a) => a.isUrgent).length;
    const forParents = announcements.filter((a) => a.targetAudience === "Wali Murid").length;
    const hasDoc = announcements.filter((a) => a.attachmentName).length;
    return { total, urgent, forParents, hasDoc };
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAudience =
        selectedAudience === "Semua" || item.targetAudience === selectedAudience;
      return matchSearch && matchAudience;
    });
  }, [announcements, searchQuery, selectedAudience]);

  const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newEntry: WaliAnnouncement = {
      id: `ann-${Date.now()}`,
      title: String(form.get("title")),
      category: form.get("category") as WaliAnnouncement["category"],
      targetAudience: form.get("targetAudience") as WaliAnnouncement["targetAudience"],
      date: "Hari Ini",
      author: "Drs. Hendra Setiawan (Wali Kelas)",
      excerpt: String(form.get("excerpt")),
      content: String(form.get("content")),
      attachmentName: form.get("hasDoc") ? "Lampiran_Warta_Rombel.pdf" : undefined,
      isUrgent: Boolean(form.get("isUrgent")),
    };

    setAnnouncements((prev) => [newEntry, ...prev]);
    setModalCreate(false);
    setFeedback(`Pengumuman "${newEntry.title}" berhasil diterbitkan.`);
    setTimeout(() => setFeedback(""), 4000);
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
            Warta & Pengumuman Rombel
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Pusat penyampaian informasi kelas, edaran pertemuan wali murid, dan warta internal rombel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalCreate(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <Plus size={14} />
          Terbitkan Warta Kelas
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Warta",
            value: summary.total,
            sub: "Edaran Terbit di Rombel",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
          {
            label: "Mendesak / Penting",
            value: summary.urgent,
            sub: "Perlu Tindak Cepat",
            colorText: "text-[#c0392b]",
            isAlert: true,
          },
          {
            label: "Untuk Orang Tua",
            value: summary.forParents,
            sub: "Pemberitahuan Wali Murid",
            colorText: "text-[#087b79]",
            isAlert: false,
          },
          {
            label: "Berkas Resmi",
            value: summary.hasDoc,
            sub: "Dilengkapi Unduhan PDF",
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder="Cari pengumuman kelas atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
          />
        </div>

        {/* AUDIENCE FILTER PILLS */}
        <div className="flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] sm:self-auto">
          {audienceFilters.map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => setSelectedAudience(aud)}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                selectedAudience === aud
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      </div>

      {/* LIST WARTA / ANNOUNCEMENTS */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 sm:p-6 ${
              item.isUrgent ? "border-l-4 border-[#ef4444]" : ""
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] ${
                  item.isUrgent ? "bg-[#fadbd8] text-[#c0392b]" : "bg-[#edf2f6] text-[#17345b]"
                }`}
              >
                <Megaphone size={20} strokeWidth={2.2} />
              </span>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-[#edf2f6] px-2.5 py-0.5 text-[10px] font-bold text-[#475569]">
                    Target: {item.targetAudience}
                  </span>

                  {item.isUrgent && (
                    <span className="rounded-full bg-[#fadbd8] px-2.5 py-0.5 text-[10px] font-extrabold text-[#c0392b]">
                      Penting
                    </span>
                  )}

                  <span className="text-[#a8b5bc]">•</span>

                  <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#68777c]">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h2 className="text-base font-extrabold leading-snug tracking-tight text-[#20272d]">
                  {item.title}
                </h2>

                <p className="max-w-3xl text-xs leading-relaxed text-[#5a6a72]">
                  {item.excerpt}
                </p>
              </div>
            </div>

            {/* BOTTOM BAR: LAMPIRAN & ACTION */}
            <div className="mt-4 flex flex-col gap-3 border-t border-[#d8e1e8] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {item.attachmentName ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3.5 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                    <FileText size={13} className="text-[#17345b]" />
                    <span>Lampiran: {item.attachmentName}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#86959c]">Tidak ada lampiran dokumen</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(item)}
                className="inline-flex items-center gap-1.5 self-end rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
              >
                Baca Lengkap
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredAnnouncements.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <AlertCircle size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada pengumuman kelas ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci atau ubah filter audiens penerima di atas.
          </p>
        </div>
      )}

      {/* MODAL TERBITKAN WARTA KELAS */}
      {modalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Publikasi Rombel
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Terbitkan Warta / Pengumuman Kelas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCreate(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Judul Pengumuman
                </label>
                <input
                  name="title"
                  placeholder="Contoh: Jadwal Pembagian Rapor Siswa & Evaluasi Kelas"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kategori
                  </label>
                  <select
                    name="category"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option>Pertemuan Ortu</option>
                    <option>Akademik</option>
                    <option>Disiplin & Tata Tertib</option>
                    <option>Darurat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Target Audiens
                  </label>
                  <select
                    name="targetAudience"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option>Wali Murid</option>
                    <option>Siswa Rombel</option>
                    <option>Semua</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Ringkasan Singkat (Excerpt)
                </label>
                <input
                  name="excerpt"
                  placeholder="Ringkasan 1-2 kalimat untuk pratinjau kartu..."
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Isi Pengumuman Lengkap
                </label>
                <textarea
                  name="content"
                  placeholder="Tuliskan uraian instruksi, agenda, tempat, dan waktu..."
                  rows={3}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-[#20272d] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    className="h-4 w-4 rounded accent-[#ef4444]"
                  />
                  <span>Tandai Sebagai Mendesak (Penting)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#20272d] cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasDoc"
                    className="h-4 w-4 rounded accent-[#17345b]"
                  />
                  <span>Sertakan Contoh PDF</span>
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalCreate(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Send size={13} />
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BACA DETAIL PENGUMUMAN */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#d8e1e8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#17345b]">
                    {selectedItem.category}
                  </span>
                  <span className="text-[11px] font-semibold text-[#68777c]">
                    {selectedItem.date}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-extrabold text-[#17345b]">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-[#edf2f6] p-4 text-xs leading-relaxed text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <p>{selectedItem.content}</p>
              </div>

              {selectedItem.attachmentName && (
                <div className="flex items-center justify-between rounded-2xl bg-[#e9eef3] p-3 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
                  <div className="flex items-center gap-2.5">
                    <FileText size={18} className="text-[#087b79]" />
                    <div>
                      <strong className="block text-xs font-bold text-[#20272d]">
                        {selectedItem.attachmentName}
                      </strong>
                      <span className="text-[11px] text-[#68777c]">Dokumen Surat Resmi (PDF)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Mengunduh ${selectedItem.attachmentName}...`)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#087b79] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#066361]"
                  >
                    <Download size={13} />
                    Unduh
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#d8e1e8] pt-3.5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}