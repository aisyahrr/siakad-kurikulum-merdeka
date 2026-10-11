import {
  CheckCircle2,
  FileCheck2,
  Stethoscope,
  CircleAlert,
  Info,
  Send,
  DoorOpen,
  X,
  Upload,
} from "lucide-react";
import { Card } from "@/Components/ui/Card";
import { useAttendance } from "@/Hooks/siswa/useAttendance";

export function AttendancePage() {
  const {
    selectedMonth,
    setSelectedMonth,
    monthFilters,
    summaryCounts,
    metrics,
    records,
    isModalOpen,
    setIsModalOpen,
    feedback,
    submitLeaveRequest,
  } = useAttendance("student-alya");

  const attendanceSummary = [
    {
      id: 1,
      label: "Hadir Fisik",
      value: String(summaryCounts.present),
      unit: "Sesi",
      description: `${metrics.rate}% Partisipasi Kelas`,
      icon: CheckCircle2,
      color: "navy",
    },
    {
      id: 2,
      label: "Izin / Dispensasi",
      value: String(summaryCounts.permission),
      unit: "Sesi",
      description: "Disetujui Wali Kelas",
      icon: FileCheck2,
      color: "gray",
    },
    {
      id: 3,
      label: "Sakit (Dokter)",
      value: String(summaryCounts.sick),
      unit: "Sesi",
      description: "Terverifikasi Surat Dokter",
      icon: Stethoscope,
      color: "gray",
    },
    {
      id: 4,
      label: "Alpa (Tanpa Keterangan)",
      value: String(summaryCounts.absent),
      unit: "Sesi",
      description: "Catatan Presensi Guru",
      icon: CircleAlert,
      color: "navy",
    },
  ];

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const category = String(form.get("category"));
    const reason = String(form.get("reason"));
    submitLeaveRequest(category, reason);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17345b]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
              Tahun Ajaran 2024/2025 • Semester Ganjil
            </span>
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#20272d] md:text-[34px]">
            Presensi & Kehadiran
          </h1>

          <p className="mt-1 max-w-md text-xs leading-relaxed text-[#78858a]">
            Monitoring catatan kehadiran kelas dan riwayat izin semester aktif siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#e9eef3] px-4 py-2.5 text-[11px] font-medium text-[#5f6c72] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]">
            <span className="mr-1 text-[#17345b]">◉</span>
            NISN: 0064928172
          </span>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-4 py-2.5 text-[11px] font-semibold text-white shadow-[4px_4px_9px_#cbd3db] transition hover:bg-[#102743]"
          >
            <Send size={13} />
            Ajukan Surat Izin / Sakit
          </button>
        </div>
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-[#dff4ed] px-4 py-3 text-xs font-semibold text-[#087b79] shadow-sm">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* TOP SECTION: KIRI (DONUT AKUMULATIF) & KANAN (SUMMARY STATS) */}
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.45fr]">
        {/* STATISTIK AKUMULATIF */}
        <Card className="h-fit">
          <div className="p-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#68777c]">
                Statistik Akumulatif
              </span>
              <span className="rounded-full bg-[#dcebea] px-3 py-1 text-[10px] font-semibold text-[#17345b]">
                <span className="mr-1">●</span>
                Status: {metrics.rate >= 90 ? "Sangat Disiplin" : "Perlu Ditingkatkan"}
              </span>
            </div>

            <div className="my-6 flex justify-center">
              <div className="relative grid h-36 w-36 place-items-center rounded-full bg-[#e9eef3] shadow-[inset_7px_7px_14px_#cbd3db,inset_-7px_-7px_14px_#fff]">
                <div className="absolute inset-[-2px] rounded-full border-[8px] border-[#d8e0e5]" />
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <strong className="text-3xl font-bold tracking-tight text-[#20272d]">
                      {metrics.rate}
                    </strong>
                    <span className="text-base font-bold text-[#17345b]">%</span>
                  </div>
                  <p className="text-[11px] uppercase tracking-wide text-[#78858a]">
                    Tingkat Kehadiran
                  </p>
                </div>
              </div>
            </div>

            <div className="pb-2 text-center">
              <h3 className="text-base font-bold text-[#20272d]">
                Kehadiran Semester Ganjil
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-[#7b878d]">
                {summaryCounts.present} dari total {metrics.total} sesi tatap muka kalender akademik telah terpenuhi.
              </p>
            </div>
          </div>
        </Card>

        {/* RIGHT STATISTICS GRID */}
        <div className="grid grid-cols-2 gap-4">
          {attendanceSummary.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.id}>
                <div className="flex h-full min-h-[100px] flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] text-[#68777c]">{item.label}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                      <Icon size={13} />
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1">
                    <strong className="text-3xl font-bold text-[#20272d]">
                      {item.value}
                    </strong>
                    <span className="text-[10px] text-[#68777c]">{item.unit}</span>
                  </div>

                  <p
                    className={`mt-1 text-[11px] ${
                      item.color === "navy" ? "text-[#17345b] font-semibold" : "text-[#68777c]"
                    }`}
                  >
                    <span className="mr-1">●</span>
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}

          {/* ABSENCE LIMIT */}
          <div className="col-span-2">
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                    <Info size={14} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-[#4e5a60]">
                      Batas Maksimal Ketidakhadiran
                    </p>
                    <p className="mt-0.5 max-w-lg text-[11px] leading-relaxed text-[#7b878d]">
                      Maksimum dispensasi & sakit per semester adalah {metrics.maxAllowance} hari efektif (SK Dirjen No. 44).
                    </p>
                  </div>
                </div>

                <span className="flex w-fit items-center gap-2 rounded-full bg-[#e9eef3] px-3.5 py-2 text-[10px] text-[#68777c] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff]">
                  Tersisa <strong className="text-[#20272d]">{metrics.remainingDays}</strong> Hari
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CATATAN KEHADIRAN TERBARU */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#20272d]">
              Catatan Kehadiran Terbaru
            </h2>
            <p className="mt-0.5 text-[11px] text-[#7b878d]">
              Log autentikasi presensi tatap muka dan verifikasi gerbang sekolah.
            </p>
          </div>

          {/* MONTH FILTER */}
          <div className="flex w-fit flex-wrap rounded-full bg-[#e9eef3] p-1 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            {monthFilters.map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => setSelectedMonth(month)}
                className={`rounded-full px-4 py-1.5 text-[10px] font-semibold transition ${
                  selectedMonth === month
                    ? "bg-[#edf2f4] text-[#17345b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                    : "text-[#7b878d] hover:text-[#20272d]"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* LOG RECORDS LIST */}
        <div className="mt-5 space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex flex-col gap-3 rounded-[20px] bg-[#e9eef3] px-4 py-3 shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff] transition hover:-translate-y-[1px] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf2f4] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                  {record.type === "permission" ? (
                    <FileCheck2 size={16} className="text-[#68777c]" />
                  ) : (
                    <DoorOpen size={16} className="text-[#087b79]" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#293238]">{record.date}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[#69767c]">{record.detail}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-[#293238]">{record.time}</p>
                  <p className="text-[10px] text-[#7b878d]">{record.activity}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                    record.type === "permission"
                      ? "bg-[#e5e9ec] text-[#68777c]"
                      : "bg-[#dcebea] text-[#087b79]"
                  }`}
                >
                  <span>●</span>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* MODAL PENGAJUAN SURAT IZIN / SAKIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#edf1f4] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#17345b]">
                  Layanan Siswa
                </span>
                <h3 className="mt-1 text-base font-bold text-[#20272d]">
                  Pengajuan Surat Izin / Sakit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e8edf0] text-[#64748b] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Jenis Permohonan
                </label>
                <select
                  name="category"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                >
                  <option value="Sakit">Sakit (Melampirkan Surat Dokter)</option>
                  <option value="Izin Dispensasi">Izin Dispensasi / Urusan Keluarga</option>
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
                  Uraian Alasan
                </label>
                <textarea
                  name="reason"
                  placeholder="Tuliskan keterangan sakit atau izin..."
                  rows={2}
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Unggah Berkas Pendukung (Surat Dokter / Bukti)
                </label>
                <div className="mt-1 flex items-center gap-2 rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#68777c] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <Upload size={14} className="text-[#17345b]" />
                  <input type="file" className="text-xs file:hidden" />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#68777c] hover:bg-white/60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Send size={13} />
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}