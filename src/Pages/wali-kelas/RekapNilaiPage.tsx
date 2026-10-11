import { useState, useMemo } from "react";
import {
  Download,
  Printer,
  Search,
  Sparkles,
  X,
  GraduationCap,
} from "lucide-react";

interface StudentMasterGrade {
  rank: number;
  id: string;
  name: string;
  nisn: string;
  matematika: number;
  fisika: number;
  kimia: number;
  biologi: number;
  bIndo: number;
  bInggris: number;
  hadirPercent: number;
}

export function RekapNilaiPage() {
  const [students] = useState<StudentMasterGrade[]>([
    {
      id: "std-1",
      name: "Alya Putri",
      nisn: "0064928110",
      matematika: 92,
      fisika: 88,
      kimia: 90,
      biologi: 94,
      bIndo: 94,
      bInggris: 96,
      hadirPercent: 96.7,
      rank: 1,
    },
    {
      id: "std-2",
      name: "Citra Lestari",
      nisn: "0064928112",
      matematika: 86,
      fisika: 82,
      kimia: 88,
      biologi: 90,
      bIndo: 91,
      bInggris: 92,
      hadirPercent: 93.3,
      rank: 2,
    },
    {
      id: "std-3",
      name: "Eka Rahmawati",
      nisn: "0064928114",
      matematika: 88,
      fisika: 80,
      kimia: 85,
      biologi: 86,
      bIndo: 90,
      bInggris: 89,
      hadirPercent: 95.0,
      rank: 3,
    },
    {
      id: "std-4",
      name: "Dimas Pratama",
      nisn: "0064928113",
      matematika: 78,
      fisika: 75,
      kimia: 80,
      biologi: 82,
      bIndo: 85,
      bInggris: 80,
      hadirPercent: 74.0,
      rank: 4,
    },
    {
      id: "std-5",
      name: "Bagas Ramadhan",
      nisn: "0064928111",
      matematika: 64,
      fisika: 62,
      kimia: 72,
      biologi: 75,
      bIndo: 75,
      bInggris: 70,
      hadirPercent: 71.6,
      rank: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [printStudent, setPrintStudent] = useState<StudentMasterGrade | null>(null);

  // Kalkulasi total dan ranking otomatis
  const rankedStudents = useMemo(() => {
    const list = students.map((std) => {
      const total =
        std.matematika +
        std.fisika +
        std.kimia +
        std.biologi +
        std.bIndo +
        std.bInggris;
      const average = Math.round((total / 6) * 10) / 10;
      return { ...std, total, average };
    });

    list.sort((a, b) => b.average - a.average);

    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return rankedStudents.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery)
    );
  }, [rankedStudents, searchQuery]);

  // Ekspor CSV Handler
  const handleExportCSV = () => {
    const headers = "Peringkat,Nama,NISN,Matematika,Fisika,Kimia,Biologi,B.Indo,B.Inggris,Rata-rata,Kehadiran (%)\n";
    const rows = rankedStudents
      .map(
        (s) =>
          `${s.rank},"${s.name}",${s.nisn},${s.matematika},${s.fisika},${s.kimia},${s.biologi},${s.bIndo},${s.bInggris},${s.average},${s.hadirPercent}%`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Rekap_Nilai_Rapor_XII_MIPA_1.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Rapor Kurikulum Merdeka • Semester Ganjil 2024/2025
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Rekap Nilai & Cetak Rapor Kelas
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Master spreadsheet kompilasi capaian seluruh mata pelajaran rombel XII MIPA 1.
          </p>
        </div>

        {/* TOP BUTTON ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#17345b] shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] transition hover:text-[#102743]"
          >
            <Download size={14} />
            Ekspor CSV
          </button>
        </div>
      </div>

      {/* SPREADSHEET CARD CONTAINER */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        {/* SUBHEADER: SEARCH & SUMMARY */}
        <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2.5 rounded-full bg-[#edf2f6] px-4 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-80">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari siswa dalam rekap..."
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2f6] px-3.5 py-1.5 text-xs font-semibold text-[#17345b] shadow-[inset_1px_1px_2px_#cbd3db,inset_-1px_-1px_2px_#fff]">
              <Sparkles size={13} className="text-[#087b79]" />
              KKTP Acuan: <b>70.0</b>
            </span>
          </div>
        </div>

        {/* TABEL MASTER SPREADSHEET */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-2 text-center">Rank</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-2 text-center">MTK</th>
                <th className="py-3 px-2 text-center">FIS</th>
                <th className="py-3 px-2 text-center">KIM</th>
                <th className="py-3 px-2 text-center">BIO</th>
                <th className="py-3 px-2 text-center">IND</th>
                <th className="py-3 px-2 text-center">ING</th>
                <th className="py-3 px-2 text-center">Rata-rata</th>
                <th className="py-3 px-2 text-center">Kehadiran</th>
                <th className="py-3 px-3 text-center">Aksi Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filteredStudents.map((row) => {
                const isPassed = row.average >= 70;

                return (
                  <tr key={row.id} className="transition hover:bg-white/30">
                    {/* RANK */}
                    <td className="py-3.5 px-2 text-center">
                      <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-[#17345b] text-[11px] font-extrabold text-white">
                        {row.rank}
                      </span>
                    </td>

                    {/* NAME */}
                    <td className="py-3.5 px-3">
                      <strong className="block font-bold text-[#20272d]">{row.name}</strong>
                      <span className="text-[10px] text-[#718086]">NISN: {row.nisn}</span>
                    </td>

                    {/* SUBJECTS */}
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.matematika}</td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.fisika}</td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.kimia}</td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.biologi}</td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.bIndo}</td>
                    <td className="py-3.5 px-2 text-center font-semibold text-[#5a6a72]">{row.bInggris}</td>

                    {/* RATA-RATA AKHIR */}
                    <td className="py-3.5 px-2 text-center">
                      <strong
                        className={`text-sm font-extrabold ${
                          isPassed ? "text-[#17345b]" : "text-[#c0392b]"
                        }`}
                      >
                        {row.average}
                      </strong>
                    </td>

                    {/* KEHADIRAN */}
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          row.hadirPercent >= 75
                            ? "bg-[#dcebea] text-[#087b79]"
                            : "bg-[#fadbd8] text-[#c0392b]"
                        }`}
                      >
                        {row.hadirPercent}%
                      </span>
                    </td>

                    {/* CETAK RAPOR ACTION */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setPrintStudent(row)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#102743]"
                      >
                        <Printer size={12} />
                        Cetak Rapor
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          MODAL CETAK RAPOR DIGITAL RESMI (A4 / LEGAL FORMAT)
      ==================================================================== */}
      {printStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex h-[92vh] w-full max-w-4xl flex-col rounded-[32px] bg-[#f8fafc] p-6 shadow-2xl overflow-hidden">
            {/* MODAL ACTION BAR */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold text-gray-500">
                Pratinjau Lembar Hasil Belajar Siswa (Rapor Digital)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Printer size={13} />
                  Print Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => setPrintStudent(null)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-gray-600 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* PRINT CANVAS (A4 STYLE FORMAT) */}
            <div className="mt-4 flex-1 overflow-y-auto bg-white p-8 text-gray-800 shadow-sm rounded-2xl border border-gray-200">
              {/* KOP SURAT SEKOLAH */}
              <div className="flex items-center gap-4 border-b-2 border-gray-800 pb-4 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#17345b] text-white">
                  <GraduationCap size={32} />
                </div>
                <div className="flex-1 text-center pr-16">
                  <h2 className="text-base font-extrabold tracking-wide uppercase">
                    PEMERINTAH PROVINSI JAWA BARAT
                  </h2>
                  <h3 className="text-lg font-black tracking-wider uppercase text-[#17345b]">
                    SMA NEGERI UNGGULAN INDONESIA
                  </h3>
                  <p className="text-[11px] text-gray-600">
                    Jl. Margonda Raya No. 100, Kota Depok • Website: www.sman-siakad.sch.id
                  </p>
                </div>
              </div>

              {/* IDENTITAS SISWA */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex"><span className="w-28 text-gray-500">Nama Siswa</span>: <b className="ml-2">{printStudent.name}</b></div>
                  <div className="flex"><span className="w-28 text-gray-500">NISN</span>: <span className="ml-2">{printStudent.nisn}</span></div>
                  <div className="flex"><span className="w-28 text-gray-500">Kelas / Fase</span>: <span className="ml-2">XII MIPA 1 / Fase F</span></div>
                </div>
                <div className="space-y-1">
                  <div className="flex"><span className="w-28 text-gray-500">Semester</span>: <span className="ml-2">Ganjil (1)</span></div>
                  <div className="flex"><span className="w-28 text-gray-500">Tahun Ajaran</span>: <span className="ml-2">2024/2025</span></div>
                  <div className="flex"><span className="w-28 text-gray-500">Peringkat Kelas</span>: <b className="ml-2">Rank #{printStudent.rank}</b></div>
                </div>
              </div>

              {/* TABEL CAPAIAN MATA PELAJARAN */}
              <div className="mt-6">
                <table className="w-full text-left text-xs border border-gray-300">
                  <thead className="bg-gray-100 text-[11px] font-bold text-gray-700">
                    <tr className="border-b border-gray-300">
                      <th className="py-2.5 px-3 border-r border-gray-300 text-center w-10">No</th>
                      <th className="py-2.5 px-3 border-r border-gray-300">Mata Pelajaran</th>
                      <th className="py-2.5 px-3 border-r border-gray-300 text-center w-24">KKTP</th>
                      <th className="py-2.5 px-3 border-r border-gray-300 text-center w-24">Nilai Akhir</th>
                      <th className="py-2.5 px-3">Capaian Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: "Matematika Peminatan", score: printStudent.matematika },
                      { name: "Fisika Lanjutan", score: printStudent.fisika },
                      { name: "Kimia Terapan", score: printStudent.kimia },
                      { name: "Biologi Lanjutan", score: printStudent.biologi },
                      { name: "Bahasa Indonesia", score: printStudent.bIndo },
                      { name: "Bahasa Inggris Lanjutan", score: printStudent.bInggris },
                    ].map((subj, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 border-r border-gray-200 text-center">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-gray-200 font-semibold">{subj.name}</td>
                        <td className="py-2 px-3 border-r border-gray-200 text-center">70</td>
                        <td className="py-2 px-3 border-r border-gray-200 text-center font-bold">{subj.score}</td>
                        <td className="py-2 px-3 text-[11px] text-gray-600">
                          {subj.score >= 85
                            ? "Sangat baik dalam menguasai konsep dan penerapan teori terapan."
                            : "Menunjukkan pemahaman yang cukup dalam capaian materi pembelajaran."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CATATAN WALI KELAS */}
              <div className="mt-6 rounded-lg border border-gray-300 p-3 text-xs">
                <span className="block font-bold text-gray-700">Catatan Wali Kelas:</span>
                <p className="mt-1 text-gray-600 leading-relaxed italic">
                  "Pertahankan prestasi akademik dan keaktifan positif selama proses pembelajaran. Tingkatkan terus kedisiplinan dan semangat kolaborasi bersama rekan sekelas."
                </p>
              </div>

              {/* TANDA TANGAN */}
              <div className="mt-10 grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="text-gray-500">Mengetahui,</p>
                  <p className="font-semibold text-gray-700">Orang Tua / Wali Murid</p>
                  <div className="h-16" />
                  <p className="font-bold underline text-gray-800">( ........................................ )</p>
                </div>
                <div>
                  <p className="text-gray-500">Depok, 20 Desember 2024</p>
                  <p className="font-semibold text-gray-700">Wali Kelas XII MIPA 1</p>
                  <div className="h-16" />
                  <p className="font-bold underline text-gray-800">Drs. Hendra Setiawan, M.Pd</p>
                  <p className="text-[10px] text-gray-500">NIP. 19780512 200501 1 004</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}