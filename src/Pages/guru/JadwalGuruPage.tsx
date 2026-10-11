import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Header } from "./shared";
import { schedules, subjects, rombels } from "@/data/academic.data";

export function JadwalGuruPage() {
  const [selectedDay, setSelectedDay] = useState("Semua");
  const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const teacherSchedules = schedules.filter(
    (item) => item.teacherId === "teacher-hendra",
  );

  const filteredItems = teacherSchedules.filter(
    (item) => selectedDay === "Semua" || item.day === selectedDay,
  );

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <Header
        title="Jadwal Mengajar"
        description="Jadwal berdasarkan mata pelajaran dan rombel yang menjadi tanggung jawab Anda."
      />

      {/* FILTER HARI & QUICK COUNTER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* DAY FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-1.5">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold transition shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] ${
                selectedDay === day
                  ? "bg-[#17345b] text-white"
                  : "bg-[#e9eef3] text-[#68777c] hover:text-[#17345b]"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* METRICS PILL */}
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e9eef3] px-4 py-1.5 text-xs font-semibold text-[#5d6c73] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
          <Sparkles size={14} className="text-[#17345b]" />
          Total{" "}
          <strong className="text-[#17345b]">
            {teacherSchedules.length} Sesi
          </strong>{" "}
          Terjadwal
        </span>
      </div>

      {/* GRID KARTU JADWAL */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const subjectName =
            subjects.find((subject) => subject.id === item.subjectId)?.name ??
            "Mata Pelajaran";
          const rombelName =
            rombels.find((rombel) => rombel.id === item.rombelId)?.name ??
            "Kelas";

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                {/* TOP ROW: DAY, TIME, & CLASS BADGE */}
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3 py-1 text-[11px] font-bold text-[#087b79] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                    <Clock size={12} />
                    <span>
                      {item.day} • {item.time}
                    </span>
                  </div>

                  <span className="rounded-full bg-[#dbe8f5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                    {rombelName}
                  </span>
                </div>

                {/* SUBJECT TITLE */}
                <div className="mt-3.5">
                  <h2 className="text-base font-extrabold leading-snug tracking-tight text-[#17345b]">
                    {subjectName}
                  </h2>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#68777c]">
                    <MapPin size={12} className="text-[#17345b]" />
                    <span>{item.room}</span>
                  </div>
                </div>

                {/* TOPIC INSET BOX */}
                <div className="mt-4 rounded-2xl bg-[#edf2f6] p-3 text-xs leading-relaxed text-[#516168] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#75848a]">
                    Topik Bahasan Sesi
                  </span>
                  <p className="mt-0.5 font-semibold text-[#20272d]">
                    {item.topic ||
                      "Materi instruksional dan pendalaman konsep kurikulum."}
                  </p>
                </div>
              </div>

              {/* CARD ACTIONS FOOTER */}
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#d8e1e8] pt-3.5">
                <Link
                  to="/guru/presensi"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-3.5 py-1.5 text-[11px] font-bold text-[#55636a] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] transition hover:text-[#17345b]"
                >
                  <ClipboardCheck size={13} />
                  Presensi Sesi
                </Link>

                <Link
                  to="/guru/pertemuan"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[2px_2px_5px_#cbd3db] transition hover:bg-[#102743]"
                >
                  Buka Modul
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-[#e9eef3] py-14 text-center shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <CalendarDays size={36} className="text-[#88989e]" />
          <h3 className="mt-3 text-sm font-bold text-[#20272d]">
            Tidak ada jadwal mengajar pada hari {selectedDay}
          </h3>
          <p className="mt-0.5 text-xs text-[#75848a]">
            Pilih hari lain atau klik tab "Semua" untuk melihat seluruh agenda
            mingguan.
          </p>
        </div>
      )}
    </section>
  );
}
