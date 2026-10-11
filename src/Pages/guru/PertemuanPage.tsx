import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Header, Modal, ModalActions, field } from "./shared";
import { meetings as initialMeetings } from "./data";

interface MeetingItem {
  id?: string;
  title: string;
  subject: string;
  rombel?: string;
  sessionNo?: string;
  date: string;
  students: number;
  status: "Terbit" | "Draft";
  summary?: string;
  filePdf?: string;
  quizStatus?: string;
}

export function PertemuanPage() {
  const [items, setItems] = useState<MeetingItem[]>(() =>
    initialMeetings.map((item, idx) => ({
      id: `meeting-${idx + 1}`,
      title: item.title,
      subject: item.subject,
      rombel: item.subject.includes("XII") ? "XII MIPA 1" : "XI MIPA 2",
      sessionNo: `P${String(idx + 1).padStart(2, "0")}`,
      date: item.date,
      students: Number(item.students) || 36,
      status: (item.status as "Terbit" | "Draft") ?? "Terbit",
      summary:
        "Pendalaman capaian pembelajaran dan aplikasi konsep terapan sesuai capaian tujuan modul.",
      filePdf: `Modul_${item.title.replace(/\s+/g, "_")}.pdf`,
      quizStatus: idx % 2 === 0 ? "Kuis Aktif (34/36 Mengerjakan)" : "Belum Ada Kuis",
    }))
  );

  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRombel, setSelectedRombel] = useState("Semua");
  const [statusTab, setStatusTab] = useState<"Semua" | "Terbit" | "Draft">("Semua");
  const [feedback, setFeedback] = useState("");

  const rombelOptions = ["Semua", "XII MIPA 1", "XI MIPA 2"];

  const filteredMeetings = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRombel =
        selectedRombel === "Semua" || item.rombel === selectedRombel;
      const matchStatus =
        statusTab === "Semua" || item.status === statusTab;
      return matchSearch && matchRombel && matchStatus;
    });
  }, [items, searchQuery, selectedRombel, statusTab]);

  const handleCreateMeeting = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newMeeting: MeetingItem = {
      id: `meeting-${Date.now()}`,
      title: String(form.get("title")),
      subject: String(form.get("subject")),
      rombel: String(form.get("rombel")),
      sessionNo: String(form.get("sessionNo")),
      date: String(form.get("date")),
      students: 36,
      status: "Terbit",
      summary: String(form.get("summary")),
      filePdf: "Modul_Materi_Terbaru.pdf",
      quizStatus: form.get("includeQuiz") ? "Kuis Diterbitkan" : "Belum Ada Kuis",
    };

    setItems((prev) => [newMeeting, ...prev]);
    setModal(false);
    setFeedback(`Pertemuan "${newMeeting.title}" (${newMeeting.sessionNo}) berhasil diterbitkan.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Pertemuan & Modul Pembelajaran"
        description="Kelola alur silabus tatap muka, distribusi modul bacaan, dan asesmen evaluasi per pertemuan."
        action="Buat Pertemuan Baru"
        onAction={() => setModal(true)}
      />

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* SEARCH BOX */}
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder="Cari materi pertemuan atau topik..."
            className="w-full bg-transparent text-xs text-[#20282d] outline-none placeholder:text-[#88989e]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ROMBEL PILLS & STATUS TABS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* ROMBEL FILTER */}
          <div className="flex items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
            {rombelOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRombel(r)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  selectedRombel === r
                    ? "bg-[#17345b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* STATUS TABS */}
          <div className="flex items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
            {(["Semua", "Terbit", "Draft"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusTab(tab)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  statusTab === tab
                    ? "bg-[#087b79] text-white"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* MEETING CARDS LIST */}
      <div className="space-y-4">
        {filteredMeetings.map((item) => (
          <div
            key={item.id ?? item.title}
            className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              {/* LEFT INFO: BADGE + TITLE + DESKRIPSI */}
              <div className="flex items-start gap-4">
                {/* SESSION PILL BADGE */}
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-white shadow-[3px_3px_8px_#cbd3db,-3px_-3px_8px_#fff]">
                  <span className="text-xs font-extrabold">{item.sessionNo}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                      {item.rombel}
                    </span>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      {item.subject}
                    </span>
                    <span className="text-[#a8b5bc]">•</span>
                    <span className="text-[11px] font-medium text-[#68777c]">
                      {item.date}
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                    {item.title}
                  </h2>

                  <p className="max-w-2xl text-xs leading-relaxed text-[#5a6a72]">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* RIGHT STATUS BADGE */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${
                    item.status === "Terbit"
                      ? "bg-[#dcebea] text-[#087b79]"
                      : "bg-[#fef3c7] text-[#b45309]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {/* BOTTOM BAR: LAMPIRAN MODUL + ACTION BUTTONS */}
            <div className="mt-5 flex flex-col gap-3 border-t border-[#d8e1e8] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
              {/* CHIPS: MODUL PDF & STATUS KUIS */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <FileText size={13} className="text-[#17345b]" />
                  <span>{item.filePdf}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <HelpCircle size={13} className="text-[#087b79]" />
                  <span>{item.quizStatus}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Link
                  to="/guru/presensi"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-[11px] font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
                >
                  Presensi Sesi
                </Link>

                <button
                  type="button"
                  onClick={() => setModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743]"
                >
                  Kelola Modul
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredMeetings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Layers size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada pertemuan ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci atau filter rombel dan status di atas.
          </p>
        </div>
      )}

      {/* MODAL BUAT / EDIT PERTEMUAN */}
      {modal && (
        <Modal
          title="Buat Pertemuan & Publikasi Modul"
          description="Rancang silabus tatap muka, rangkuman instruksional, dan modul referensi belajar siswa."
          onClose={() => setModal(false)}
        >
          <form onSubmit={handleCreateMeeting}>
            {/* GRID MAPEL & ROMBEL */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#17345b]">
                Mata Pelajaran
                <select className={`${field} mt-1`} name="subject" required>
                  <option>Matematika Peminatan</option>
                  <option>Fisika Lanjutan</option>
                  <option>Matematika Wajib</option>
                </select>
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Rombel Belajar
                <select className={`${field} mt-1`} name="rombel" required>
                  <option>XII MIPA 1</option>
                  <option>XI MIPA 2</option>
                </select>
              </label>
            </div>

            {/* NOMOR SESI & TANGGAL */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#17345b]">
                Nomor Pertemuan
                <select className={`${field} mt-1`} name="sessionNo" defaultValue="P05">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const no = `P${String(i + 1).padStart(2, "0")}`;
                    return <option key={no} value={no}>Pertemuan {i + 1} ({no})</option>;
                  })}
                </select>
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Tanggal Pelaksanaan Sesi
                <input
                  className={`${field} mt-1`}
                  name="date"
                  type="date"
                  defaultValue="2024-10-28"
                  required
                />
              </label>
            </div>

            {/* JUDUL PERTEMUAN */}
            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Judul / Topik Pertemuan
              <input
                className={`${field} mt-1`}
                name="title"
                placeholder="Contoh: Aplikasi Turunan dan Gradien Garis Singgung"
                required
              />
            </label>

            {/* RANGKUMAN MATERI */}
            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Rangkuman & Tujuan Pembelajaran
              <textarea
                className={`${field} mt-1 min-h-24`}
                name="summary"
                placeholder="Tuliskan rangkuman capaian kompetensi yang diharapkan..."
                required
              />
            </label>

            {/* UPLOAD BERKAS MODUL PDF */}
            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Berkas Modul Pelajaran (PDF)
              <input
                className={`${field} mt-1 cursor-pointer`}
                accept="application/pdf"
                type="file"
              />
            </label>

            {/* TOGGLE KUIS LANGSUNG */}
            <label className="mt-4 flex items-center gap-2.5 text-xs font-bold text-[#20272d] cursor-pointer">
              <input
                type="checkbox"
                name="includeQuiz"
                className="h-4 w-4 rounded accent-[#17345b]"
              />
              <span>Aktifkan paket kuis evaluasi otomatis untuk pertemuan ini</span>
            </label>

            <ModalActions
              onClose={() => setModal(false)}
              label="Terbitkan Pertemuan"
            />
          </form>
        </Modal>
      )}
    </section>
  );
}