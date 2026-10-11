import { useState, useMemo } from "react";
import {

  Search,
  Printer,
  X,
} from "lucide-react";

interface SubjectScore {
  id: string;
  name: string;
  teacher: string;
  formatif: number;
  sts: number;
  sas: number;
  finalScore: number;
  kktp: number;
}

export function NilaiAnakPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [printModal, setPrintModal] = useState(false);

  const grades: SubjectScore[] = [
    { id: "1", name: "Matematika Peminatan", teacher: "Budi Santoso, M.Pd", formatif: 92, sts: 90, sas: 94, finalScore: 92, kktp: 70 },
    { id: "2", name: "Fisika Lanjutan", teacher: "Dewi Lestari, S.Si", formatif: 88, sts: 85, sas: 90, finalScore: 88, kktp: 70 },
    { id: "3", name: "Kimia Terapan", teacher: "Rudi Hartono, M.T", formatif: 90, sts: 88, sas: 92, finalScore: 90, kktp: 70 },
    { id: "4", name: "Biologi Lanjutan", teacher: "Dr. Sri Wahyuni", formatif: 94, sts: 92, sas: 95, finalScore: 94, kktp: 70 },
    { id: "5", name: "Bahasa Indonesia", teacher: "Siti Rahma, M.Pd", formatif: 95, sts: 92, sas: 95, finalScore: 94, kktp: 70 },
    { id: "6", name: "Bahasa Inggris Lanjutan", teacher: "John Doe, M.Ed", formatif: 96, sts: 95, sas: 97, finalScore: 96, kktp: 70 },
  ];

  const filtered = grades.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageScore = useMemo(() => {
    const total = grades.reduce((acc, curr) => acc + curr.finalScore, 0);
    return Math.round((total / grades.length) * 10) / 10;
  }, [grades]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Alya Putri • XII MIPA 1 • Semester Ganjil 2024/2025
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Perkembangan & Nilai Anak
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Transkrip evaluasi capaian kompetensi seluruh mata pelajaran Kurikulum Merdeka.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPrintModal(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <Printer size={14} />
          Pratinjau Rapor Digital
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Rata-rata Keseluruhan", value: averageScore, sub: "Batas KKTP: 70.0", color: "text-[#17345b]" },
          { label: "Mata Pelajaran Tuntas", value: `${grades.length}/${grades.length}`, sub: "100% Memenuhi KKTP", color: "text-[#087b79]" },
          { label: "Peringkat di Kelas", value: "Peringkat #1", sub: "Dari 36 Siswa", color: "text-[#17345b]" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            <span className={`block text-[11px] font-bold ${item.color}`}>{item.label}</span>
            <strong className={`mt-1 block text-2xl font-black ${item.color}`}>{item.value}</strong>
            <span className="text-[10px] text-[#68777c]">{item.sub}</span>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-[#d8e1e8]">
          <div className="flex items-center gap-2 rounded-full bg-[#edf2f6] px-3.5 py-2 text-xs shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] w-full sm:w-72">
            <Search size={15} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-[#20272d]"
            />
          </div>
          <span className="text-[11px] font-bold text-[#68777c] hidden sm:block">
            Target Capaian KKTP: 70.0
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Mata Pelajaran</th>
                <th className="py-3 px-2 text-center">Formatif (40%)</th>
                <th className="py-3 px-2 text-center">STS (30%)</th>
                <th className="py-3 px-2 text-center">SAS (30%)</th>
                <th className="py-3 px-2 text-center">Nilai Akhir</th>
                <th className="py-3 px-3 text-center">Status KKTP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-white/30">
                  <td className="py-3.5 px-3">
                    <strong className="block font-bold text-[#20272d]">{item.name}</strong>
                    <span className="text-[10px] text-[#718086]">{item.teacher}</span>
                  </td>
                  <td className="py-3.5 px-2 text-center font-semibold text-[#68777c]">{item.formatif}</td>
                  <td className="py-3.5 px-2 text-center font-semibold text-[#68777c]">{item.sts}</td>
                  <td className="py-3.5 px-2 text-center font-semibold text-[#68777c]">{item.sas}</td>
                  <td className="py-3.5 px-2 text-center">
                    <strong className="text-sm font-extrabold text-[#17345b]">{item.finalScore}</strong>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dcebea] px-2.5 py-0.5 text-[10px] font-bold text-[#087b79]">
                      Tuntas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {printModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-3xl flex-col rounded-[32px] bg-[#f8fafc] p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-xs font-bold text-gray-500">Pratinjau Rapor Digital Siswa</span>
              <button
                type="button"
                onClick={() => setPrintModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-gray-600 hover:text-black"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto bg-white p-6 rounded-2xl border border-gray-200 text-xs">
              <div className="border-b-2 border-gray-800 pb-3 text-center">
                <h2 className="text-sm font-bold uppercase text-[#17345b]">SMA NEGERI UNGGULAN INDONESIA</h2>
                <p className="text-[10px] text-gray-500">Laporan Capaian Pembelajaran Siswa Semester Ganjil 2024/2025</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                <div>Nama: <b>Alya Putri</b></div>
                <div>NISN: 0064928110</div>
                <div>Kelas: XII MIPA 1</div>
                <div>Peringkat: #1</div>
              </div>
              <table className="mt-4 w-full border border-gray-300 text-left">
                <thead className="bg-gray-100 font-bold">
                  <tr className="border-b border-gray-300">
                    <th className="p-2">Mapel</th>
                    <th className="p-2 text-center">Nilai</th>
                    <th className="p-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {grades.map((g) => (
                    <tr key={g.id}>
                      <td className="p-2 font-semibold">{g.name}</td>
                      <td className="p-2 text-center font-bold">{g.finalScore}</td>
                      <td className="p-2 text-gray-600">Sangat baik dalam penguasaan materi.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}