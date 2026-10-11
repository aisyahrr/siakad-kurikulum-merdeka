import {
  CalendarDays,
  Check,
  Download,
  FlaskConical,
  MapPin,
  RefreshCw,
  UserRound,
  X,
  Clock3,
  Coffee,
  Utensils,
  BookOpen,
  Calculator,
  Bell,
  MessageSquareText,
} from "lucide-react";
import { Card } from "@/Components/ui/Card";
import { useSchedule } from "@/Hooks/siswa/useSchedule";

// ======================================================
// STATIC METADATA
// ======================================================

const breaks = [
  {
    afterSession: 2,
    title: "Istirahat Pertama",
    description: "Waktu Relaksasi & Kudapan",
    time: "10:45 - 11:00",
    duration: "15 Menit",
    icon: "coffee",
  },
  {
    afterSession: 3,
    title: "Ishoma Siang",
    description: "Istirahat, Sholat & Makan Siang",
    time: "12:30 - 13:15",
    duration: "45 Menit",
    icon: "food",
  },
];

const instructions = [
  {
    title: "Perlengkapan Kimia Organik",
    description:
      "Wajib mengenakan jas laboratorium putih dan kacamata pelindung sebelum memasuki Lab Sains 3 pukul 13:15 WIB.",
  },
  {
    title: "Tugas Matematika Peminatan",
    description:
      "Pengumpulan lembar kerja integral di portal e-learning dibuka hingga Kamis, 23:59 WIB.",
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export function SchedulePage() {
  const {
    days,
    selectedDay,
    setSelectedDay,
    allSchedules,
    daySchedules,
    totalSks,
    totalStudyTime,
    practicalSessions,
    isSynced,
    isSyncing,
    showCalendar,
    setShowCalendar,
    handleSyncCalendar,
    handleDownloadPDF,
  } = useSchedule("student-alya", "Rabu");

  return (
    <>
      {/* HEADER */}
      <PageTitle
        eyebrow="KALENDER AKADEMIK AKTIF"
        title="Jadwal Pelajaran"
        description="Tahun Ajaran 2024/2025 • Semester Ganjil • Kelas XII MIPA 1"
        action={
          <>
            <button
              type="button"
              onClick={() => setShowCalendar(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf1f4] px-5 py-3 text-sm font-semibold text-[#3e4b52] shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition hover:-translate-y-[1px]"
            >
              <RefreshCw size={16} />
              {isSynced ? "Tersinkronkan" : "Sinkronkan Kalender"}
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17345b] px-5 py-3 text-sm font-semibold text-white shadow-[4px_4px_10px_#cbd3db] transition hover:-translate-y-[1px] hover:bg-[#17345b]"
            >
              <Download size={16} />
              Unduh Jadwal (PDF)
            </button>
          </>
        }
      />

      {/* DAY SELECTOR */}
      <div className="mb-10 flex max-w-[600px] flex-wrap gap-1 rounded-full bg-[#e9eef2] p-2 shadow-[inset_3px_3px_8px_#ccd4dc,inset_-3px_-3px_8px_#fff]">
        {days.map((day) => {
          const active = day === selectedDay;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#e9eef2] font-bold text-[#17345b] shadow-[3px_3px_8px_#cbd3db,-3px_-3px_8px_#fff]"
                  : "text-[#526068] hover:bg-white/60"
              }`}
            >
              {active && <span className="mr-1">•</span>}
              {day}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid gap-5 xl:grid-cols-[1.7fr_0.8fr]">
        {/* LEFT COLUMN: SCHEDULES */}
        <div className="space-y-5">
          {daySchedules.length === 0 ? (
            <Card>
              <div className="py-16 text-center">
                <CalendarDays
                  size={40}
                  className="mx-auto mb-4 text-[#94a3b8]"
                />
                <p className="font-semibold text-[#334155]">Tidak ada jadwal</p>
                <p className="mt-1 text-sm text-[#64748b]">
                  Tidak ada jadwal pada hari {selectedDay}.
                </p>
              </div>
            </Card>
          ) : (
            daySchedules.map((item, index) => {
              const breakItem = breaks.find(
                (b) => b.afterSession === index + 1,
              );

              return (
                <div key={item.id}>
                  <Card>
                    <div className="p-2">
                      {/* TIME HEADER */}
                      <div className="flex flex-col gap-3 rounded-full bg-[#e9eef2] px-5 py-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff] sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#edf2f5] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
                            <Clock3 size={17} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#20272d]">
                              {item.time}
                            </p>
                            <p className="text-[10px] text-[#738087]">
                              {item.duration} • {item.session}
                            </p>
                          </div>
                        </div>

                        <span className="w-fit rounded-full bg-[#edf2f4] px-3 py-1.5 text-[10px] font-semibold text-[#17345b] shadow-[inset_1px_1px_3px_#d1d8dc,inset_-1px_-1px_3px_#fff]">
                          {item.type}
                        </span>
                      </div>

                      {/* COURSE DETAIL */}
                      <div className="mt-6 flex gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#edf2f5] text-[#17345b] shadow-[5px_5px_10px_#cbd3db,-5px_-5px_10px_#fff]">
                          {item.icon === "calculator" && (
                            <Calculator size={21} />
                          )}
                          {item.icon === "physics" && (
                            <span className="text-xl font-bold">∞</span>
                          )}
                          {item.icon === "book" && <BookOpen size={21} />}
                          {item.icon === "chemistry" && (
                            <FlaskConical size={21} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-[#20272d] md:text-xl">
                              {item.subject}
                            </h2>
                            <span className="w-fit rounded-full bg-[#e8edf0] px-3 py-1 text-[10px] font-medium text-[#647178]">
                              {item.sks} SKS
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[#4d5960]">
                            Topik: {item.topic}
                          </p>

                          <div className="mt-6 grid gap-3 md:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-full bg-[#edf1f4] px-4 py-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8edf0] text-[#68767d] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                                <UserRound size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] text-[#7a858a]">
                                  Tenaga Pengajar
                                </p>
                                <p className="truncate text-xs font-semibold text-[#293238]">
                                  {item.teacher}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-full bg-[#edf1f4] px-4 py-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8edf0] text-[#68767d] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]">
                                <MapPin size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] text-[#7a858a]">
                                  Lokasi Pembelajaran
                                </p>
                                <p className="truncate text-xs font-semibold text-[#293238]">
                                  {item.room}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* BREAK CARD */}
                  {index < daySchedules.length - 1 && breakItem && (
                    <BreakCard data={breakItem} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-5">
          {/* SUMMARY */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#20272d]">Ringkasan Hari Ini</h2>
              <span className="rounded-full bg-[#dcebea] px-3 py-1 text-[10px] font-semibold text-[#17345b]">
                {daySchedules.length} Sesi Aktif
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <SummaryItem
                label="Total Waktu Belajar"
                value={daySchedules.length ? totalStudyTime : "-"}
              />
              <SummaryItem
                label="Sesi Praktikum Lab"
                value={
                  daySchedules.length
                    ? `${practicalSessions} Sesi (${Math.round(
                        (practicalSessions / daySchedules.length) * 100,
                      )}%)`
                    : "-"
                }
                accent
              />
              <SummaryItem
                label="Beban SKS Harian"
                value={daySchedules.length ? `${totalSks} SKS` : "-"}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase text-[#78848a]">
                  Tingkat Kehadiran Kelas
                </span>
                <span className="text-xs font-bold text-[#17345b]">96.8%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-[#e2e8eb] p-1 shadow-[inset_2px_2px_4px_#cbd3db]">
                <div
                  className="h-full rounded-full bg-[#17345b]"
                  style={{ width: "96.8%" }}
                />
              </div>
            </div>
          </Card>

          {/* INSTRUCTIONS */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#edf2f4] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]">
                <Bell size={17} />
              </div>
              <h2 className="font-bold text-[#20272d]">Instruksi Hari Ini</h2>
            </div>

            <div className="mt-5 space-y-3">
              {instructions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md bg-[#edf1f4] px-4 py-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]"
                >
                  <p className="text-[12px] font-bold text-[#17345b]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#66747b]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* HOMEROOM TEACHER */}
          <Card>
            <h2 className="font-bold text-[#20272d]">Wali Kelas XII MIPA 1</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#7a858a]">
              Konsultasi akademik dan dispensasi kehadiran kelas.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-full bg-[#edf1f4] px-4 py-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#17345b] text-xs font-bold text-white">
                SW
              </div>
              <div>
                <p className="text-xs font-semibold text-[#293238]">
                  Dra. Sri Wahyuni
                </p>
                <p className="text-[10px] text-[#7b878d]">
                  NIP. 19780512 200312 2 001
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#edf1f4] py-2.5 text-[10px] font-semibold text-[#17345b] shadow-[4px_4px_8px_#cbd3db,-4px_-4px_8px_#fff] transition hover:-translate-y-[1px]"
            >
              <MessageSquareText size={14} />
              Kirim Pesan Konsultasi
            </button>
          </Card>
        </div>
      </div>

      {/* CALENDAR MODAL */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-[#edf1f4] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#17345b]">
                  KALENDER AKADEMIK
                </span>
                <h2 className="mt-1 text-2xl font-bold text-[#20272d]">
                  Jadwal Mingguan
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Pilih hari untuk melihat jadwal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#e8edf0] text-[#64748b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {days.map((day) => {
                const active = selectedDay === day;
                const count = allSchedules.filter(
                  (item) => item.day === day,
                ).length;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-2xl px-2 py-3 text-center transition ${
                      active
                        ? "bg-[#17345b] text-white shadow-md"
                        : "bg-[#e8edf0] text-[#475569] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{day}</span>
                    <span
                      className={`mt-1 block text-[10px] ${
                        active ? "text-white/70" : "text-[#94a3b8]"
                      }`}
                    >
                      {count} jadwal
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-[#e5eaee] p-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={17} className="text-[#17345b]" />
                <span className="font-bold text-[#20272d]">
                  Jadwal {selectedDay}
                </span>
              </div>

              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
                {allSchedules
                  .filter((item) => item.day === selectedDay)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-[#edf1f4] p-3 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#20272d]">
                            {item.subject}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#64748b]">
                            {item.teacher}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-[#17345b]">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}

                {allSchedules.filter((item) => item.day === selectedDay)
                  .length === 0 && (
                  <p className="py-4 text-center text-sm text-[#64748b]">
                    Tidak ada jadwal.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="rounded-full px-5 py-2.5 text-sm font-medium text-[#64748b] hover:bg-white/60"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSyncCalendar();
                  setShowCalendar(false);
                }}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSyncing ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {isSyncing ? "Menyinkronkan..." : "Sinkronkan Kalender"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ======================================================
// HELPER COMPONENTS
// ======================================================

function BreakCard({
  data,
}: {
  data: {
    title: string;
    description: string;
    time: string;
    duration: string;
    icon: string;
  };
}) {
  return (
    <div className="my-4 flex items-center justify-between rounded-full bg-[#e9eef2] px-5 py-3 shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#fff]">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#edf1f4] text-[#66747b] shadow-[2px_2px_6px_#cbd3db,-2px_-2px_6px_#fff]">
          {data.icon === "coffee" ? (
            <Coffee size={16} />
          ) : (
            <Utensils size={16} />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#465158]">
            {data.title}
          </span>
          <span className="text-[10px] text-[#7d898e]">{data.description}</span>
        </div>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <span className="font-mono text-xs font-bold text-[#465158]">
          {data.time}
        </span>
        <span className="text-[10px] text-[#899398]">({data.duration})</span>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full bg-[#edf1f4] px-4 py-3 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
      <span className="text-[10px] text-[#78848a]">{label}</span>
      <b
        className={`shrink-0 text-xs ${accent ? "text-[#17345b]" : "text-[#293238]"}`}
      >
        {value}
      </b>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#dcebea] px-3 py-1 text-[10px] font-bold tracking-wide text-[#17345b]">
            ● {eyebrow}
          </span>
          <span className="text-[10px] text-[#7c888e]">Minggu ke-9</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#20272d] md:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[#7b878d]">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">{action}</div>
    </div>
  );
}
