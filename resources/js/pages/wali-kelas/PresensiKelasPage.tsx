import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  FileText,
  Download,
  Eye,
  Check,
  X,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  studentName: string;
  nisn: string;
  category: "Sakit" | "Izin Dispensasi";
  dateRange: string;
  reason: string;
  documentFile: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
}

interface StudentAttendanceSummary {
  id: string;
  name: string;
  nisn: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  totalSessions: number;
}

export function PresensiKelasPage() {
  const [selectedMonth, setSelectedMonth] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<LeaveRequest | null>(null);

  const months = ["Semua", "Oktober", "September", "Agustus"];

  // Pengajuan surat izin/sakit yang menunggu verifikasi wali kelas
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: "req-1",
      studentName: "Bagas Ramadhan",
      nisn: "0064928111",
      category: "Sakit",
      dateRange: "24 Okt 2024 - 25 Okt 2024",
      reason: "Demam tinggi dan istirahat rawat jalan sesuai anjuran klinik.",
      documentFile: "Surat_Dokter_Klinik_Medika.pdf",
      status: "Menunggu",
    },
    {
      id: "req-2",
      studentName: "Dimas Pratama",
      nisn: "0064928113",
      category: "Izin Dispensasi",
      dateRange: "22 Okt 2024",
      reason: "Mengikuti babak final kejuaraan Futsal Pelajar Tingkat Kota.",
      documentFile: "Dispensasi_KONI_Kota_Depok.pdf",
      status: "Disetujui",
    },
  ]);

  // Master rekap presensi akumulatif per siswa
  const [attendanceList] = useState<StudentAttendanceSummary[]>([
    {
      id: "std-1",
      name: "Alya Putri",
      nisn: "0064928110",
      hadir: 58,
      izin: 2,
      sakit: 0,
      alpa: 0,
      totalSessions: 60,
    },
    {
      id: "std-2",
      name: "Citra Lestari",
      nisn: "0064928112",
      hadir: 56,
      izin: 3,
      sakit: 1,
      alpa: 0,
      totalSessions: 60,
    },
    {
      id: "std-3",
      name: "Eka Rahmawati",
      nisn: "0064928114",
      hadir: 57,
      izin: 2,
      sakit: 1,
      alpa: 0,
      totalSessions: 60,
    },
    {
      id: "std-4",
      name: "Dimas Pratama",
      nisn: "0064928113",
      hadir: 48,
      izin: 5,
      sakit: 2,
      alpa: 5,
      totalSessions: 60,
    },
    {
      id: "std-5",
      name: "Bagas Ramadhan",
      nisn: "0064928111",
      hadir: 43,
      izin: 3,
      sakit: 4,
      alpa: 10,
      totalSessions: 60,
    },
  ]);

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Disetujui" } : r)),
    );
    setFeedback("Pengajuan surat izin telah diverifikasi & disetujui.");
    setTimeout(() => setFeedback(""), 3500);
  };

  const handleReject = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Ditolak" } : r)),
    );
    setFeedback("Pengajuan surat izin ditolak.");
    setTimeout(() => setFeedback(""), 3500);
  };

  const classSummary = useMemo(() => {
    const totalHadir = attendanceList.reduce((acc, s) => acc + s.hadir, 0);
    const totalIzin = attendanceList.reduce((acc, s) => acc + s.izin, 0);
    const totalSakit = attendanceList.reduce((acc, s) => acc + s.sakit, 0);
    const totalAlpa = attendanceList.reduce((acc, s) => acc + s.alpa, 0);
    const grandTotal = totalHadir + totalIzin + totalSakit + totalAlpa;
    const rate =
      grandTotal > 0 ? Math.round((totalHadir / grandTotal) * 1000) / 10 : 0;
    return { totalHadir, totalIzin, totalSakit, totalAlpa, rate };
  }, [attendanceList]);

  const filteredAttendance = useMemo(() => {
    return attendanceList.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery),
    );
  }, [attendanceList, searchQuery]);

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Rombel Binaan • XII MIPA 1
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Rekap Presensi & Verifikasi Izin Kelas
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Pantau akumulasi kehadiran seluruh siswa dan verifikasi dokumen
            permohonan izin/sakit.
          </p>
        </div>

        {/* EXPORT CSV BUTTON */}
        <button
          type="button"
          onClick={() => alert("Mengunduh Rekap Presensi XII MIPA 1 (.CSV)...")}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:text-[#102743] sm:self-auto"
        >
          <Download size={14} />
          Ekspor Presensi CSV
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Rata-rata Kehadiran",
            value: `${classSummary.rate}%`,
            sub: "Akumulasi Rombel",
            colorText: "text-[#087b79]",
            isAlert: false,
          },
          {
            label: "Total Hadir",
            value: classSummary.totalHadir,
            sub: "Sesi Tatap Muka",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
          {
            label: "Total Izin",
            value: classSummary.totalIzin,
            sub: "Dispensasi Resmi",
            colorText: "text-[#566573]",
            isAlert: false,
          },
          {
            label: "Total Sakit",
            value: classSummary.totalSakit,
            sub: "Surat Dokter",
            colorText: "text-[#d97706]",
            isAlert: false,
          },
          {
            label: "Total Alpa",
            value: classSummary.totalAlpa,
            sub: "Tanpa Keterangan",
            colorText: "text-[#ef4444]",
            isAlert: true,
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
            <strong
              className={`mt-1 block text-2xl font-black ${item.colorText}`}
            >
              {item.value}
            </strong>
            <span
              className={`text-[10px] ${item.isAlert ? "text-[#ef4444]" : "text-[#68777c]"}`}
            >
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

      {/* VERIFIKASI PENGAJUAN SURAT IZIN / SAKIT SISWA */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#dbe8f5] text-[#17345b]">
              <FileText size={17} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#17345b]">
                Antrean Pengajuan Surat Izin & Dispensasi
              </h2>
              <span className="text-[11px] text-[#68777c]">
                Verifikasi dokumen pendukung agar status presensi siswa
                diperbarui otomatis.
              </span>
            </div>
          </div>
          <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0284c7]">
            {leaveRequests.filter((r) => r.status === "Menunggu").length}{" "}
            Menunggu
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {leaveRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="block text-xs font-bold text-[#20272d]">
                      {req.studentName}
                    </strong>
                    <span className="text-[10px] text-[#718086]">
                      NISN: {req.nisn} • {req.dateRange}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      req.status === "Disetujui"
                        ? "bg-[#dcebea] text-[#087b79]"
                        : req.status === "Ditolak"
                          ? "bg-[#fadbd8] text-[#c0392b]"
                          : "bg-[#fef3c7] text-[#b45309]"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[#516168]">
                  "{req.reason}"
                </p>

                {/* ATTACHMENT CHIP */}
                <button
                  type="button"
                  onClick={() => setSelectedDoc(req)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3 py-1 text-[11px] font-bold text-[#17345b] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] hover:text-[#087b79]"
                >
                  <Eye size={12} />
                  <span>{req.documentFile}</span>
                </button>
              </div>

              {/* ACTION APPROVE / REJECT */}
              {req.status === "Menunggu" && (
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                  <button
                    type="button"
                    onClick={() => handleReject(req.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fadbd8] px-3 py-1 text-[11px] font-bold text-[#c0392b] transition hover:bg-[#f8b4b4]"
                  >
                    <X size={12} /> Tolak
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#087b79] px-3.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#066361]"
                  >
                    <Check size={12} /> Setujui
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MASTER TABEL REKAPITULASI PRESENSI KELAS */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH & MONTH FILTER */}
        <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-80">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari siswa dalam rekap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
            {months.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`rounded-full px-3.5 py-1 text-[11px] font-bold transition ${
                  selectedMonth === m
                    ? "bg-[#17345b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* TABEL PRESENSI */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-2 text-center">Hadir</th>
                <th className="py-3 px-2 text-center">Izin</th>
                <th className="py-3 px-2 text-center">Sakit</th>
                <th className="py-3 px-2 text-center">Alpa</th>
                <th className="py-3 px-2 text-center">Tingkat Kehadiran</th>
                <th className="py-3 px-3 text-center">Status Kelayakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filteredAttendance.map((row) => {
                const percentage =
                  Math.round((row.hadir / row.totalSessions) * 1000) / 10;
                const isWarning = percentage < 75;

                return (
                  <tr key={row.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">
                        {row.name}
                      </strong>
                      <span className="text-[10px] text-[#718086]">
                        NISN: {row.nisn}
                      </span>
                    </td>

                    <td className="py-3.5 px-2 text-center font-bold text-[#087b79]">
                      {row.hadir}
                    </td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#17345b]">
                      {row.izin}
                    </td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#68777c]">
                      {row.sakit}
                    </td>
                    <td className="py-3.5 px-2 text-center font-extrabold text-[#ef4444]">
                      {row.alpa}
                    </td>

                    <td className="py-3.5 px-2 text-center">
                      <strong
                        className={`text-sm font-extrabold ${
                          isWarning ? "text-[#c0392b]" : "text-[#17345b]"
                        }`}
                      >
                        {percentage}%
                      </strong>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold ${
                          isWarning
                            ? "bg-[#fadbd8] text-[#c0392b]"
                            : "bg-[#dcebea] text-[#087b79]"
                        }`}
                      >
                        {isWarning ? "Risiko (<75%)" : "Memenuhi Syarat"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PREVIEW SURAT BUKTI */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Pratinjau Dokumen
                </span>
                <h3 className="text-sm font-extrabold text-[#17345b]">
                  {selectedDoc.documentFile}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-[#edf2f6] p-8 text-center shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
              <FileText size={48} className="text-[#17345b]" />
              <p className="mt-3 text-xs font-bold text-[#20272d]">
                {selectedDoc.studentName}
              </p>
              <span className="text-[11px] text-[#68777c]">
                {selectedDoc.reason}
              </span>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
              <button
                type="button"
                onClick={() =>
                  alert(`Mengunduh berkas ${selectedDoc.documentFile}...`)
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
              >
                <Download size={13} /> Unduh Berkas
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
