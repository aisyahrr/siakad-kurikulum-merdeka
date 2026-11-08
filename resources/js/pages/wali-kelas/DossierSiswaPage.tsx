import { useState, useMemo } from "react";
import {
  Search,
  Phone,
} from "lucide-react";

interface SubjectGrade {
  id: string;
  subjectName: string;
  teacherName: string;
  formatif: number;
  sts: number;
  sas: number;
  finalScore: number;
  kktpPassed: boolean;
}

interface StudentDetail {
  id: string;
  name: string;
  nisn: string;
  rank: number;
  gender: "L" | "P";
  avatarLetter: string;
  status: "Aman" | "Perhatian Khusus";
  attendance: {
    hadir: number;
    izin: number;
    sakit: number;
    alpa: number;
    rate: number;
  };
  parent: {
    name: string;
    relation: string;
    phone: string;
    address: string;
  };
  grades: SubjectGrade[];
}

export function DossierSiswaPage() {
  const [students] = useState<StudentDetail[]>([
    {
      id: "std-1",
      name: "Alya Putri",
      nisn: "0064928110",
      rank: 1,
      gender: "P",
      avatarLetter: "A",
      status: "Aman",
      attendance: { hadir: 58, izin: 2, sakit: 0, alpa: 0, rate: 96.7 },
      parent: {
        name: "Ir. Hendrawan",
        relation: "Ayah Kandung",
        phone: "6281234567890",
        address: "Jl. Margonda Raya No. 45, Depok",
      },
      grades: [
        { id: "g1", subjectName: "Matematika Peminatan", teacherName: "Budi Santoso, M.Pd", formatif: 92, sts: 90, sas: 94, finalScore: 92, kktpPassed: true },
        { id: "g2", subjectName: "Fisika Lanjutan", teacherName: "Dewi Lestari, S.Si", formatif: 88, sts: 85, sas: 90, finalScore: 88, kktpPassed: true },
        { id: "g3", subjectName: "Kimia Terapan", teacherName: "Rudi Hartono, M.T", formatif: 90, sts: 88, sas: 92, finalScore: 90, kktpPassed: true },
        { id: "g4", subjectName: "Bahasa Indonesia", teacherName: "Siti Rahma, M.Pd", formatif: 95, sts: 92, sas: 95, finalScore: 94, kktpPassed: true },
      ],
    },
    {
      id: "std-2",
      name: "Bagas Ramadhan",
      nisn: "0064928111",
      rank: 34,
      gender: "L",
      avatarLetter: "B",
      status: "Perhatian Khusus",
      attendance: { hadir: 43, izin: 3, sakit: 4, alpa: 10, rate: 71.6 },
      parent: {
        name: "Drs. Bambang Sudiro",
        relation: "Ayah Kandung",
        phone: "6281298765432",
        address: "Perumahan Pesona Depok Blok C2",
      },
      grades: [
        { id: "g1", subjectName: "Matematika Peminatan", teacherName: "Budi Santoso, M.Pd", formatif: 65, sts: 60, sas: 68, finalScore: 64, kktpPassed: false },
        { id: "g2", subjectName: "Fisika Lanjutan", teacherName: "Dewi Lestari, S.Si", formatif: 62, sts: 58, sas: 65, finalScore: 62, kktpPassed: false },
        { id: "g3", subjectName: "Kimia Terapan", teacherName: "Rudi Hartono, M.T", formatif: 72, sts: 70, sas: 74, finalScore: 72, kktpPassed: true },
        { id: "g4", subjectName: "Bahasa Indonesia", teacherName: "Siti Rahma, M.Pd", formatif: 75, sts: 72, sas: 78, finalScore: 75, kktpPassed: true },
      ],
    },
    {
      id: "std-3",
      name: "Citra Lestari",
      nisn: "0064928112",
      rank: 5,
      gender: "P",
      avatarLetter: "C",
      status: "Aman",
      attendance: { hadir: 56, izin: 3, sakit: 1, alpa: 0, rate: 93.3 },
      parent: {
        name: "Nurlela S.E",
        relation: "Ibu Kandung",
        phone: "6281311223344",
        address: "Jl. Sawangan Baru No. 12, Depok",
      },
      grades: [
        { id: "g1", subjectName: "Matematika Peminatan", teacherName: "Budi Santoso, M.Pd", formatif: 85, sts: 84, sas: 88, finalScore: 86, kktpPassed: true },
        { id: "g2", subjectName: "Fisika Lanjutan", teacherName: "Dewi Lestari, S.Si", formatif: 82, sts: 80, sas: 85, finalScore: 82, kktpPassed: true },
        { id: "g3", subjectName: "Kimia Terapan", teacherName: "Rudi Hartono, M.T", formatif: 88, sts: 85, sas: 90, finalScore: 88, kktpPassed: true },
        { id: "g4", subjectName: "Bahasa Indonesia", teacherName: "Siti Rahma, M.Pd", formatif: 90, sts: 92, sas: 90, finalScore: 91, kktpPassed: true },
      ],
    },
  ]);

  const [activeStudentId, setActiveStudentId] = useState<string>("std-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Aman" | "Perhatian Khusus">("Semua");

  const filteredStudents = useMemo(() => {
    return students.filter((std) => {
      const matchSearch =
        std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.nisn.includes(searchQuery);
      const matchStatus = statusFilter === "Semua" || std.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const currentStudent =
    students.find((s) => s.id === activeStudentId) ?? students[0];

  const overallAverage = useMemo(() => {
    if (!currentStudent.grades.length) return 0;
    const total = currentStudent.grades.reduce((acc, g) => acc + g.finalScore, 0);
    return Math.round((total / currentStudent.grades.length) * 10) / 10;
  }, [currentStudent]);

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
          Portal Binaan • XII MIPA 1
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
          Dossier & Profil Siswa Binaan
        </h1>
        <p className="mt-0.5 text-xs text-[#68777c]">
          Transkrip lintas mata pelajaran, rekaman presensi akumulatif, serta data kontak wali murid.
        </p>
      </div>

      {/* MASTER-DETAIL SPLIT GRID */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
        {/* PANEL KIRI: DAFTAR SISWA */}
        <div className="rounded-[28px] bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
          {/* SEARCH BOX */}
          <div className="flex items-center gap-2 rounded-full bg-[#edf2f6] px-3.5 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            />
          </div>

          {/* FILTER STATUS PILL */}
          <div className="mt-3 flex items-center gap-1 rounded-full bg-[#e9eef3] p-1 shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
            {(["Semua", "Aman", "Perhatian Khusus"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`flex-1 rounded-full py-1 text-[10px] font-bold transition truncate px-1.5 ${
                  statusFilter === tab
                    ? "bg-[#17345b] text-white shadow-sm"
                    : "text-[#68777c] hover:text-[#17345b]"
                }`}
              >
                {tab === "Perhatian Khusus" ? "Risiko" : tab}
              </button>
            ))}
          </div>

          {/* LIST CONTAINER */}
          <div className="mt-3.5 space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-hide">
            {filteredStudents.map((std) => {
              const isSelected = std.id === currentStudent.id;
              return (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => setActiveStudentId(std.id)}
                  className={`w-full rounded-2xl p-3 text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-[#17345b] text-white shadow-[4px_4px_10px_#cbd3db]"
                      : "bg-[#edf2f6] text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${
                          isSelected ? "bg-white/15 text-white" : "bg-[#17345b] text-white"
                        }`}
                      >
                        {std.avatarLetter}
                      </span>
                      <div className="min-w-0">
                        <strong className="block truncate text-xs font-bold">
                          {std.name}
                        </strong>
                        <span
                          className={`text-[10px] ${
                            isSelected ? "text-[#c0d6ee]" : "text-[#718086]"
                          }`}
                        >
                          NISN: {std.nisn}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : std.status === "Aman"
                          ? "bg-[#dcebea] text-[#087b79]"
                          : "bg-[#fadbd8] text-[#c0392b]"
                      }`}
                    >
                      Rank #{std.rank}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL KANAN: DETAIL DOSSIER TERPILIH */}
        <div className="space-y-5">
          {/* PROFILE CARD */}
          <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#d8e1e8] pb-5">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#17345b] text-lg font-extrabold text-white shadow-sm">
                  {currentStudent.avatarLetter}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-[#17345b]">
                      {currentStudent.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        currentStudent.status === "Aman"
                          ? "bg-[#dcebea] text-[#087b79]"
                          : "bg-[#fadbd8] text-[#c0392b]"
                      }`}
                    >
                      {currentStudent.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#68777c]">
                    NISN: {currentStudent.nisn} • Jenis Kelamin: {currentStudent.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
              </div>

              {/* RATA-RATA & RANK */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <div className="rounded-2xl bg-[#edf2f6] px-3.5 py-2 text-center shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <span className="block text-[10px] font-bold text-[#68777c]">Rata-rata Mapel</span>
                  <strong className="block text-base font-extrabold text-[#17345b]">{overallAverage}</strong>
                </div>
                <div className="rounded-2xl bg-[#edf2f6] px-3.5 py-2 text-center shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff]">
                  <span className="block text-[10px] font-bold text-[#68777c]">Peringkat Kelas</span>
                  <strong className="block text-base font-extrabold text-[#087b79]">#{currentStudent.rank}</strong>
                </div>
              </div>
            </div>

            {/* RINGKASAN KEHADIRAN (4 PILLS) */}
            <div className="mt-5">
              <div className="flex items-center justify-between pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
                  Histori Kehadiran Semester Ini
                </span>
                <span className="text-xs font-bold text-[#17345b]">
                  Tingkat Kehadiran: {currentStudent.attendance.rate}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-xl bg-[#edf2f6] p-2 text-center shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <span className="block text-[10px] font-bold text-[#087b79]">Hadir</span>
                  <b className="text-sm font-extrabold text-[#087b79]">{currentStudent.attendance.hadir}</b>
                </div>
                <div className="rounded-xl bg-[#edf2f6] p-2 text-center shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <span className="block text-[10px] font-bold text-[#17345b]">Izin</span>
                  <b className="text-sm font-extrabold text-[#17345b]">{currentStudent.attendance.izin}</b>
                </div>
                <div className="rounded-xl bg-[#edf2f6] p-2 text-center shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <span className="block text-[10px] font-bold text-[#68777c]">Sakit</span>
                  <b className="text-sm font-extrabold text-[#68777c]">{currentStudent.attendance.sakit}</b>
                </div>
                <div className="rounded-xl bg-[#edf2f6] p-2 text-center shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
                  <span className="block text-[10px] font-bold text-[#ef4444]">Alpa</span>
                  <b className="text-sm font-extrabold text-[#ef4444]">{currentStudent.attendance.alpa}</b>
                </div>
              </div>
            </div>
          </div>

          {/* MULTI-MAPEL GRADE TABLE */}
          <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17345b] pb-3 border-b border-[#d8e1e8]">
              Transkrip Capaian Kurikulum Merdeka
            </h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                    <th className="py-2.5 px-2">Mata Pelajaran</th>
                    <th className="py-2.5 px-2 text-center">Formatif</th>
                    <th className="py-2.5 px-2 text-center">STS</th>
                    <th className="py-2.5 px-2 text-center">SAS</th>
                    <th className="py-2.5 px-2 text-center">Nilai Akhir</th>
                    <th className="py-2.5 px-2 text-center">KKTP (70)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce4ea] text-xs">
                  {currentStudent.grades.map((grade) => (
                    <tr key={grade.id} className="transition hover:bg-white/20">
                      <td className="py-3 px-2">
                        <strong className="block font-bold text-[#20272d]">{grade.subjectName}</strong>
                        <span className="text-[10px] text-[#718086]">{grade.teacherName}</span>
                      </td>
                      <td className="py-3 px-2 text-center font-semibold text-[#68777c]">{grade.formatif}</td>
                      <td className="py-3 px-2 text-center font-semibold text-[#68777c]">{grade.sts}</td>
                      <td className="py-3 px-2 text-center font-semibold text-[#68777c]">{grade.sas}</td>
                      <td className="py-3 px-2 text-center">
                        <b className="text-sm font-extrabold text-[#17345b]">{grade.finalScore}</b>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            grade.kktpPassed
                              ? "bg-[#dcebea] text-[#087b79]"
                              : "bg-[#fadbd8] text-[#c0392b]"
                          }`}
                        >
                          {grade.kktpPassed ? "Tuntas" : "Remedial"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PARENT & CONTACT INFORMATION */}
          <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#17345b] pb-3 border-b border-[#d8e1e8]">
              Informasi Kontak Orang Tua / Wali Murid
            </h3>
            <div className="mt-3.5 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-[#68777c]">Nama Wali:</span>
                <p className="font-extrabold text-[#20272d]">{currentStudent.parent.name} ({currentStudent.parent.relation})</p>
              </div>
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-[#68777c]">Alamat Domisili:</span>
                <p className="font-semibold text-[#20272d]">{currentStudent.parent.address}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#d8e1e8] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const text = `Halo Bapak/Ibu ${currentStudent.parent.name}, saya Wali Kelas ${currentStudent.name} (XII MIPA 1) ingin menginformasikan rekap perkembangan ananda.`;
                  window.open(`https://wa.me/${currentStudent.parent.phone}?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#087b79] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#066361]"
              >
                <Phone size={13} />
                Hubungi Orang Tua (WhatsApp)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}