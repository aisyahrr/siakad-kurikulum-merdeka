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
import { Link } from "react-router-dom";
import { Card } from "@/Components/ui/Card";
import { useStudentDashboard } from "@/Hooks/siswa/useStudentDashboard";

const pill =
  "inline-flex items-center gap-1 rounded-full bg-[#e5ebf1] px-3 py-1.5 text-[10px] font-semibold text-[#17345b] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff]";

function ScheduleStatus({ status }: { status: string }) {
  if (status === "Selesai") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#edf2f5] px-3 py-1.5 text-[10px] font-medium text-[#53636d]">
        <CircleCheck size={12} />
        Selesai
      </span>
    );
  }

  if (status === "Sedang Berlangsung") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#dce5f4] px-3 py-1.5 text-[10px] font-semibold text-[#17345b]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#17345b]" />
        Sedang Berlangsung
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#edf1f3] px-3 py-1.5 text-[10px] font-medium text-[#65747b]">
      Mendatang
    </span>
  );
}

export function StudentDashboard() {
  const { student, attendance, schedules, announcements } = useStudentDashboard();

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#65747b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#17345b]" />
            Rabu, 24 Oktober 2024
            <span className="text-[#c0c8ce]">•</span>
            Semester {student.semester} Aktif
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#20262b] md:text-[42px]">
            Selamat datang kembali, {student.name}
          </h1>

          <p className="mt-2 text-sm text-[#758188]">
            Berikut ringkasan aktivitas akademik kamu hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-[#e8edf1] px-4 py-2 text-[10px] font-medium text-[#69767c] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff] md:block">
            NISN: {student.nisn}
          </span>

          <span className="rounded-full bg-[#e8edf1] px-4 py-2 text-[10px] font-semibold text-[#17345b] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff]">
            Status: {student.status}
          </span>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* GPA */}
        <Card>
          <div className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8edf2] text-[#17345b] shadow-[3px_3px_8px_#cbd3db,-2px_-2px_7px_#fff]">
                  <Award size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#7b878d]">
                    Performa akademik kumulatif
                  </p>
                  <h2 className="text-base font-semibold text-[#293138]">
                    Indeks Prestasi & Peringkat
                  </h2>
                </div>
              </div>

              <span className="flex items-center gap-1 rounded-full bg-[#e6edf5] px-3 py-1.5 text-[10px] font-semibold text-[#17345b]">
                <TrendingUp size={12} />+{student.gpaIncrease} semester lalu
              </span>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <p className="text-[10px] text-[#78858b]">
                  Indeks Prestasi Kumulatif
                </p>
                <div className="mt-1 flex items-baseline">
                  <strong className="text-5xl font-bold tracking-tight text-[#20262b]">
                    {student.gpa}
                  </strong>
                  <span className="ml-1 text-xl text-[#7b878d]">
                    / {student.maxGpa}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#e9eef2] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                  <p className="text-[10px] text-[#7b878d]">Beban SKS</p>
                  <p className="mt-1 text-lg font-bold text-[#293138]">
                    {student.activeCredits}
                    <span className="ml-1 text-xs font-normal">SKS Aktif</span>
                  </p>
                </div>

                <div className="rounded-xl bg-[#e9eef2] p-4 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                  <p className="text-[10px] text-[#7b878d]">Ranking Kelas</p>
                  <p className="mt-1 text-lg font-bold text-[#17345b]">
                    #{student.rank}
                    <span className="ml-1 text-xs font-normal text-[#7b878d]">
                      dari {student.totalStudents} siswa
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-[#d9dfe3] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-[10px] text-[#7c888e]">
                <Info size={13} />
                Diperbarui pada 23 Okt 2024 oleh Wali Kelas
              </span>

              <Link to="/siswa/nilai" className={pill}>
                <FileText size={13} />
                Lihat Transkrip Lengkap
              </Link>
            </div>
          </div>
        </Card>

        {/* ATTENDANCE */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8edf2] text-[#17345b] shadow-[3px_3px_8px_#cbd3db,-2px_-2px_7px_#fff]">
                <CalendarDays size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#7b878d]">Presensi semester</p>
                <h2 className="text-base font-semibold">Tingkat Kehadiran</h2>
              </div>
            </div>

            <span className="rounded-full bg-[#dbe7f6] px-3 py-1.5 text-[10px] font-semibold text-[#17345b]">
              Sangat Baik
            </span>
          </div>

          <div className="mt-7 flex items-center justify-between gap-5">
            {/* DONUT */}
            <div
              className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(
                  #17345b ${attendance.percentage}%,
                  #d8e0e7 ${attendance.percentage}% 100%
                )`,
              }}
            >
              <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-[#edf1f4] shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#20262b]">{attendance.percentage}%</p>
                  <p className="text-[10px] text-[#7b878d]">
                    {attendance.present}/{attendance.total} SESI
                  </p>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-3 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#17345b]" />
                <span className="text-[#53636d]">Hadir</span>
                <strong className="ml-auto text-[#303a40]">{attendance.present} Sesi</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#8c979a]" />
                <span className="text-[#53636d]">Izin</span>
                <strong className="ml-auto">{attendance.permission} Sesi</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#65716f]" />
                <span className="text-[#53636d]">Sakit</span>
                <strong className="ml-auto">{attendance.sick} Sesi</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#c93434]" />
                <span className="text-[#53636d]">Alpa</span>
                <strong className="ml-auto">{attendance.absent} Sesi</strong>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#d9dfe3] pt-4">
            <span className="text-[10px] text-[#7b878d]">
              Batas Toleransi Absen: Maks {attendance.maxAbsent} Sesi
            </span>

            <Link
              to="/siswa/presensi"
              className="grid h-7 w-7 place-items-center rounded-full bg-[#e8edf1] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
            >
              <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      </div>

      {/* TODAY SCHEDULE */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div className="border-l-4 border-[#17345b] pl-3 rounded-l-md">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#17345b]">
              Agenda hari ini
            </p>
            <h2 className="text-xl font-bold text-[#293138]">Jadwal Hari Ini • Rabu</h2>
            <p className="text-[10px] text-[#7b878d]">
              {schedules.length} sesi pembelajaran terjadwal
            </p>
          </div>

          <Link className={`${pill} hidden sm:inline-flex`} to="/siswa/jadwal">
            Lihat Semua Jadwal
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="space-y-3">
          {schedules.map((item) => (
            <Card
              key={item.id}
              className={item.status === "Sedang Berlangsung" ? "border-l-4 border-l-[#17345b]" : ""}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex w-full shrink-0 items-center gap-3 lg:w-36 lg:flex-col lg:gap-0 lg:rounded-xl lg:bg-[#e9eef2] lg:p-3 lg:shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
                  <span className="text-sm font-bold text-[#17345b] lg:mt-1">{item.time}</span>
                  <span className="text-[10px] uppercase text-[#7b878d]">Sesi {item.session}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#293138]">{item.subject}</h3>
                    <span className="rounded-full bg-[#edf1f3] px-2.5 py-1 text-[10px] text-[#66747b]">
                      {item.type}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-col gap-1 text-[10px] text-[#707d83] sm:flex-row sm:gap-5">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {item.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserRound size={11} /> {item.teacher}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 lg:justify-end">
                  <ScheduleStatus status={item.status} />

                  {item.status === "Selesai" && (
                    <button className="grid h-9 w-9 place-items-center rounded-full bg-[#e8edf1] text-[#637179] shadow-[3px_3px_7px_#cbd3db,-2px_-2px_6px_#fff]">
                      <FolderOpen size={15} />
                    </button>
                  )}

                  {item.status === "Sedang Berlangsung" && (
                    <>
                      <Link
                        to="/siswa/presensi"
                        className="rounded-full bg-[#e8edf1] px-4 py-2 text-[10px] font-semibold text-[#53636d] shadow-[inset_1px_1px_3px_#cbd3db,inset_-1px_-1px_3px_#fff]"
                      >
                        <Check size={12} className="mr-1 inline" /> Isi Presensi
                      </Link>
                      <Link
                        to="/siswa/materi"
                        className="rounded-full bg-[#17345b] px-4 py-2 text-[10px] font-semibold text-white shadow-[4px_4px_8px_#c6ced6]"
                      >
                        <BookOpen size={12} className="mr-1 inline" /> Buka Modul
                      </Link>
                    </>
                  )}

                  {item.status === "Mendatang" && (
                    <Link
                      to="/siswa/materi"
                      className="grid h-9 w-9 place-items-center rounded-full bg-[#e8edf1] text-[#65737a] shadow-[3px_3px_7px_#cbd3db,-2px_-2px_6px_#fff]"
                    >
                      <BookOpen size={14} />
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
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#17345b]">
              Informasi terbaru
            </p>
            <h2 className="text-xl font-bold text-[#293138]">Pengumuman</h2>
          </div>

          <Link className={pill} to="/siswa/pengumuman">
            Lihat semua
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e8edf2] text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-2px_-2px_6px_#fff]">
                  <FileText size={16} />
                </div>
                <span className={pill}>{item.category}</span>
              </div>

              <h3 className="mt-5 text-sm font-bold text-[#293138]">{item.title}</h3>
              <p className="mt-2 text-[10px] text-[#7b878d]">{item.date}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}