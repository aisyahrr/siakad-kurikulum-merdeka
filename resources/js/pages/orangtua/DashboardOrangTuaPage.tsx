import { Link } from "@inertiajs/react";
import {
  Phone,
  CreditCard,
} from "lucide-react";

interface DashboardOrangTuaProps {
  studentInfo?: {
    name?: string;
    nisn?: string;
    rombel?: string;
    academicYear?: string;
    homeroomTeacher?: string;
    homeroomPhone?: string;
    todayStatus?: string;
    overallAverage?: number;
    rank?: number;
    attendanceRate?: number;
  };
  urgentAlerts?: Array<{
    id: number;
    title: string;
    date: string;
    desc: string;
    isImportant?: boolean;
  }>;
  recentGrades?: Array<{
    subject: string;
    type: string;
    score: number;
    kktp: number;
  }>;
  payments?: Array<{
    id: number;
    title: string;
    amount: number;
    status: "pending" | "lunas";
    due_date: string;
  }>;
}

export default function DashboardOrangTuaPage({
  studentInfo: propStudentInfo,
  urgentAlerts: propUrgentAlerts,
  recentGrades: propRecentGrades,
  payments = [],
}: DashboardOrangTuaProps = {}) {
  // Data profil anak yang terhubung ke akun orang tua
  const defaultStudentInfo = {
    name: "Alya Putri",
    nisn: "0064928110",
    rombel: "XII MIPA 1",
    academicYear: "2024/2025 (Ganjil)",
    homeroomTeacher: "Drs. Hendra Setiawan, M.Pd",
    homeroomPhone: "6281234567890",
    todayStatus: "Hadir (Tepat Waktu - 06:48 WIB)",
    overallAverage: 91.2,
    rank: 1,
    attendanceRate: 96.7,
  };

  const studentInfo = {
    ...defaultStudentInfo,
    ...propStudentInfo,
  };

  const defaultUrgentAlerts = [
    {
      id: 1,
      title: "Undangan Pertemuan Wali Murid",
      date: "Sabtu, 2 Nov 2024",
      desc: "Evaluasi capaian Sumatif Tengah Semester (STS) di Ruang Kelas XII MIPA 1.",
      isImportant: true,
    },
  ];

  const urgentAlerts = propUrgentAlerts && propUrgentAlerts.length > 0 ? propUrgentAlerts : defaultUrgentAlerts;

  const defaultRecentGrades = [
    { subject: "Matematika Peminatan", type: "Formatif #4", score: 92, kktp: 70 },
    { subject: "Fisika Lanjutan", type: "STS Ganjil", score: 88, kktp: 70 },
    { subject: "Kimia Terapan", type: "Kuis Stoikiometri", score: 90, kktp: 70 },
  ];

  const recentGrades = propRecentGrades && propRecentGrades.length > 0 ? propRecentGrades : defaultRecentGrades;

  return (
    <section className="space-y-6">
      {/* HEADER: KARTU IDENTITAS SISWA BINAAN */}
      <div className="flex flex-col gap-4 rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-xl font-black text-white shadow-sm">
            {studentInfo.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#17345b]">
                {studentInfo.rombel}
              </span>
              <span className="text-[11px] font-bold text-[#68777c]">
                NISN: {studentInfo.nisn}
              </span>
            </div>
            <h1 className="mt-0.5 text-xl font-extrabold tracking-tight text-[#17345b]">
              {studentInfo.name}
            </h1>
            <p className="text-xs text-[#68777c]">
              Wali Kelas: <b>{studentInfo.homeroomTeacher}</b>
            </p>
          </div>
        </div>

        {/* HUBUNGI WALI KELAS */}
        <button
          type="button"
          onClick={() => {
            const text = `Halo Bapak/Ibu ${studentInfo.homeroomTeacher}, saya orang tua dari ${studentInfo.name} ingin menanyakan perkembangan ananda.`;
            window.open(`https://wa.me/${studentInfo.homeroomPhone}?text=${encodeURIComponent(text)}`, "_blank");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#087b79] px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_6px_#cbd3db] transition hover:bg-[#066361] self-start sm:self-auto"
        >
          <Phone size={13} />
          <span>Kontak Wali Kelas</span>
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Presensi Hari Ini",
            value: studentInfo.todayStatus.split(" ")[0],
            sub: studentInfo.todayStatus.split(" ")[1] ?? "Tepat Waktu",
            colorText: "text-[#087b79]",
            isAlert: false,
          },
          {
            label: "Rata-rata Nilai",
            value: studentInfo.overallAverage,
            sub: "Target KKTP: 70.0",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
          {
            label: "Peringkat Kelas",
            value: `Rank #${studentInfo.rank}`,
            sub: "Dari 36 Siswa",
            colorText: "text-[#17345b]",
            isAlert: false,
          },
          {
            label: "Tingkat Kehadiran",
            value: `${studentInfo.attendanceRate}%`,
            sub: "Semester Ganjil",
            colorText: "text-[#087b79]",
            isAlert: false,
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
            <strong className={`mt-1 block text-2xl font-black ${item.colorText}`}>
              {item.value}
            </strong>
            <span className="text-[10px] text-[#68777c]">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* DUA KOLOM: WARTA PENTING & NILAI TERBARU */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* KOLOM KIRI: WARTA & PEMBERITAHUAN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#17345b]">Agenda & Warta Sekolah</h2>
            <Link href="/orang-tua/pengumuman" className="text-xs font-bold text-[#087b79] hover:underline">
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {urgentAlerts.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff] border-l-4 border-[#17345b]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[#17345b]">
                    Pertemuan Ortu
                  </span>
                  <span className="text-[11px] font-semibold text-[#68777c]">{item.date}</span>
                </div>
                <h3 className="mt-2 text-sm font-extrabold text-[#20272d]">{item.title}</h3>
                <p className="mt-1 text-xs text-[#5a6a72] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: NILAI ASESMEN TERBARU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#17345b]">Capaian Asesmen Terakhir</h2>
            <Link href="/orang-tua/nilai" className="text-xs font-bold text-[#087b79] hover:underline">
              Buku Nilai Lengkap
            </Link>
          </div>

          <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <div className="divide-y divide-[#dce4ea]">
              {recentGrades.map((g, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <strong className="block text-xs font-bold text-[#20272d]">{g.subject}</strong>
                    <span className="text-[11px] text-[#718086]">{g.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-base font-black text-[#17345b]">{g.score}</span>
                    <span className="rounded-full bg-[#dcebea] px-2 py-0.5 text-[9px] font-extrabold text-[#087b79]">
                      Tuntas KKTP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL SPP & ADMINISTRASI */}
      {payments && payments.length > 0 && (
        <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#17345b]" />
              <h2 className="text-sm font-extrabold text-[#17345b]">Status Pembayaran & SPP Terkini</h2>
            </div>
            <Link href="/orang-tua/keuangan" className="text-xs font-bold text-[#087b79] hover:underline">
              Kelola Pembayaran
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {payments.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-2xl bg-[#edf2f6] p-3.5 shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#17345b]">{p.title}</h4>
                  <span className="text-[10px] text-[#68777c]">Jatuh Tempo: {p.due_date}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-extrabold text-[#17345b]">Rp {Number(p.amount).toLocaleString('id-ID')}</span>
                  <span className={`inline-block text-[9px] font-black uppercase rounded-full px-2 py-0.5 ${p.status === 'lunas' ? 'bg-[#dcebea] text-[#087b79]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}