import {
  Award,
  Download,
  Calculator,
  FlaskConical,
  Microscope,
  Languages,
  BookOpen,
  CircleDot,
  Headphones,
  Plus,
  History,
  UserRound,
} from "lucide-react";
import { Card } from "@/Components/ui/Card";
import { PageTitle } from "@/Components/ui/PageTitle";
import { useGrades } from "@/Hooks/siswa/useGrades";

function SubjectIcon({ type }: { type: string }) {
  switch (type) {
    case "calculator":
      return <Calculator size={18} />;
    case "physics":
      return <FlaskConical size={18} />;
    case "chemistry":
      return <Microscope size={18} />;
    case "biology":
      return <CircleDot size={18} />;
    case "english":
      return <Languages size={18} />;
    default:
      return <BookOpen size={18} />;
  }
}

export function GradesPage() {
  const {
    semester,
    setSemester,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredGrades,
    stats,
    handlePrint,
  } = useGrades();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageTitle
        eyebrow="LAPORAN PRESTASI AKADEMIK"
        title="Nilai & Hasil Studi"
        description="Rekapitulasi pencapaian kompetensi dan evaluasi belajar semester ganjil."
        action={
          <>
            {/* SEMESTER SWITCH */}
            <div className="flex items-center rounded-full bg-[#e9eef3] p-1 shadow-[inset_2px_2px_6px_#cbd3db,inset_-2px_-2px_6px_#fff]">
              <button
                type="button"
                onClick={() => setSemester("Ganjil")}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold transition ${
                  semester === "Ganjil"
                    ? "bg-[#edf2f5] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                    : "text-[#7b878d]"
                }`}
              >
                Semester Ganjil
              </button>

              <button
                type="button"
                onClick={() => setSemester("Genap")}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold transition ${
                  semester === "Genap"
                    ? "bg-[#edf2f5] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                    : "text-[#7b878d]"
                }`}
              >
                Semester Genap
              </button>
            </div>

            {/* DOWNLOAD PDF */}
            <button
              type="button"
              onClick={handlePrint}
              title="Unduh / Cetak Transkrip"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#e9eef3] text-[#4f5d64] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:-translate-y-0.5"
            >
              <Download size={15} />
            </button>
          </>
        }
      />

      {/* MAIN SUMMARY */}
      <Card>
        <div className="relative overflow-hidden rounded-[26px] bg-[#e9eef3] p-5 shadow-[8px_8px_17px_#cbd3db,-8px_-8px_17px_#fff] md:p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#c9f4f0] opacity-50 blur-3xl" />

          <div className="relative">
            <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr_1fr_1fr]">
              {/* IPK */}
              <div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-[#17345b]" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#68777c]">
                    Indeks Prestasi Kumulatif
                  </span>
                </div>

                <div className="mt-2 flex items-end gap-2">
                  <strong className="text-4xl font-bold text-[#20272d] md:text-[40px]">
                    {stats.gpa}
                  </strong>
                  <span className="mb-1 text-sm text-[#68777c]">/ 100</span>
                  <span className="mb-1 rounded-full bg-[#cceee9] px-3 py-1 text-[10px] font-bold text-[#17345b]">
                    {stats.gpa >= 90 ? "Amat Baik (A)" : "Baik (B+)"}
                  </span>
                </div>

                <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-[#66747b]">
                  Peringkat 3 dari 36 siswa di kelas XII MIPA 1. Memenuhi syarat jalur prestasi eligible.
                </p>
              </div>

              {/* NILAI TERTINGGI */}
              <div className="rounded-xl bg-[#e9eef2] p-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#7b878d]">Nilai Tertinggi</span>
                  <span className="text-[#17345b]">↗</span>
                </div>
                <strong className="mt-1 block text-2xl text-[#20272d]">
                  {stats.highest.score}
                </strong>
                <span className="text-[10px] text-[#17345b]">{stats.highest.subject}</span>
              </div>

              {/* NILAI TERENDAH */}
              <div className="rounded-xl bg-[#e9eef2] p-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#7b878d]">Nilai Terendah</span>
                  <span className="text-[#68777c]">↘</span>
                </div>
                <strong className="mt-1 block text-2xl text-[#20272d]">
                  {stats.lowest.score}
                </strong>
                <span className="text-[10px] text-[#7b878d]">{stats.lowest.subject}</span>
              </div>

              {/* BEBAN STUDI */}
              <div className="rounded-xl bg-[#e9eef2] p-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#7b878d]">Beban Studi</span>
                  <BookOpen size={13} className="text-[#17345b]" />
                </div>
                <strong className="mt-1 block text-2xl text-[#20272d]">
                  {stats.totalSubjects}
                </strong>
                <span className="text-[10px] text-[#7b878d]">Mata Pelajaran Aktif</span>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#56636a]">
                  Progres Target Kelulusan Cumlaude
                  <span className="ml-2 text-[#8a959a]">(Standar Keunggulan: ≥ 90.0)</span>
                </span>
                <strong className="text-[#17345b]">{stats.cumlaudeProgress}% Tercapai</strong>
              </div>

              <div className="mt-2 h-2 rounded-full bg-[#d5dee2] shadow-inner">
                <div
                  className="h-full rounded-full bg-[#17345b] shadow-[0_0_6px_#17345b]"
                  style={{ width: `${stats.cumlaudeProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* FILTER TABS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit flex-wrap rounded-full bg-[#e9eef3] p-1 shadow-[inset_2px_2px_6px_#cbd3db,inset_-2px_-2px_6px_#fff]">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-[10px] transition ${
                selectedCategory === category
                  ? "bg-[#edf2f5] font-semibold text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                  : "text-[#758187] hover:text-[#17345b]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <span className="text-[10px] text-[#7b878d]">
          Menampilkan <strong className="text-[#20272d]">{filteredGrades.length}</strong> dari{" "}
          {stats.totalSubjects} Mata Pelajaran
        </span>
      </div>

      {/* GRADE CARDS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredGrades.map((grade) => (
          <Card key={grade.id}>
            <div className="min-h-[260px]">
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
                  <SubjectIcon type={grade.icon} />
                </span>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <strong className="text-2xl font-bold text-[#20272d]">
                      {grade.score}
                    </strong>
                    <span className="text-[10px] font-bold text-[#17345b]">
                      ({grade.letter})
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7b878d]">
                    Rata-rata Kelas: {grade.classAverage}
                  </p>
                </div>
              </div>

              {/* SUBJECT */}
              <h3 className="mt-5 text-sm font-semibold text-[#20272d]">
                {grade.subject}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#68777c]">
                <UserRound size={12} />
                <span>{grade.teacher}</span>
              </p>

              {/* COMPLETION */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-[#7b878d]">
                  <span>Tingkat Ketuntasan</span>
                  <strong className="text-[#20272d]">{grade.completion}%</strong>
                </div>

                <div className="mt-1.5 h-1.5 rounded-full bg-[#d6dfe3] shadow-inner">
                  <div
                    className="h-full rounded-full bg-[#17345b]"
                    style={{ width: `${grade.completion}%` }}
                  />
                </div>
              </div>

              {/* SCORES BOX */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <ScoreBox label="Tugas" value={grade.assignment} />
                <ScoreBox label="UTS / STS" value={grade.midterm} />
                <ScoreBox label="UAS / SAS" value={grade.final} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* REMEDIAL & KONSULTASI ACTION */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
              <Headphones size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#20272d]">
                Ajukan Remedial / Konsultasi Nilai
              </h2>
              <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-[#68777c]">
                Memerlukan bimbingan tambahan atau perbaikan nilai untuk mata pelajaran tertentu?
                Ajukan sesi telaah nilai bersama Wali Kelas atau Guru Pengampu.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#edf1f4] px-5 py-2.5 text-[10px] font-semibold text-[#37454a] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:-translate-y-0.5"
            >
              <History size={13} />
              Riwayat Pengajuan
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2.5 text-[10px] font-semibold text-white shadow-[4px_4px_9px_#cbd3db] transition hover:bg-[#102743]"
            >
              <Plus size={13} />
              Buat Pengajuan Baru
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScoreBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[#e9eef3] px-2 py-2 text-center shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
      <span className="block text-[11px] font-medium text-[#6f7b80]">{label}</span>
      <strong className="mt-0.5 block text-xs font-bold text-[#20272d]">{value}</strong>
    </div>
  );
}