import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2,
  Save,
  Search,
  CheckCheck,
} from "lucide-react";
import { Header } from "./shared";
import { attendance } from "@/data/academic.data";
import {
  getAssignmentView,
  getTeacherStudents,
  saveAttendance,
  subscribeAcademicData,
} from "@/Services/academic.service";

type AttendanceStatus = "Hadir" | "Izin" | "Sakit" | "Alpa";

interface StudentAttendanceState {
  studentId: string;
  studentName: string;
  nisn: string;
  status: AttendanceStatus;
  note: string;
}

export function PresensiGuruPage() {
  const assignments = getAssignmentView();
  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id ?? "");
  const selected =
    assignments.find((item) => item.id === assignmentId) ?? assignments[0];

  const [date, setDate] = useState("2024-10-25");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [, refresh] = useState(0);

  useEffect(
    () => subscribeAcademicData(() => refresh((value) => value + 1)),
    [],
  );

  const students = getTeacherStudents(selected?.rombelId ?? "");

  // Local state presensi per siswa
  const [records, setRecords] = useState<StudentAttendanceState[]>([]);

  useEffect(() => {
    if (!students.length) return;
    const initialList: StudentAttendanceState[] = students.map((student, idx) => {
      const existing = attendance.find(
        (item) =>
          item.studentId === student.id &&
          item.subjectId === selected?.subjectId &&
          item.date === date,
      );
      return {
        studentId: student.id,
        studentName: student.name,
        nisn: `00649281${idx + 10}`,
        status: (existing?.status as AttendanceStatus) ?? "Hadir",
        note: existing?.detail?.includes("·") ? "" : existing?.detail ?? "",
      };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(initialList);
  }, [students, selected?.subjectId, date, assignmentId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, status } : row)),
    );
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setRecords((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, note } : row)),
    );
  };

  const handleSetAllPresent = () => {
    setRecords((prev) => prev.map((row) => ({ ...row, status: "Hadir" })));
  };

  // Kalkulasi realtime statistik kehadiran
  const stats = useMemo(() => {
    const total = records.length;
    const hadir = records.filter((r) => r.status === "Hadir").length;
    const izin = records.filter((r) => r.status === "Izin").length;
    const sakit = records.filter((r) => r.status === "Sakit").length;
    const alpa = records.filter((r) => r.status === "Alpa").length;
    const rate = total > 0 ? Math.round((hadir / total) * 1000) / 10 : 0;
    return { total, hadir, izin, sakit, alpa, rate };
  }, [records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    records.forEach((row) => {
      saveAttendance({
        studentId: row.studentId,
        subjectId: selected.subjectId,
        meetingId: `meeting-${selected.subjectId}-${date}`,
        date,
        status: row.status,
        time: "07:30 WIB",
        detail: row.note.trim()
          ? `${selected.subjectName} · ${row.note.trim()}`
          : `${selected.subjectName} · ${selected.rombelName}`,
      });
    });

    setMessage(`Presensi ${selected.subjectName} (${selected.rombelName}) tanggal ${date} berhasil disimpan.`);
    setTimeout(() => setMessage(""), 4000);
  };

  const filteredRecords = records.filter((r) =>
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      {/* HEADER UTAMA */}
      <Header
        title="Presensi Siswa per Pertemuan"
        description="Pencatatan kehadiran sesi kelas terhubung otomatis dengan laporan presensi akumulatif wali kelas."
      />

      {/* TOP FILTER & REALTIME METRICS BAR */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] items-start">
        {/* SELECTOR PANEL */}
        <div className="flex flex-col gap-3 rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] sm:flex-row sm:items-center sm:justify-between">
          {/* ROMBEL / MAPEL */}
          <div className="flex-1 min-w-0 pr-2">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
              Mata Pelajaran & Rombel
            </span>
            <select
              className="mt-1 w-full bg-transparent text-xs font-bold text-[#17345b] outline-none cursor-pointer"
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

          {/* TANGGAL */}
          <div className="shrink-0 border-t border-[#d8e1e8] pt-2 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#68777c]">
              Tanggal Sesi
            </span>
            <input
              type="date"
              className="mt-1 bg-transparent text-xs font-bold text-[#17345b] outline-none cursor-pointer"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* 4 COUNTER PILLS STATISTIK KEHADIRAN */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-2xl bg-[#e9eef3] p-3 text-center shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <span className="block text-[10px] font-bold text-[#087b79]">Hadir</span>
            <b className="mt-0.5 block text-lg font-extrabold text-[#087b79]">{stats.hadir}</b>
          </div>

          <div className="rounded-2xl bg-[#e9eef3] p-3 text-center shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <span className="block text-[10px] font-bold text-[#17345b]">Izin</span>
            <b className="mt-0.5 block text-lg font-extrabold text-[#17345b]">{stats.izin}</b>
          </div>

          <div className="rounded-2xl bg-[#e9eef3] p-3 text-center shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <span className="block text-[10px] font-bold text-[#68777c]">Sakit</span>
            <b className="mt-0.5 block text-lg font-extrabold text-[#68777c]">{stats.sakit}</b>
          </div>

          <div className="rounded-2xl bg-[#e9eef3] p-3 text-center shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <span className="block text-[10px] font-bold text-[#ef4444]">Alpa</span>
            <b className="mt-0.5 block text-lg font-extrabold text-[#ef4444]">{stats.alpa}</b>
          </div>
        </div>
      </div>

      {/* FEEDBACK NOTIFICATION */}
      {message && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* ATTENDANCE TABLE CARD */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH & QUICK ALL-PRESENT ACTION */}
        <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-72">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari siswa di rombel ini..."
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSetAllPresent}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-2 text-xs font-bold text-[#087b79] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:scale-105 active:scale-95"
            >
              <CheckCheck size={14} />
              Setel Semua Hadir
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#102743]"
            >
              <Save size={14} />
              Simpan Presensi Sesi
            </button>
          </div>
        </div>

        {/* TABEL PRESENSI SISWA */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[11px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Status Kehadiran</th>
                <th className="py-3 px-3">Catatan Khusus Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filteredRecords.map((row, index) => (
                <tr key={row.studentId} className="transition hover:bg-white/30">
                  <td className="py-3.5 px-3 font-semibold text-[#68777c]">{index + 1}</td>
                  <td className="py-3.5 px-3">
                    <strong className="block font-bold text-[#20272d]">{row.studentName}</strong>
                    <span className="text-[11px] text-[#718086]">NISN: {row.nisn}</span>
                  </td>

                  {/* QUICK-TOGGLE PILLS: HADIR, IZIN, SAKIT, ALPA */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                      {/* HADIR */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, "Hadir")}
                        className={`h-7 w-7 rounded-full text-xs font-extrabold transition ${
                          row.status === "Hadir"
                            ? "bg-[#087b79] text-white shadow-sm"
                            : "text-[#68777c] hover:text-[#087b79]"
                        }`}
                        title="Hadir"
                      >
                        H
                      </button>

                      {/* IZIN */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, "Izin")}
                        className={`h-7 w-7 rounded-full text-xs font-extrabold transition ${
                          row.status === "Izin"
                            ? "bg-[#17345b] text-white shadow-sm"
                            : "text-[#68777c] hover:text-[#17345b]"
                        }`}
                        title="Izin / Dispensasi"
                      >
                        I
                      </button>

                      {/* SAKIT */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, "Sakit")}
                        className={`h-7 w-7 rounded-full text-xs font-extrabold transition ${
                          row.status === "Sakit"
                            ? "bg-[#566573] text-white shadow-sm"
                            : "text-[#68777c] hover:text-[#566573]"
                        }`}
                        title="Sakit"
                      >
                        S
                      </button>

                      {/* ALPA */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, "Alpa")}
                        className={`h-7 w-7 rounded-full text-xs font-extrabold transition ${
                          row.status === "Alpa"
                            ? "bg-[#ef4444] text-white shadow-sm"
                            : "text-[#68777c] hover:text-[#ef4444]"
                        }`}
                        title="Alpa / Tanpa Keterangan"
                      >
                        A
                      </button>
                    </div>
                  </td>

                  {/* INPUT CATATAN DISPENSASI / GURU */}
                  <td className="py-3.5 px-3">
                    <input
                      type="text"
                      placeholder="Misal: Dispensasi lomba, surat dokter terlampir..."
                      value={row.note}
                      onChange={(e) => handleNoteChange(row.studentId, e.target.value)}
                      className="w-full rounded-xl bg-[#edf2f6] px-3 py-1.5 text-xs text-[#20272d] placeholder:text-[#8d9ca2] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}