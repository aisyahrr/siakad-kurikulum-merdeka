import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  FileText,
  MapPin,
  UserRound,
  Info,
  TrendingUp,
  CircleCheck,
  FolderOpen,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/ui/Card";
import { useStudentDashboard } from "@/hooks/siswa/useStudentDashboard";

const pill =
  "inline-flex items-center gap-1.5 rounded-full bg-[#E4EBF5] px-3.5 py-1.5 text-[11px] font-semibold text-[#17345B] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]";

function ScheduleStatus({ status }: { status: string }) {
  if (status === "Selesai") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4EBF5] px-3 py-1.5 text-[10px] font-medium text-[#64748B] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
        <CircleCheck size={12} className="text-[#64748B]" />
        Selesai
      </span>
    );
  }

  if (status === "Sedang Berlangsung") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#17345B] px-3.5 py-1.5 text-[10px] font-semibold text-white shadow-[4px_4px_8px_#cbced1]">
        <span className="h-2 w-2 rounded-full bg-[#E4C98E] animate-pulse" />
        Sedang Berlangsung
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4EBF5] px-3 py-1.5 text-[10px] font-medium text-[#64748B] shadow-[3px_3px_6px_#cbced1,-3px_-3px_6px_#ffffff]">
      Mendatang
    </span>
  );
}

export default function StudentDashboardPage() {
  const { student, attendance, schedules, announcements } = useStudentDashboard();

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#64748B]">
            <span className="h-2 w-2 rounded-full bg-[#B18A42]" />
            Rabu, 24 Oktober 2024
            <span className="text-[#cbd5e1]">•</span>
            Semester {student.semester} Aktif
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#17345B] md:text-4xl lg:text-5xl">
            Selamat datang kembali, {student.name}
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            Berikut ringkasan aktivitas akademik kamu hari ini di Jeguk High School.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-[#E4EBF5] px-4 py-2 text-xs font-bold text-[#64748B] shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff] md:block">
            NISN: {student.nisn}
          </span>

          <span className="rounded-full bg-[#E4EBF5] px-4 py-2 text-xs font-bold text-[#17345B] shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff]">
            Status: {student.status}
          </span>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* GPA & ACADEMIC PERFORMANCE */}
        <Card className="rounded-3xl bg-[#E4EBF5] p-6 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border-0">
          <div className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E4EBF5] text-[#B18A42] shadow-[6px_6px_12px_#cbced1]">
                  <Award size={22} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Performa Akademik Kumulatif
                  </p>
                  <h2 className="text-base font-bold text-[#17345B]">
                    Indeks Prestasi & Peringkat
                  </h2>
                </div>
              </div>

              <span className="flex items-center gap-1.5 rounded-full bg-[#E4EBF5] px-3.5 py-1.5 text-xs font-bold text-[#17345B] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                <TrendingUp size={13} className="text-[#B18A42]" />+{student.gpaIncrease} semester lalu
              </span>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <p className="text-xs font-medium text-[#64748B]">
                  Indeks Prestasi Kumulatif
                </p>
                <div className="mt-1.5 flex items-baseline">
                  <strong className="text-5xl font-black tracking-tight text-[#17345B]">
                    {student.gpa}
                  </strong>
                  <span className="ml-1.5 text-xl font-semibold text-[#64748B]">
                    / {student.maxGpa}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#E4EBF5] p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Beban SKS</p>
                  <p className="mt-1 text-lg font-bold text-[#17345B]">
                    {student.activeCredits}
                    <span className="ml-1 text-xs font-normal text-[#64748B]">SKS</span>
                  </p>
                </div>

                <div className="rounded-2xl bg-[#E4EBF5] p-4 shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Ranking Kelas</p>
                  <p className="mt-1 text-lg font-bold text-[#B18A42]">
                    #{student.rank}
                    <span className="ml-1 text-xs font-normal text-[#64748B]">
                      /{student.totalStudents}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#cbd5e1] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-xs text-[#64748B]">
                <Info size={14} className="text-[#B18A42]" />
                Diperbarui pada 23 Okt 2024 oleh Wali Kelas
              </span>

              <Link href="/siswa/nilai" className={pill}>
                <FileText size={14} />
                Lihat Transkrip Lengkap
              </Link>
            </div>
          </div>
        </Card>

        {/* ATTENDANCE */}
        <Card className="rounded-3xl bg-[#E4EBF5] p-6 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E4EBF5] text-[#17345B] shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff]">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Presensi Semester</p>
                <h2 className="text-base font-bold text-[#17345B]">Tingkat Kehadiran</h2>
              </div>
            </div>

            <span className="rounded-full bg-[#E4EBF5] px-3.5 py-1.5 text-xs font-bold text-[#B18A42] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
              Sangat Baik
            </span>
          </div>

          <div className="mt-7 flex items-center justify-between gap-5">
            {/* DONUT */}
            <div
              className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full shadow-[6px_6px_12px_#cbced1,-6px_-6px_12px_#ffffff]"
              style={{
                background: `conic-gradient(
                  #17345B ${attendance.percentage}%,
                  #cbd5e1 ${attendance.percentage}% 100%
                )`,
              }}
            >
              <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-[#E4EBF5] shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                <div className="text-center">
                  <p className="text-xl font-black text-[#17345B]">{attendance.percentage}%</p>
                  <p className="text-[9px] font-bold text-[#64748B]">
                    {attendance.present}/{attendance.total} SESI
                  </p>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-2.5 text-xs w-full max-w-[150px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#17345B]" />
                <span className="text-[#64748B]">Hadir</span>
                <strong className="ml-auto text-[#17345B]">{attendance.present}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B18A42]" />
                <span className="text-[#64748B]">Izin</span>
                <strong className="ml-auto text-[#17345B]">{attendance.permission}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#64748B]" />
                <span className="text-[#64748B]">Sakit</span>
                <strong className="ml-auto text-[#17345B]">{attendance.sick}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
                <span className="text-[#64748B]">Alpa</span>
                <strong className="ml-auto text-[#dc2626]">{attendance.absent}</strong>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#cbd5e1] pt-4">
            <span className="text-xs text-[#64748B]">
              Batas Absen: Maks {attendance.maxAbsent} Sesi
            </span>

            <Link
              href="/siswa/presensi"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#E4EBF5] text-[#17345B] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_2px_2px_4px_#cbced1]"
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </Card>
      </div>

      {/* TODAY SCHEDULE */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div className="border-l-4 border-[#B18A42] pl-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B18A42]">
              Agenda Hari Ini
            </p>
            <h2 className="text-2xl font-bold text-[#17345B]">Jadwal Pembelajaran • Rabu</h2>
            <p className="text-xs text-[#64748B]">
              {schedules.length} sesi pembelajaran terjadwal hari ini
            </p>
          </div>

          <Link href="/siswa/jadwal" className={`${pill} hidden sm:inline-flex`}>
            Lihat Semua Jadwal
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {schedules.map((item) => (
            <Card
              key={item.id}
              className={`rounded-2xl bg-[#E4EBF5] p-5 shadow-[8px_8px_16px_#cbced1,-8px_-8px_16px_#ffffff] border-0 transition-all ${
                item.status === "Sedang Berlangsung" ? "border-l-4 border-l-[#17345B] shadow-[inset_2px_2px_6px_#cbced1]" : ""
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex w-full shrink-0 items-center justify-between gap-3 lg:w-38 lg:flex-col lg:justify-center lg:gap-1 lg:rounded-2xl lg:bg-[#E4EBF5] lg:p-3.5 lg:shadow-[inset_3px_3px_6px_#cbced1,inset_-3px_-3px_6px_#ffffff]">
                  <span className="text-sm font-bold text-[#17345B]">{item.time}</span>
                  <span className="rounded-full bg-[#E4EBF5] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#64748B] shadow-[2px_2px_4px_#cbced1,-2px_-2px_4px_#ffffff]">
                    Sesi {item.session}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-[#17345B]">{item.subject}</h3>
                    <span className="rounded-full bg-[#E4EBF5] px-3 py-1 text-[10px] font-semibold text-[#64748B] shadow-[inset_2px_2px_4px_#cbced1,inset_-2px_-2px_4px_#ffffff]">
                      {item.type}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-2 text-xs text-[#64748B] sm:flex-row sm:gap-6">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#B18A42]" /> {item.room}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <UserRound size={13} className="text-[#B18A42]" /> {item.teacher}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <ScheduleStatus status={item.status} />

                  {item.status === "Selesai" && (
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-[#E4EBF5] text-[#64748B] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] transition-all hover:shadow-[inset_2px_2px_4px_#cbced1]">
                      <FolderOpen size={16} />
                    </button>
                  )}

                  {item.status === "Sedang Berlangsung" && (
                    <>
                      <Link
                        href="/siswa/presensi"
                        className="rounded-full bg-[#E4EBF5] px-4 py-2 text-xs font-semibold text-[#17345B] shadow-[4px_4px_8px_#cbced1,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_2px_2px_4px_#cbced1]"
                      >
                        <Check size={13} className="mr-1.5 inline text-[#10b981]" /> Isi Presensi
                      </Link>
                      <Link
                        href="/siswa/materi"
                        className="rounded-full bg-[#17345B] px-4 py-2 text-xs font-semibold text-white shadow-[4px_4px_8px_#cbced1] transition-all hover:bg-[#10243D]"
                      >
                        <BookOpen size={13} className="mr-1.5 inline text-[#E4C98E]" /> Buka Modul
                      </Link>
                    </>
                  )}

                  {item.status === "Mendatang" && (
                    <Link
                      href="/siswa/materi"
                      className="grid h-10 w-10 place-items-center rounded-full bg-[#E4EBF5] text-[#17345B] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff] transition-all hover:shadow-[inset_2px_2px_4px_#cbced1]"
                    >
                      <BookOpen size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <div className="border-l-4 border-[#B18A42] pl-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B18A42]">
              Informasi Terbaru
            </p>
            <h2 className="text-2xl font-bold text-[#17345B]">Pengumuman Sekolah</h2>
          </div>

          <Link className={pill} href="/siswa/pengumuman">
            Lihat Semua
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {announcements.map((item) => (
            <Card key={item.id} className="rounded-3xl bg-[#E4EBF5] p-6 shadow-[10px_10px_20px_#cbced1,-10px_-10px_20px_#ffffff] border-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#E4EBF5] text-[#17345B] shadow-[5px_5px_10px_#cbced1,-5px_-5px_10px_#ffffff]">
                    <FileText size={18} />
                  </div>
                  <span className={pill}>{item.category}</span>
                </div>

                <h3 className="mt-5 text-base font-bold text-[#17345B]">{item.title}</h3>
              </div>

              <p className="mt-6 text-xs font-semibold text-[#64748B] border-t border-[#cbd5e1] pt-4">
                {item.date}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}