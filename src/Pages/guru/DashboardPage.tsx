import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  MoreVertical,
  Clock,
  ArrowRight,
  FileEdit,
} from "lucide-react";
import { Header } from "./shared";

interface SubjectCardItem {
  id: number;
  subject: string;
  rombel: string;
  completedModules: number;
  totalModules: number;
  isDark?: boolean;
}

const subjectsList: SubjectCardItem[] = [
  {
    id: 1,
    subject: "Matematika Peminatan",
    rombel: "XII MIPA 1",
    completedModules: 10,
    totalModules: 16,
    isDark: true,
  },
  {
    id: 2,
    subject: "Matematika Peminatan",
    rombel: "XI MIPA 2",
    completedModules: 10,
    totalModules: 16,
    isDark: false,
  },
  {
    id: 3,
    subject: "Fisika Lanjutan",
    rombel: "XII MIPA 1",
    completedModules: 8,
    totalModules: 16,
    isDark: false,
  },
  {
    id: 4,
    subject: "Matematika Wajib",
    rombel: "XI MIPA 2",
    completedModules: 8,
    totalModules: 16,
    isDark: false,
  },
];

const urgentGradingQueue = [
  { id: 1, task: "Kuis Logaritma", rombel: "XII MIPA 1", pendingCount: 25 },
  {
    id: 2,
    task: "Kuis Vektor & Matriks",
    rombel: "XI MIPA 2",
    pendingCount: 18,
  },
  {
    id: 3,
    task: "Tugas Kalkulus Integral",
    rombel: "XII MIPA 1",
    pendingCount: 15,
  },
  {
    id: 4,
    task: "Formatif Diferensial",
    rombel: "XII MIPA 1",
    pendingCount: 12,
  },
];

const todaySchedule = [
  {
    time: "07:30 - 09:00",
    subject: "Matematika Peminatan",
    rombel: "XII MIPA 1",
    room: "Ruang Lab Komputer 2",
  },
  {
    time: "09:15 - 10:45",
    subject: "Fisika Lanjutan",
    rombel: "XII MIPA 1",
    room: "Ruang Kelas XII-1",
  },
  {
    time: "11:00 - 12:30",
    subject: "Matematika Wajib",
    rombel: "XI MIPA 2",
    room: "Ruang Multimedia",
  },
];

export function DashboardPage() {
  const [selectedClassFilter, setSelectedClassFilter] = useState("Semua");
  const classFilters = ["Semua", "XII MIPA 1", "XI MIPA 2"];

  const filteredSubjects = subjectsList.filter(
    (item) =>
      selectedClassFilter === "Semua" || item.rombel === selectedClassFilter,
  );

  return (
    <section className="space-y-6">
      {/* HEADER UTAMA */}
      <Header
        title="Ruang Kerja Pembelajaran"
        description="Kelola pembelajaran, evaluasi, dan perkembangan siswa pada mata pelajaran yang diampu."
      />

      {/* TOP SUMMARY 4 METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Mata Pelajaran", value: "4", icon: BookOpen },
          { label: "Pertemuan Aktif", value: "24", icon: CalendarDays },
          { label: "Kuis Menunggu", value: "8", icon: ClipboardCheck },
          { label: "Rata-rata Kelas", value: "86.4", icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3.5 rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf2f6] text-[#17345b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <span className="block text-[11px] font-semibold text-[#68777c]">
                  {item.label}
                </span>
                <strong className="block text-2xl font-extrabold text-[#17345b]">
                  {item.value}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT: 2-COLUMN DASHBOARD GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] items-start">
        {/* KOLOM KIRI: MATA PELAJARAN & PROGRESS SILABUS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#17345b]">
              Mata Pelajaran Diampu
            </h2>

            {/* FILTER PILL KELAS */}
            <div className="flex gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
              {classFilters.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                    selectedClassFilter === cls
                      ? "bg-[#17345b] text-white shadow-sm"
                      : "text-[#68777c] hover:text-[#17345b]"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* GRID KARTU MATA PELAJARAN */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredSubjects.map((card) => {
              const progressPercentage = Math.round(
                (card.completedModules / card.totalModules) * 100,
              );

              return card.isDark ? (
                /* DARK VARIANT (NAVY) */
                <div
                  key={card.id}
                  className="flex flex-col justify-between rounded-3xl bg-[#17345b] p-5 text-white shadow-[5px_5px_14px_#cbd3db]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold leading-snug tracking-tight">
                          {card.subject}
                        </h3>
                        <span className="mt-0.5 inline-block text-xs font-semibold text-[#a9c4e2]">
                          {card.rombel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-[#a9c4e2] hover:text-white"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="mt-5 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-[#c0d6ee]">
                        <span>Module Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-[#087b79] transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-1">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white">
                      {card.completedModules} Modul Selesai
                    </span>
                    <Link
                      to="/guru/pertemuan"
                      className="inline-flex items-center gap-1 rounded-full bg-[#087b79] px-3 py-1 text-[11px] font-bold text-white transition hover:bg-[#066361]"
                    >
                      Buka Modul <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* SOFT SLATE NEUMORPHIC VARIANT */
                <div
                  key={card.id}
                  className="flex flex-col justify-between rounded-3xl bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold leading-snug tracking-tight text-[#20272d]">
                          {card.subject}
                        </h3>
                        <span className="mt-0.5 inline-block text-xs font-semibold text-[#68777c]">
                          {card.rombel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-[#68777c] hover:text-[#17345b]"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="mt-5 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-semibold text-[#68777c]">
                        <span>Module Progress</span>
                        <span className="text-[#17345b]">
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#d7e0e5] shadow-inner">
                        <div
                          className="h-full rounded-full bg-[#17345b] transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-1">
                    <span className="rounded-full bg-[#edf2f6] px-3 py-1 text-[11px] font-bold text-[#68777c] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                      {card.completedModules} Modul Selesai
                    </span>
                    <Link
                      to="/guru/pertemuan"
                      className="inline-flex items-center gap-1 rounded-full bg-[#17345b] px-3 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#102743]"
                    >
                      Buka Modul <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN: WIDGET KOREKSI CEPAT & JADWAL HARI INI */}
        <div className="space-y-5">
          {/* 1. URGENT GRADING QUEUE WIDGET */}
          <div className="rounded-3xl bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div className="flex items-center gap-2">
                <FileEdit size={16} className="text-[#17345b]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17345b]">
                  Urgent Grading Queue
                </h3>
              </div>
              <span className="rounded-full bg-[#ef4444]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#ef4444]">
                8 Pending
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {urgentGradingQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-[#edf2f6] p-3 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-bold text-[#20272d]">
                      {item.task}
                    </p>
                    <span className="text-[11px] text-[#68777c]">
                      {item.rombel} •{" "}
                      <strong className="text-[#17345b]">
                        {item.pendingCount} Tugas
                      </strong>
                    </span>
                  </div>
                  <Link
                    to="/guru/nilai"
                    className="shrink-0 rounded-full bg-[#17345b] px-3 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#102743]"
                  >
                    Grade Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 2. TODAY'S TEACHING SCHEDULE WIDGET */}
          <div className="rounded-3xl bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#087b79]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17345b]">
                  Jadwal Mengajar Hari Ini
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#68777c]">
                Senin
              </span>
            </div>

            <div className="mt-3.5 space-y-3">
              {todaySchedule.map((sched, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-1">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#087b79]" />
                  <div>
                    <span className="block text-[11px] font-bold text-[#087b79]">
                      {sched.time}
                    </span>
                    <strong className="block text-xs font-extrabold text-[#20272d]">
                      {sched.subject}
                    </strong>
                    <p className="text-[11px] text-[#68777c]">
                      {sched.rombel} — {sched.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
