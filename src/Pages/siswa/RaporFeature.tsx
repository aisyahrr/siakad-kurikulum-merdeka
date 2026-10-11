import {
  Landmark,
  TrendingUp,
  Trophy,
  ShieldCheck,
  UserCheck,
  QrCode,
  Download,
  ScanQrCode,
  Printer,
  ChevronDown,
  Eye,
  FileText,
  X,
} from "lucide-react";
import {
  useStudentReport,
} from "@/Hooks/siswa/useRaport";

export function ReportPage() {
  const {
    student,
    activeTab,
    setActiveTab,
    sortOrder,
    toggleSortOrder,
    reportHistory,
    isQrModalOpen,
    setIsQrModalOpen,
    previewReport,
    setPreviewReport,
    handlePrint,
  } = useStudentReport();

  return (
    <div className="space-y-7">
      {/* =========================================================
          HEADER PAGE & TAB TOGGLE
      ========================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            <span className="h-2 w-2 rounded-full bg-[#17345b]" />
            <span>Tahun Ajaran 2024/2025 • Semester Genap</span>
          </div>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#17345b] sm:text-4xl">
            Rapor Digital
          </h1>

          <p className="mt-1 text-xs text-[#75848a]">
            Buku Laporan Hasil Capaian Kompetensi Peserta Didik
          </p>
        </div>

        {/* TAB TOGGLE: SEMESTER TERAKHIR / ARSIP */}
        <div className="flex w-fit items-center gap-1 rounded-full bg-[#e9eef3] p-1.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <button
            type="button"
            onClick={() => setActiveTab("current")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              activeTab === "current"
                ? "bg-[#edf2f6] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            Semester Terakhir (Aktif)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("archive")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              activeTab === "archive"
                ? "bg-[#edf2f6] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            Arsip Kumulatif
          </button>
        </div>
      </div>

      {/* =========================================================
          MAIN RAPOR CARD (NEUMORPHISM WITH ORNAMENT)
      ========================================================= */}
      <div className="relative overflow-hidden rounded-[34px] bg-[#e9eef3] p-6 shadow-[9px_9px_22px_#cbd3db,-9px_-9px_22px_#fff] sm:p-9">
        {/* WATERMARK EMBOSS ORNAMENT */}
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full border-[32px] border-white/40" />

        {/* 1. INSTITUTION & ACCREDITATION ROW */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2f6] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
              <Landmark size={22} />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#17345b]">
                Kementerian Pendidikan & Kebudayaan
              </span>
              <h2 className="text-lg font-extrabold text-[#20272d]">
                SMA Lentera Nusantara Surabaya
              </h2>
              <small className="text-[11px] text-[#718086]">
                NPSN: 20539821 • Terakreditasi A (Unggul)
              </small>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[#e9eef3] px-4 py-2 text-[11px] font-bold text-[#17345b] shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff]">
            <span className="h-2 w-2 rounded-full bg-[#17345b]" />
            Tervalidasi Kemendikbudristek
          </span>
        </div>

        {/* 2. FOUR SUMMARY METRICS GRID */}
        <div className="relative z-10 mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_1.1fr]">
          {/* PROFILE SUMMARY */}
          <div className="flex items-center gap-4 rounded-3xl bg-[#edf2f6] p-4 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
                alt={student.name}
                className="h-16 w-16 rounded-2xl object-cover shadow-[2px_2px_6px_#cbd3db]"
              />
              <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#17345b] text-white shadow-sm">
                <UserCheck size={11} />
              </span>
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold tracking-wider text-[#68777c]">
                SISWA TERDAFTAR
              </span>
              <h3 className="truncate text-base font-extrabold text-[#20272d]">
                {student.name}
              </h3>
              <p className="mt-0.5 text-[11px] text-[#68777c]">
                NISN:{" "}
                <span className="font-semibold text-[#17345b]">
                  {student.nisn}
                </span>{" "}
                • {student.className}
              </p>
            </div>
          </div>

          {/* RATA-RATA KUMULATIF */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#edf2f6] p-4 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <div className="flex items-center justify-between text-[#68777c]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Rata-rata Kumulatif
              </span>
              <TrendingUp size={15} className="text-[#17345b]" />
            </div>
            <div className="mt-2">
              <strong className="text-3xl font-extrabold text-[#20272d]">
                {student.gpa}
                <small className="text-xs font-normal text-[#68777c]">
                  {" "}
                  /100
                </small>
              </strong>
              <span className="mt-0.5 block text-[11px] font-semibold text-[#17345b]">
                ↑ +1.2 vs Smstr 5
              </span>
            </div>
          </div>

          {/* PERINGKAT KELAS */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#edf2f6] p-4 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <div className="flex items-center justify-between text-[#68777c]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Peringkat Kelas
              </span>
              <Trophy size={15} className="text-[#17345b]" />
            </div>
            <div className="mt-2">
              <strong className="text-3xl font-extrabold text-[#17345b]">
                #{student.rank}
                <small className="text-xs font-medium text-[#68777c]">
                  {" "}
                  dari 36 Siswa
                </small>
              </strong>
              <span className="mt-0.5 block text-[11px] text-[#718086]">
                Persentil Teratas 5%
              </span>
            </div>
          </div>

          {/* STATUS KELULUSAN */}
          <div className="flex flex-col justify-between rounded-3xl bg-[#edf2f6] p-4 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <div className="flex items-center justify-between text-[#68777c]">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Status Kelulusan
              </span>
              <ShieldCheck size={15} className="text-[#17345b]" />
            </div>
            <div className="mt-2">
              <strong className="text-sm font-extrabold text-[#17345b]">
                Memenuhi Syarat
              </strong>
              <span className="mt-0.5 block text-[11px] font-medium text-[#718086]">
                Siap SNBP / UTBK
              </span>
              <span className="text-[10px] text-[#68777c]">
                Kredit: 100% Tuntas
              </span>
            </div>
          </div>
        </div>

        {/* 3. WALI KELAS & DIGITAL SIGNATURE VERIFICATION BAR */}
        <div className="relative z-10 mt-5 flex flex-col gap-4 rounded-3xl bg-[#edf2f6] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
              <UserCheck size={18} />
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#68777c]">
                Wali Kelas Pengampu
              </span>
              <strong className="block text-xs font-extrabold text-[#20272d]">
                {student.homeroomTeacher}
              </strong>
              <small className="text-[10px] text-[#718086]">
                NIP. 19740512 199903 2 001
              </small>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:text-right">
            <div>
              <span className="block text-[10px] font-bold text-[#68777c]">
                Sertifikasi Dokumen
              </span>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#17345b] sm:justify-end">
                BSrE • BSSN Certified <ShieldCheck size={12} />
              </span>
              <span className="block font-mono text-[9px] text-[#718086]">
                SHA-256: 8f4a...92b0
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#087b79]"
            >
              <QrCode size={20} />
            </button>
          </div>
        </div>

        {/* 4. ACTIONS ROW */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => alert("Mengunduh Rapor Digital Lengkap (PDF)...")}
            className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-6 py-3 text-xs font-bold text-white shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#fff] transition hover:bg-[#102743] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download size={14} />
            Unduh Dokumen Rapor Lengkap (PDF)
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              2.4 MB
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#e9eef3] px-6 py-3 text-xs font-bold text-[#17345b] shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#fff] transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <ScanQrCode size={15} />
            Verifikasi Tanda Tangan Digital (QR)
          </button>

          <button
            type="button"
            onClick={handlePrint}
            aria-label="Cetak Rapor"
            className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* =========================================================
          RIWAYAT RAPOR SEMESTER SEBELUMNYA SECTION
      ========================================================= */}
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#17345b]">
              Riwayat Rapor Semester Sebelumnya
            </h2>
            <p className="text-xs text-[#68777c]">
              Arsip digital transkrip nilai per semester yang telah disahkan
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#68777c]">
            <span>Urutkan:</span>
            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex items-center gap-1 font-bold text-[#17345b]"
            >
              {sortOrder === "desc" ? "Terbaru" : "Terlama"}{" "}
              <ChevronDown
                size={14}
                className={`transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* LIST OF HISTORICAL REPORT CARDS */}
        <div className="mt-4 space-y-3.5">
          {reportHistory.map((r) => (
            <div
              key={r.code}
              className="flex flex-col gap-4 rounded-full bg-[#e9eef3] px-5 py-3.5 shadow-[5px_5px_13px_#cbd3db,-5px_-5px_13px_#fff] transition hover:-translate-y-0.5 lg:flex-row lg:items-center lg:justify-between"
            >
              {/* LEFT: SMT BADGE & SEMESTER INFO */}
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9eef3] text-center shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff]">
                  <div>
                    <span className="block text-[8px] font-bold text-[#68777c]">
                      SMT
                    </span>
                    <strong className="block text-sm font-extrabold text-[#17345b]">
                      {r.code}
                    </strong>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#20272d]">
                      {r.semester}
                    </h3>
                    <span className="rounded-full bg-[#dfe8ef] px-2 py-0.5 text-[9px] font-extrabold uppercase text-[#17345b]">
                      {r.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#718086]">
                    {r.detail}
                  </p>
                </div>
              </div>

              {/* RIGHT: METRICS & ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-5 sm:gap-7">
                <div className="text-left sm:text-right">
                  <span className="block text-[9px] font-semibold uppercase text-[#68777c]">
                    Rata-rata
                  </span>
                  <strong className="text-sm font-extrabold text-[#20272d]">
                    {r.average}
                  </strong>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block text-[9px] font-semibold uppercase text-[#68777c]">
                    Peringkat
                  </span>
                  <strong className="text-sm font-extrabold text-[#17345b]">
                    {r.rank}
                    <small className="text-[10px] font-normal text-[#68777c]">
                      {" "}
                      {r.rankTotal}
                    </small>
                  </strong>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block text-[9px] font-semibold uppercase text-[#68777c]">
                    Kehadiran
                  </span>
                  <strong className="text-sm font-extrabold text-[#17345b]">
                    {r.attendance}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewReport(r)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Eye size={13} />
                  Lihat Rapor
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(`Mengunduh berkas transkrip ${r.semester}...`)
                  }
                  aria-label="Unduh Berkas"
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:-translate-y-0.5 active:translate-y-0"
                >
                  <FileText size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          MODAL 1: VERIFIKASI QR CODE / TANDA TANGAN ELEKTRONIK
      ========================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[32px] bg-[#e9eef3] p-6 text-center shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <span className="text-[11px] font-bold text-[#68777c]">
                Verifikasi Tanda Tangan BSrE
              </span>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#64748b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="my-5 flex justify-center">
              <div className="grid h-44 w-44 place-items-center rounded-3xl bg-[#edf2f6] p-4 shadow-[inset_3px_3px_6px_#cbd3db,inset_-3px_-3px_6px_#fff]">
                <QrCode size={120} className="text-[#17345b]" />
              </div>
            </div>

            <h3 className="text-sm font-extrabold text-[#17345b]">
              Dokumen Resmi Terotentikasi
            </h3>
            <p className="mt-1 text-xs text-[#68777c]">
              Disahkan secara elektronik oleh Kepala Sekolah & Balai Sertifikasi
              Elektronik (BSSN).
            </p>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="mt-6 w-full rounded-full bg-[#17345b] py-2.5 text-xs font-bold text-white shadow"
            >
              Tutup Verifikasi
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: PRATINJAU DOKUMEN RAPOR ARSIP
      ========================================================= */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-3xl flex-col rounded-[32px] bg-[#f8fafc] p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Pratinjau Lembar Rapor Digital
                </span>
                <h3 className="text-sm font-bold text-[#17345b]">
                  {previewReport.semester}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-gray-600 hover:text-black"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto bg-white p-6 rounded-2xl border border-gray-200 text-xs">
              <div className="border-b-2 border-gray-800 pb-3 text-center">
                <h2 className="text-sm font-bold uppercase text-[#17345b]">
                  SMA LENTERA NUSANTARA SURABAYA
                </h2>
                <p className="text-[10px] text-gray-500">
                  Laporan Capaian Hasil Belajar Siswa • {previewReport.semester}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  Nama: <b>{student.name}</b>
                </div>
                <div>NISN: {student.nisn}</div>
                <div>
                  Status Rapor:{" "}
                  <b className="text-[#087b79]">{previewReport.badge}</b>
                </div>
                <div>
                  Peringkat: <b>{previewReport.rank}</b>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4 border border-gray-200">
                <p className="font-semibold text-gray-700">
                  Rangkuman Hasil Capaian:
                </p>
                <p className="mt-1 text-gray-600">
                  Siswa menunjukkan pemahaman yang sangat konsisten dengan
                  rata-rata kumulatif <b>{previewReport.average}</b> serta rekor
                  kehadiran mencapai <b>{previewReport.attendance}</b>.
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="rounded-full bg-gray-200 px-5 py-2 text-xs font-bold text-gray-700"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() =>
                  alert(`Mengunduh berkas ${previewReport.semester}...`)
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow"
              >
                <Download size={13} /> Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
