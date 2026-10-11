import { useState, useMemo } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  AlertCircle,
  Sparkles,
  FileEdit,
  Save,
  Check,
} from "lucide-react";
import { Header, Modal, ModalActions, field } from "./shared";
import { quizzes as initialQuizzes } from "./data";

/* ==========================================================================
   1. HALAMAN KUIS & UJIAN (+ MODAL KOREKSI ESSAY SPLIT-VIEW)
   ========================================================================== */
interface QuizItem {
  id?: string;
  title: string;
  subject: string;
  rombel?: string;
  type: string;
  duration?: number;
  mcqCount?: number;
  essayCount?: number;
  responses: number;
  totalStudents?: number;
  status: "Terbit" | "Draft";
}

interface StudentSubmission {
  id: string;
  name: string;
  nisn: string;
  mcqScore: number;
  essayScore: number | null;
  essayAnswer: string;
  feedback: string;
  isGraded: boolean;
}

export function KuisPage() {
  const [items, setItems] = useState<QuizItem[]>(() =>
    initialQuizzes.map((item, idx) => ({
      id: `quiz-${idx + 1}`,
      title: item.title,
      subject: item.subject,
      rombel: "XII MIPA 1",
      type: item.type,
      duration: idx % 2 === 0 ? 45 : 60,
      mcqCount: 15,
      essayCount: 3,
      responses: Number(item.responses) || 32,
      totalStudents: 36,
      status: (item.status as "Terbit" | "Draft") ?? "Terbit",
    }))
  );

  const [modalCreate, setModalCreate] = useState(false);
  const [modalGrading, setModalGrading] = useState<QuizItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Terbit" | "Draft">("Semua");
  const [feedbackAlert, setFeedbackAlert] = useState("");

  // Data dummy siswa yang mengumpulkan essay untuk modal koreksi
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    {
      id: "sub-1",
      name: "Alya Putri",
      nisn: "0064928110",
      mcqScore: 50, // Dari maks 50
      essayScore: 42,
      essayAnswer:
        "Metode integral substitusi digunakan ketika ada fungsi dan turunannya saling berkorelasi langsung dalam satu integran f(g(x))g'(x).",
      feedback: "Pemahaman konsep sudah tepat dan penjabaran rumus runtut.",
      isGraded: true,
    },
    {
      id: "sub-2",
      name: "Bagas Ramadhan",
      nisn: "0064928111",
      mcqScore: 35,
      essayScore: null,
      essayAnswer:
        "Substitusi dilakukan dengan mengganti x menjadi variabel u agar lebih mudah diintegralkan secara langsung tanpa faktorisasi panjang.",
      feedback: "",
      isGraded: false,
    },
    {
      id: "sub-3",
      name: "Citra Lestari",
      nisn: "0064928112",
      mcqScore: 45,
      essayScore: null,
      essayAnswer:
        "Langkah pertama tentukan variabel pemisalan u = g(x), kemudian cari turunan du/dx untuk mengganti diferensial dx pada fungsi awal.",
      feedback: "",
      isGraded: false,
    },
  ]);

  const [activeSubmissionId, setActiveSubmissionId] = useState<string>("sub-2");
  const activeSubmission = submissions.find((s) => s.id === activeSubmissionId) ?? submissions[0];

  const [currentEssayInput, setCurrentEssayInput] = useState<number>(activeSubmission.essayScore ?? 0);
  const [currentFeedbackInput, setCurrentFeedbackInput] = useState<string>(activeSubmission.feedback);

  // Sync saat pindah siswa
  const selectStudentForGrading = (sub: StudentSubmission) => {
    setActiveSubmissionId(sub.id);
    setCurrentEssayInput(sub.essayScore ?? 0);
    setCurrentFeedbackInput(sub.feedback);
  };

  const handleSaveGrading = () => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === activeSubmissionId
          ? {
              ...s,
              essayScore: currentEssayInput,
              feedback: currentFeedbackInput,
              isGraded: true,
            }
          : s
      )
    );
    setFeedbackAlert(`Nilai essay ${activeSubmission.name} berhasil disimpan.`);
    setTimeout(() => setFeedbackAlert(""), 3500);
  };

  const filteredQuizzes = useMemo(() => {
    return items.filter((q) => {
      const matchSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "Semua" || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const handleCreateQuiz = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newQuiz: QuizItem = {
      id: `quiz-${Date.now()}`,
      title: String(form.get("title")),
      subject: String(form.get("subject")),
      rombel: String(form.get("rombel")),
      type: String(form.get("type")),
      duration: Number(form.get("duration")) || 45,
      mcqCount: Number(form.get("mcqCount")) || 10,
      essayCount: Number(form.get("essayCount")) || 2,
      responses: 0,
      totalStudents: 36,
      status: "Terbit",
    };

    setItems((prev) => [newQuiz, ...prev]);
    setModalCreate(false);
    setFeedbackAlert(`Paket evaluasi "${newQuiz.title}" berhasil diterbitkan.`);
    setTimeout(() => setFeedbackAlert(""), 4000);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Kuis & Evaluasi Pembelajaran"
        description="Rancang paket asesmen formatif atau sumatif, batas waktu pengerjaan, dan pantau pengumpulan jawaban siswa."
        action="Buat Paket Kuis"
        onAction={() => setModalCreate(true)}
      />

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder="Cari judul kuis atau mata pelajaran..."
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
          {(["Semua", "Terbit", "Draft"] as const).map((tab) => (
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

      {/* FEEDBACK ALERT */}
      {feedbackAlert && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedbackAlert}</span>
        </div>
      )}

      {/* QUIZ CARDS LIST */}
      <div className="space-y-4">
        {filteredQuizzes.map((item) => (
          <div
            key={item.id ?? item.title}
            className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 hover:-translate-y-0.5 sm:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <ClipboardCheck size={22} />
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                      {item.rombel}
                    </span>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      {item.subject}
                    </span>
                    <span className="text-[#a8b5bc]">•</span>
                    <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#475569]">
                      {item.type}
                    </span>
                  </div>

                  <h2 className="text-base font-extrabold tracking-tight text-[#20272d]">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#68777c]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-[#17345b]" />
                      Durasi: {item.duration} Menit
                    </span>
                    <span>•</span>
                    <span>
                      {item.mcqCount} Pilihan Ganda · {item.essayCount} Esei
                    </span>
                  </div>
                </div>
              </div>

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

            {/* BOTTOM BAR: RESPONSES BAR & ACTIONS */}
            <div className="mt-5 flex flex-col gap-3 border-t border-[#d8e1e8] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2f6] px-3.5 py-1 text-[11px] font-semibold text-[#5a6a72] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                <Sparkles size={13} className="text-[#087b79]" />
                <span>
                  Respons Masuk: <strong className="text-[#17345b]">{item.responses}</strong> / {item.totalStudents ?? 36} Siswa
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setModalCreate(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-[11px] font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
                >
                  Edit Paket
                </button>

                <button
                  type="button"
                  onClick={() => setModalGrading(item)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743]"
                >
                  <FileEdit size={13} />
                  Koreksi Jawaban
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredQuizzes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <ClipboardCheck size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada paket kuis ditemukan
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Coba sesuaikan kata kunci pencarian atau ubah filter status di atas.
          </p>
        </div>
      )}

      {/* MODAL BUAT KUIS BARU */}
      {modalCreate && (
        <Modal
          title="Buat Kuis & Evaluasi Baru"
          description="Atur rincian penilaian pembelajaran, komposisi butir soal, dan durasi pengerjaan siswa."
          onClose={() => setModalCreate(false)}
        >
          <form onSubmit={handleCreateQuiz}>
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
                Rombel Target
                <select className={`${field} mt-1`} name="rombel" required>
                  <option>XII MIPA 1</option>
                  <option>XI MIPA 2</option>
                </select>
              </label>
            </div>

            <label className="mt-3 block text-xs font-bold text-[#17345b]">
              Judul Asesmen / Evaluasi
              <input
                className={`${field} mt-1`}
                name="title"
                placeholder="Contoh: Evaluasi Formatif Vektor dan Geometri Ruang"
                required
              />
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#17345b]">
                Tipe Asesmen
                <select className={`${field} mt-1`} name="type" defaultValue="Formatif">
                  <option value="Formatif">Formatif (Kuis Harian)</option>
                  <option value="Sumatif">Sumatif (Ujian Blok / STS)</option>
                </select>
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Batas Waktu (Menit)
                <input
                  className={`${field} mt-1`}
                  name="duration"
                  type="number"
                  min="5"
                  max="180"
                  defaultValue="45"
                  required
                />
              </label>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-[#17345b]">
                Jumlah Soal Pilihan Ganda (Auto-Scored)
                <input
                  className={`${field} mt-1`}
                  name="mcqCount"
                  type="number"
                  min="0"
                  defaultValue="15"
                />
              </label>

              <label className="block text-xs font-bold text-[#17345b]">
                Jumlah Soal Esei (Koreksi Manual)
                <input
                  className={`${field} mt-1`}
                  name="essayCount"
                  type="number"
                  min="0"
                  defaultValue="3"
                />
              </label>
            </div>

            <ModalActions
              onClose={() => setModalCreate(false)}
              label="Terbitkan Paket Evaluasi"
            />
          </form>
        </Modal>
      )}

      {/* MODAL KOREKSI ASESMEN ESSAY (SPLIT-VIEW) */}
      {modalGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-[32px] bg-[#e9eef3] p-6 shadow-[10px_10px_25px_#b8c2cc]">
            {/* MODAL TOP BAR */}
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  Koreksi Jawaban Essay Siswa
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  {modalGrading.title} — {modalGrading.rombel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalGrading(null)}
                className="rounded-full bg-[#e9eef3] px-3.5 py-1 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              >
                Tutup [ESC]
              </button>
            </div>

            {/* SPLIT CANVAS CONTAINER */}
            <div className="mt-4 grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-[300px_1fr]">
              {/* SISI KIRI: DAFTAR SISWA */}
              <div className="flex flex-col rounded-2xl bg-[#edf2f6] p-3 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <span className="mb-2 block px-2 text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
                  Antrean Respons ({submissions.length})
                </span>
                <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
                  {submissions.map((sub) => {
                    const isActive = sub.id === activeSubmissionId;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => selectStudentForGrading(sub)}
                        className={`w-full rounded-xl p-2.5 text-left transition ${
                          isActive
                            ? "bg-[#17345b] text-white shadow-sm"
                            : "bg-[#e9eef3] text-[#20272d] hover:bg-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold">{sub.name}</strong>
                          {sub.isGraded ? (
                            <Check size={13} className={isActive ? "text-[#34d399]" : "text-[#087b79]"} />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] opacity-80">
                          <span>PG: {sub.mcqScore}/50</span>
                          <span>Essay: {sub.essayScore !== null ? `${sub.essayScore}/50` : "Pending"}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SISI KANAN: WORKSPACE KOREKSI */}
              <div className="flex flex-col justify-between overflow-y-auto pr-2">
                <div className="space-y-4">
                  {/* INFORMASI BUTIR SOAL */}
                  <div className="rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#087b79]">
                      Butir Soal Essay #1 (Bobot Maks: 50 Poin)
                    </span>
                    <p className="mt-1 text-xs font-bold leading-relaxed text-[#20272d]">
                      Jelaskan prinsip dasar metode integrasi substitusi aljabar dan berikan skenario kapan metode ini mutlak digunakan!
                    </p>
                  </div>

                  {/* JAWABAN SISWA */}
                  <div>
                    <span className="text-[11px] font-bold text-[#68777c]">
                      Jawaban dari {activeSubmission.name}:
                    </span>
                    <div className="mt-1 rounded-2xl bg-[#edf2f6] p-4 text-xs leading-relaxed text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                      "{activeSubmission.essayAnswer}"
                    </div>
                  </div>

                  {/* RUBRIK SCORE & FEEDBACK FORM */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#17345b]">
                        Nilai Essay (0–50)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={currentEssayInput}
                        onChange={(e) => setCurrentEssayInput(Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
                        className="mt-1 w-full rounded-xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                      />
                    </div>

                    <div className="flex flex-col justify-center rounded-xl bg-[#e9eef3] p-2.5 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                      <span className="text-[10px] font-bold text-[#68777c]">Kalkulasi Nilai Akhir:</span>
                      <strong className="text-sm font-extrabold text-[#17345b]">
                        {activeSubmission.mcqScore + currentEssayInput} / 100
                      </strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17345b]">
                      Catatan Evaluasi / Feedback Guru:
                    </label>
                    <textarea
                      value={currentFeedbackInput}
                      onChange={(e) => setCurrentFeedbackInput(e.target.value)}
                      placeholder="Berikan catatan perbaikan atau apresiasi terhadap hasil jawaban siswa..."
                      className="mt-1 min-h-20 w-full rounded-xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#d8e1e8] pt-3">
                  <button
                    type="button"
                    onClick={handleSaveGrading}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743]"
                  >
                    <Save size={14} />
                    Simpan Nilai & Berikan Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ==========================================================================
   2. HALAMAN MATRIKS SISWA & ANALITIK
   ========================================================================== */
interface MatrixStudentItem {
  id: string;
  name: string;
  nisn: string;
  m1: boolean;
  m2: boolean;
  m3: boolean;
  quizScore: number;
}

export function MatriksPage() {
  const [selectedClass, setSelectedClass] = useState("XII MIPA 1");
  const [searchStudent, setSearchStudent] = useState("");

  const studentData: MatrixStudentItem[] = [
    { id: "1", name: "Alya Putri", nisn: "0064928110", m1: true, m2: true, m3: true, quizScore: 92 },
    { id: "2", name: "Bagas Ramadhan", nisn: "0064928111", m1: true, m2: false, m3: false, quizScore: 68 },
    { id: "3", name: "Citra Lestari", nisn: "0064928112", m1: true, m2: true, m3: true, quizScore: 86 },
    { id: "4", name: "Dimas Pratama", nisn: "0064928113", m1: true, m2: true, m3: false, quizScore: 78 },
    { id: "5", name: "Eka Rahmawati", nisn: "0064928114", m1: true, m2: true, m3: true, quizScore: 95 },
  ];

  const filtered = studentData.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Matriks Penyelesaian & KKTP Siswa"
        description="Pantau pemenuhan silabus modul bacaan dan evaluasi ketercapaian tujuan pembelajaran siswa."
      />

      {/* TOP STATS & FILTER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ROMBEL PILL SELECTOR */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
          {["XII MIPA 1", "XI MIPA 2"].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition ${
                selectedClass === cls
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* KKTP SUMMARY METRICS */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcebea] px-3.5 py-1.5 text-xs font-bold text-[#087b79]">
            <CheckCircle2 size={13} /> 80% Siswa Tuntas KKTP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fadbd8] px-3.5 py-1.5 text-xs font-bold text-[#c0392b]">
            <AlertCircle size={13} /> 1 Perlu Remedial
          </span>
        </div>
      </div>

      {/* MATRIX TABLE CARD */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-72">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari siswa dalam matriks..."
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
          </div>
          <span className="text-[11px] font-bold text-[#68777c] hidden sm:block">
            Target Capaian KKTP: 70.0
          </span>
        </div>

        {/* TABLE CONTENT */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[11px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Modul 01</th>
                <th className="py-3 px-3 text-center">Modul 02</th>
                <th className="py-3 px-3 text-center">Modul 03</th>
                <th className="py-3 px-3 text-center">Rata-rata Kuis</th>
                <th className="py-3 px-3 text-center">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filtered.map((student) => {
                const isPassed = student.quizScore >= 70;

                return (
                  <tr key={student.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">{student.name}</strong>
                      <span className="text-[11px] text-[#718086]">NISN: {student.nisn}</span>
                    </td>

                    {/* MODUL 1 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                        <CheckCircle2 size={15} />
                      </span>
                    </td>

                    {/* MODUL 2 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      {student.m2 ? (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <CheckCircle2 size={15} />
                        </span>
                      ) : (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#b45309] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <AlertCircle size={15} />
                        </span>
                      )}
                    </td>

                    {/* MODUL 3 CHECK */}
                    <td className="py-3.5 px-3 text-center">
                      {student.m3 ? (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <CheckCircle2 size={15} />
                        </span>
                      ) : (
                        <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#edf2f6] text-[#94a3b8] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                          <span className="text-[10px] font-bold">—</span>
                        </span>
                      )}
                    </td>

                    {/* SKOR KUIS */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold text-[#17345b] text-sm">
                        {student.quizScore}
                      </span>
                    </td>

                    {/* STATUS PILL */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                          isPassed
                            ? "bg-[#dcebea] text-[#087b79]"
                            : "bg-[#fadbd8] text-[#c0392b]"
                        }`}
                      >
                        {isPassed ? "Tuntas KKTP" : "Perlu Remedial"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}