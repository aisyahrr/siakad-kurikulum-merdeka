import { useState } from "react";
import {
  School,
  Calendar,
  Lock,
  Unlock,
  Save,
  CheckCircle2,
  Database,
} from "lucide-react";

export function PengaturanAdminPage() {
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [semester, setSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [isGradeEntryLocked, setIsGradeEntryLocked] = useState(false);
  const [globalKKTP, setGlobalKKTP] = useState(70);
  const [minAttendanceWarning, setMinAttendanceWarning] = useState(75);
  const [feedback, setFeedback] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Profil Sekolah
  const [schoolProfile, setSchoolProfile] = useState({
    name: "SMA NEGERI UNGGULAN INDONESIA",
    npsn: "20104592",
    akreditasi: "A (Unggul)",
    headmaster: "Dr. H. Ahmad Sudrajat, M.Pd",
    nipHeadmaster: "197204151998021003",
    address: "Jl. Margonda Raya No. 100, Kota Depok, Jawa Barat",
    website: "https://sman-siakad.sch.id",
    phone: "(021) 77203941",
  });

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback("Konfigurasi sistem akademik dan profil sekolah berhasil disimpan.");
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleBackupDatabase = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setFeedback("Cadangan basis data (SIAKAD_DB_SNAPSHOT.sql.gz) berhasil dibuat dan disimpan.");
      setTimeout(() => setFeedback(""), 4000);
    }, 1200);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Parameter Sistem • Kontrol Pusat
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Pengaturan & Konfigurasi Sistem
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Konfigurasi tahun ajaran, kunci entri nilai rapor, profil lembaga, dan pemeliharaan server.
          </p>
        </div>

        <button
          type="button"
          onClick={handleBackupDatabase}
          disabled={isBackingUp}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:text-[#102743] sm:self-auto disabled:opacity-50"
        >
          <Database size={14} className={isBackingUp ? "animate-spin" : ""} />
          {isBackingUp ? "Membuat Snapshot..." : "Cadangkan Database"}
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Tahun Ajaran Aktif",
            value: academicYear,
            sub: `Semester ${semester}`,
            colorText: "text-[#17345b]",
          },
          {
            label: "Status Entri Nilai",
            value: isGradeEntryLocked ? "Terkunci" : "Terbuka",
            sub: isGradeEntryLocked ? "Guru Tidak Dapat Mengubah Nilai" : "Guru Bebas Melakukan Asesmen",
            colorText: isGradeEntryLocked ? "text-[#c0392b]" : "text-[#087b79]",
            isAlert: isGradeEntryLocked,
          },
          {
            label: "Standar Acuan KKTP",
            value: `${globalKKTP} Poin`,
            sub: "Ambang Batas Nilai Rapor",
            colorText: "text-[#17345b]",
          },
          {
            label: "Batas Minimum Presensi",
            value: `${minAttendanceWarning}%`,
            sub: "Pemicu Early Warning Wali Kelas",
            colorText: "text-[#087b79]",
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
            <span className={`text-[10px] ${item.isAlert ? "text-[#c0392b]" : "text-[#718086]"}`}>
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

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* PANEL 1: PERIODE AKADEMIK & KUNCI NILAI */}
        <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#d8e1e8]">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#dbe8f5] text-[#17345b]">
              <Calendar size={17} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#17345b]">
                Periode Akademik & Batas Waktu Nilai Rapor
              </h2>
              <span className="text-[11px] text-[#68777c]">
                Mengatur semester yang sedang berjalan dan penguncian masal nilai rapor.
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-bold text-[#17345b]">Tahun Ajaran</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Semester Aktif</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as "Ganjil" | "Genap")}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
              >
                <option value="Ganjil">Semester Ganjil (1)</option>
                <option value="Genap">Semester Genap (2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Standar KKTP Minimum</label>
              <input
                type="number"
                value={globalKKTP}
                onChange={(e) => setGlobalKKTP(Number(e.target.value))}
                min="50"
                max="100"
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Pemicu Early Warning Presensi (%)</label>
              <input
                type="number"
                value={minAttendanceWarning}
                onChange={(e) => setMinAttendanceWarning(Number(e.target.value))}
                min="50"
                max="95"
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>
          </div>

          {/* TOGGLE LOCK RAPOR NILAI */}
          <div className="flex flex-col gap-3 rounded-2xl bg-[#edf2f6] p-4 shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  isGradeEntryLocked ? "bg-[#fadbd8] text-[#c0392b]" : "bg-[#dcebea] text-[#087b79]"
                }`}
              >
                {isGradeEntryLocked ? <Lock size={18} /> : <Unlock size={18} />}
              </span>
              <div>
                <strong className="block text-xs font-bold text-[#20272d]">
                  Kunci Entri Nilai Asesmen Seluruh Guru (Finalisasi Rapor)
                </strong>
                <span className="text-[11px] text-[#68777c]">
                  Saat terkunci, guru pengampu tidak dapat menambah atau mengubah nilai formatif, STS, maupun SAS.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGradeEntryLocked(!isGradeEntryLocked)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition shadow-sm ${
                isGradeEntryLocked
                  ? "bg-[#c0392b] text-white hover:bg-[#a93226]"
                  : "bg-[#087b79] text-white hover:bg-[#066361]"
              }`}
            >
              {isGradeEntryLocked ? "Buka Kunci Entri" : "Kunci Nilai Sekarang"}
            </button>
          </div>
        </div>

        {/* PANEL 2: PROFIL LEMBAGA PENDIDIKAN */}
        <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#d8e1e8]">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#dbe8f5] text-[#17345b]">
              <School size={17} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#17345b]">
                Profil Satuan Pendidikan & Data Kop Surat
              </h2>
              <span className="text-[11px] text-[#68777c]">
                Informasi ini ditampilkan pada lembar pratinjau cetak rapor digital dan surat edaran.
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-[#17345b]">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={schoolProfile.name}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, name: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">NPSN Resmi</label>
              <input
                type="text"
                value={schoolProfile.npsn}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, npsn: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Akreditasi Sekolah</label>
              <input
                type="text"
                value={schoolProfile.akreditasi}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, akreditasi: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={schoolProfile.headmaster}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, headmaster: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={schoolProfile.nipHeadmaster}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, nipHeadmaster: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17345b]">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={schoolProfile.phone}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, phone: e.target.value })}
                className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17345b]">Alamat Lengkap Instansi</label>
            <input
              type="text"
              value={schoolProfile.address}
              onChange={(e) => setSchoolProfile({ ...schoolProfile, address: e.target.value })}
              className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
              required
            />
          </div>
        </div>

        {/* BOTTOM SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-6 py-2.5 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743]"
          >
            <Save size={14} />
            Simpan Seluruh Pengaturan
          </button>
        </div>
      </form>
    </section>
  );
}