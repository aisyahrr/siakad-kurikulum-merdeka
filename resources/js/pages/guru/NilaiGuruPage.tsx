import {
  PenTool,
  Save,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Download,
  AlertCircle,
} from "lucide-react";
import { Header } from "./shared";
import { useTeacherGradeBook } from "@/Hooks/guru/useTeacherGradeBook";

export function NilaiGuruPage() {
  const {
    assignments,
    assignmentId,
    setAssignmentId,
    searchStudent,
    setSearchStudent,
    feedback,
    rows,
    filteredRows,
    handleInputChange,
    handleSaveAll,
    handleExportCSV,
  } = useTeacherGradeBook();

  return (
    <section className="space-y-6">
      {/* HEADER UTAMA */}
      <Header
        title="Input & Rekap Nilai Asesmen"
        description="Kelola penilaian capaian kompetensi Kurikulum Merdeka per rombel bimbingan."
      />

      {/* TOP CONTROLS: ROMBEL SELECTOR & STATS BAR */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ASSIGNMENT / ROMBEL SELECTOR */}
        <div className="flex items-center gap-3 rounded-2xl bg-[#e9eef3] p-2 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
            <PenTool size={18} />
          </span>
          <div className="min-w-0 pr-3">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
              Mata Pelajaran & Rombel
            </span>
            <select
              className="mt-0.5 cursor-pointer bg-transparent text-xs font-bold text-[#17345b] outline-none"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
            >
              {assignments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subjectName} — {item.rombelName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* METRICS PILL */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-xs font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
            <Users size={14} /> Total {rows.length} Siswa Terdaftar
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcebea] px-3.5 py-1.5 text-xs font-bold text-[#087b79]">
            <Sparkles size={14} /> Batas KKTP: 70.0
          </span>
        </div>
      </div>

      {/* NOTIFIKASI FEEDBACK */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* GRADEBOOK TABLE CONTAINER */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH & BULK ACTION */}
        <div className="flex flex-col gap-3 border-b border-[#d8e1e8] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] sm:w-72">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              className="w-full bg-transparent text-xs text-[#20272d] outline-none"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
            >
              <Download size={13} />
              Ekspor CSV
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743]"
            >
              <Save size={14} />
              Simpan Semua Nilai
            </button>
          </div>
        </div>

        {/* TABEL NILAI MASSAL */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[11px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Formatif (40%)</th>
                <th className="py-3 px-3 text-center">Sumatif Tengah (30%)</th>
                <th className="py-3 px-3 text-center">Sumatif Akhir (30%)</th>
                <th className="py-3 px-3 text-center">Skor Akhir</th>
                <th className="py-3 px-3 text-center">Status KKTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filteredRows.map((row, index) => (
                <tr
                  key={row.studentId}
                  className="transition hover:bg-white/30"
                >
                  <td className="py-3 px-3 font-semibold text-[#68777c]">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3">
                    <strong className="block font-bold text-[#20272d]">
                      {row.studentName}
                    </strong>
                    <span className="text-[11px] text-[#718086]">
                      NISN: {row.nisn}
                    </span>
                  </td>

                  {/* INPUT FORMATIF */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.assignment}
                      onChange={(e) =>
                        handleInputChange(row.studentId, "assignment", e.target.value)
                      }
                      className="w-16 rounded-xl bg-[#edf2f6] p-1.5 text-center font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </td>

                  {/* INPUT SUMATIF TENGAH SEMESTER (STS) */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.midterm}
                      onChange={(e) =>
                        handleInputChange(row.studentId, "midterm", e.target.value)
                      }
                      className="w-16 rounded-xl bg-[#edf2f6] p-1.5 text-center font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </td>

                  {/* INPUT SUMATIF AKHIR SEMESTER (SAS) */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.final}
                      onChange={(e) =>
                        handleInputChange(row.studentId, "final", e.target.value)
                      }
                      className="w-16 rounded-xl bg-[#edf2f6] p-1.5 text-center font-bold text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </td>

                  {/* SKOR AKHIR & PREDIKAT */}
                  <td className="py-3 px-3 text-center">
                    <span className="text-sm font-extrabold text-[#17345b]">
                      {row.finalScore}
                    </span>
                    <small className="ml-1 font-bold text-[#68777c]">
                      ({row.letter})
                    </small>
                  </td>

                  {/* STATUS KETUNTASAN KKTP */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${
                        row.isPassed
                          ? "bg-[#dcebea] text-[#087b79]"
                          : "bg-[#fadbd8] text-[#c0392b]"
                      }`}
                    >
                      {row.isPassed ? "Tuntas" : "Remedial"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filteredRows.length === 0 && (
          <div className="py-10 text-center text-xs text-[#75848a]">
            <AlertCircle size={24} className="mx-auto mb-2 text-[#88989e]" />
            Tidak ada siswa yang cocok dengan pencarian "{searchStudent}".
          </div>
        )}
      </div>
    </section>
  );
}