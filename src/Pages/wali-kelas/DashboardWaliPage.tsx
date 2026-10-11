import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BarChart3,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

interface AtRiskStudent {
  id: string;
  name: string;
  nisn: string;
  avatarLetter: string;
  riskFactor: string;
  attendanceRate: number;
  averageScore: number;
  parentPhone: string;
}

export function DashboardWaliPage() {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<"Semua" | "Presensi" | "Akademik">("Semua");

  const atRiskStudents: AtRiskStudent[] = [
    {
      id: "std-1",
      name: "Bagas Ramadhan",
      nisn: "0064928111",
      avatarLetter: "B",
      riskFactor: "Presensi 71% (<75%) & Fisika 62 (<KKTP)",
      attendanceRate: 71,
      averageScore: 68.4,
      parentPhone: "6281234567890",
    },
    {
      id: "std-2",
      name: "Dimas Pratama",
      nisn: "0064928113",
      avatarLetter: "D",
      riskFactor: "Alpa 3 Pertemuan Berturut-turut",
      attendanceRate: 74,
      averageScore: 78.2,
      parentPhone: "6281298765432",
    },
    {
      id: "std-3",
      name: "Fajar Nugraha",
      nisn: "0064928115",
      avatarLetter: "F",
      riskFactor: "Matematika Peminatan 58 (<KKTP)",
      attendanceRate: 88,
      averageScore: 69.0,
      parentPhone: "6281311223344",
    },
  ];

  const filteredRisks = atRiskStudents.filter((student) => {
    if (selectedRiskFilter === "Presensi") return student.attendanceRate < 75;
    if (selectedRiskFilter === "Akademik") return student.averageScore < 70;
    return true;
  });

  const handleOpenWhatsApp = (phone: string, studentName: string, reason: string) => {
    const text = `Yth. Orang Tua/Wali dari ${studentName}, kami dari pihak sekolah menginformasikan perkembangan ananda terkait: ${reason}. Mohon kesediaan waktu untuk berdiskusi lebih lanjut. Terima kasih.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION DENGAN ROLE SWITCHER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Rombel Binaan: XII MIPA 1 • Semester Ganjil 2024/2025
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Dashboard Monitoring Kelas
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Pantau kondisi akademik, kedisiplinan, dan mitigasi dini risiko siswa binaan.
          </p>
        </div>

        {/* ROLE SWITCHER KE GURU */}
        <Link
          to="/guru"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#e9eef3] px-4 py-2.5 text-xs font-bold text-[#17345b] shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#fff] transition hover:text-[#102743]"
        >
          <span>Pindah ke Ruang Guru</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* METRIK KELAS RINGKAS (4 CARDS) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Siswa Rombel", value: "36", icon: Users, sub: "18 Putra · 18 Putri" },
          { label: "Rata-rata Nilai Kelas", value: "88.4", icon: BarChart3, sub: "Target KKTP: 70.0" },
          { label: "Tingkat Kehadiran", value: "96.2%", icon: Clock, sub: "Akumulasi Semester" },
          { label: "Perlu Perhatian Khusus", value: "3 Siswa", icon: AlertTriangle, sub: "Terdeteksi Berisiko", alert: true },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3.5 rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] ${
                item.alert ? "border-l-4 border-[#ef4444]" : ""
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] ${
                  item.alert ? "bg-[#fadbd8] text-[#c0392b]" : "bg-[#edf2f6] text-[#17345b]"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <span className="block text-[11px] font-semibold text-[#68777c]">
                  {item.label}
                </span>
                <strong
                  className={`block text-xl font-bold ${
                    item.alert ? "text-[#c0392b]" : "text-[#17345b]"
                  }`}
                >
                  {item.value}
                </strong>
                <span className="text-[11px] text-[#86959c]">{item.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* EARLY WARNING SYSTEM PANEL */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-6">
        <div className="flex flex-col gap-3 pb-4 border-b border-[#d8e1e8] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#fadbd8] text-[#c0392b] shadow-sm">
              <AlertTriangle size={17} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#17345b]">
                Early Warning System — Siswa Butuh Pendampingan
              </h2>
              <span className="text-[11px] text-[#68777c]">
                Kriteria deteksi: Presensi &lt; 75% atau Nilai Rata-rata &lt; KKTP 70.
              </span>
            </div>
          </div>

          {/* FILTER CHIP RISIKO */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
            {(["Semua", "Presensi", "Akademik"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedRiskFilter(filter)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  selectedRiskFilter === filter
                    ? "bg-[#c0392b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* LIST SISWA BERISIKO */}
        <div className="mt-4 space-y-3">
          {filteredRisks.map((student) => (
            <div
              key={student.id}
              className="flex flex-col justify-between rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3.5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-sm font-bold text-white shadow-sm">
                  {student.avatarLetter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-bold text-[#20272d]">
                      {student.name}
                    </strong>
                    <span className="text-[11px] text-[#718086]">
                      NISN: {student.nisn}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#fadbd8] px-2.5 py-0.5 text-[10px] font-bold text-[#c0392b]">
                      {student.riskFactor}
                    </span>
                    <span className="text-[11px] text-[#68777c]">
                      Presensi: <b>{student.attendanceRate}%</b> · Rata-rata: <b>{student.averageScore}</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION QUICK BUTTONS */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(student.parentPhone, student.name, student.riskFactor)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#087b79] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#066361]"
                >
                  <Phone size={12} />
                  Hubungi Ortu
                </button>

                <Link
                  to="/wali-kelas/bimbingan"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#102743]"
                >
                  <MessageSquare size={12} />
                  Buat Log Bimbingan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}