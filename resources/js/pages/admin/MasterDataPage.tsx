import { useState, useMemo } from "react";
import { Search, Plus, CheckCircle2, X } from "lucide-react";

interface RombelData {
  id: string;
  name: string;
  fase: string; // Fase E (Kelas 10), Fase F (Kelas 11 & 12)
  peminatan: string;
  capacity: number;
  totalStudents: number;
  homeroomTeacher: string;
}

interface SubjectData {
  id: string;
  code: string;
  name: string;
  category: "Wajib" | "Pilihan MIPA" | "Pilihan IPS" | "Muatan Lokal";
  hoursPerWeek: number;
  kktp: number;
  teacherCount: number;
}

export function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<"rombel" | "mapel">("rombel");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const [modalRombel, setModalRombel] = useState(false);
  const [modalSubject, setModalSubject] = useState(false);

  // Master Data Rombel
  const [rombels, setRombels] = useState<RombelData[]>([
    {
      id: "r-1",
      name: "XII MIPA 1",
      fase: "Fase F (Kelas 12)",
      peminatan: "Matematika & Sains",
      capacity: 36,
      totalStudents: 36,
      homeroomTeacher: "Drs. Hendra Setiawan, M.Pd",
    },
    {
      id: "r-2",
      name: "XII MIPA 2",
      fase: "Fase F (Kelas 12)",
      peminatan: "Matematika & Sains",
      capacity: 36,
      totalStudents: 35,
      homeroomTeacher: "Dewi Lestari, S.Si",
    },
    {
      id: "r-3",
      name: "XI MIPA 2",
      fase: "Fase F (Kelas 11)",
      peminatan: "Matematika & Sains",
      capacity: 36,
      totalStudents: 36,
      homeroomTeacher: "Budi Santoso, M.Pd",
    },
    {
      id: "r-4",
      name: "XI IPS 1",
      fase: "Fase F (Kelas 11)",
      peminatan: "Sosial & Humaniora",
      capacity: 36,
      totalStudents: 34,
      homeroomTeacher: "Siti Rahma, M.Pd",
    },
    {
      id: "r-5",
      name: "X-1",
      fase: "Fase E (Kelas 10)",
      peminatan: "Umum Terintegrasi",
      capacity: 36,
      totalStudents: 36,
      homeroomTeacher: "Rudi Hartono, M.T",
    },
  ]);

  // Master Data Mata Pelajaran
  const [subjects, setSubjects] = useState<SubjectData[]>([
    {
      id: "sb-1",
      code: "MIPA-01",
      name: "Matematika Peminatan",
      category: "Pilihan MIPA",
      hoursPerWeek: 4,
      kktp: 70,
      teacherCount: 3,
    },
    {
      id: "sb-2",
      code: "MIPA-02",
      name: "Fisika Lanjutan",
      category: "Pilihan MIPA",
      hoursPerWeek: 4,
      kktp: 70,
      teacherCount: 2,
    },
    {
      id: "sb-3",
      code: "MIPA-03",
      name: "Kimia Terapan",
      category: "Pilihan MIPA",
      hoursPerWeek: 4,
      kktp: 70,
      teacherCount: 2,
    },
    {
      id: "sb-4",
      code: "UMUM-01",
      name: "Bahasa Indonesia",
      category: "Wajib",
      hoursPerWeek: 3,
      kktp: 70,
      teacherCount: 4,
    },
    {
      id: "sb-5",
      code: "UMUM-02",
      name: "Bahasa Inggris Lanjutan",
      category: "Wajib",
      hoursPerWeek: 3,
      kktp: 70,
      teacherCount: 3,
    },
  ]);

  // Top summary metrics
  const summary = useMemo(() => {
    const totalRombel = rombels.length;
    const totalMapel = subjects.length;
    const totalHours = subjects.reduce(
      (acc, curr) => acc + curr.hoursPerWeek,
      0,
    );
    const totalEnrolled = rombels.reduce(
      (acc, curr) => acc + curr.totalStudents,
      0,
    );
    return { totalRombel, totalMapel, totalHours, totalEnrolled };
  }, [rombels, subjects]);

  const filteredRombels = useMemo(() => {
    return rombels.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.peminatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [rombels, searchQuery]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [subjects, searchQuery]);

  const handleCreateRombel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newRombel: RombelData = {
      id: `r-${Date.now()}`,
      name: String(form.get("name")),
      fase: String(form.get("fase")),
      peminatan: String(form.get("peminatan")),
      capacity: Number(form.get("capacity")) || 36,
      totalStudents: 0,
      homeroomTeacher: String(form.get("homeroomTeacher")),
    };

    setRombels((prev) => [newRombel, ...prev]);
    setModalRombel(false);
    setFeedback(`Rombongan belajar "${newRombel.name}" berhasil dibuat.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleCreateSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newSubject: SubjectData = {
      id: `sb-${Date.now()}`,
      code: String(form.get("code")),
      name: String(form.get("name")),
      category: form.get("category") as SubjectData["category"],
      hoursPerWeek: Number(form.get("hoursPerWeek")) || 3,
      kktp: Number(form.get("kktp")) || 70,
      teacherCount: 1,
    };

    setSubjects((prev) => [newSubject, ...prev]);
    setModalSubject(false);
    setFeedback(
      `Mata pelajaran "${newSubject.name}" (${newSubject.code}) berhasil ditambahkan.`,
    );
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Struktur Kurikulum Merdeka • Master Entitas
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Master Rombel & Mata Pelajaran
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Kelola pembagian rombongan belajar, alokasi jam tatap muka, dan
            acuan ketercapaian KKTP.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            activeTab === "rombel"
              ? setModalRombel(true)
              : setModalSubject(true)
          }
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <Plus size={14} />
          {activeTab === "rombel"
            ? "Buat Rombel Baru"
            : "Tambah Mata Pelajaran"}
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Rombel Aktif",
            value: summary.totalRombel,
            sub: `${summary.totalEnrolled} Siswa Terpetakan`,
            colorText: "text-[#17345b]",
          },
          {
            label: "Mata Pelajaran Terdaftar",
            value: summary.totalMapel,
            sub: "Kurikulum Merdeka (Fase E & F)",
            colorText: "text-[#087b79]",
          },
          {
            label: "Total Alokasi Tatap Muka",
            value: `${summary.totalHours} Jam`,
            sub: "Akumulasi Jam Mengajar / Minggu",
            colorText: "text-[#17345b]",
          },
          {
            label: "Standar KKTP Sekolah",
            value: "70.0 Poin",
            sub: "Ambang Batas Ketuntasan",
            colorText: "text-[#087b79]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]"
          >
            <span className={`block text-[11px] font-bold ${item.colorText}`}>
              {item.label}
            </span>
            <strong
              className={`mt-1 block text-2xl font-black ${item.colorText}`}
            >
              {item.value}
            </strong>
            <span className="text-[10px] text-[#718086]">{item.sub}</span>
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

      {/* FILTER & TAB BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Search size={16} className="text-[#68777c]" />
          <input
            type="text"
            placeholder={
              activeTab === "rombel"
                ? "Cari nama rombel atau wali kelas..."
                : "Cari nama atau kode mata pelajaran..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
          />
        </div>

        {/* TAB TOGGLE PILL */}
        <div className="flex items-center gap-1.5 self-start rounded-full bg-[#e9eef3] p-1 shadow-[3px_3px_7px_#cbd3db,-3px_-3px_7px_#fff] sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("rombel")}
            className={`rounded-full px-4 py-1 text-[11px] font-bold transition ${
              activeTab === "rombel"
                ? "bg-[#17345b] text-white shadow-sm"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            Daftar Rombel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mapel")}
            className={`rounded-full px-4 py-1 text-[11px] font-bold transition ${
              activeTab === "mapel"
                ? "bg-[#17345b] text-white shadow-sm"
                : "text-[#68777c] hover:text-[#17345b]"
            }`}
          >
            Daftar Mata Pelajaran
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <div className="overflow-x-auto">
          {activeTab === "rombel" ? (
            /* ================= TABEL MASTER ROMBEL ================= */
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  <th className="py-3 px-3">Nama Rombel</th>
                  <th className="py-3 px-3">Tingkat / Fase</th>
                  <th className="py-3 px-2">Fokus Peminatan</th>
                  <th className="py-3 px-2 text-center">Kapasitas Kelas</th>
                  <th className="py-3 px-3">Wali Kelas Pengampu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce4ea] text-xs">
                {filteredRombels.map((r) => (
                  <tr key={r.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3">
                      <span className="rounded-full bg-[#dbe8f5] px-2.5 py-0.5 text-[11px] font-extrabold text-[#17345b]">
                        {r.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#20272d]">
                      {r.fase}
                    </td>
                    <td className="py-3.5 px-2 font-medium text-[#68777c]">
                      {r.peminatan}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <strong className="text-[#17345b]">
                        {r.totalStudents}
                      </strong>
                      <span className="text-[#86959c]">
                        {" "}
                        / {r.capacity} Siswa
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#20272d]">
                      {r.homeroomTeacher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* ================= TABEL MASTER MATA PELAJARAN ================= */
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                  <th className="py-3 px-3">Kode Mapel</th>
                  <th className="py-3 px-3">Nama Mata Pelajaran</th>
                  <th className="py-3 px-2 text-center">Kategori Rumpun</th>
                  <th className="py-3 px-2 text-center">Jam Tatap Muka</th>
                  <th className="py-3 px-2 text-center">KKTP Kelulusan</th>
                  <th className="py-3 px-3 text-center">
                    Jumlah Guru Pengajar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce4ea] text-xs">
                {filteredSubjects.map((sb) => (
                  <tr key={sb.id} className="transition hover:bg-white/30">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#17345b]">
                      {sb.code}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#20272d]">
                      {sb.name}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          sb.category === "Wajib"
                            ? "bg-[#dbe8f5] text-[#17345b]"
                            : "bg-[#dcebea] text-[#087b79]"
                        }`}
                      >
                        {sb.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-[#20272d]">
                      {sb.hoursPerWeek} Jam/Mgg
                    </td>
                    <td className="py-3.5 px-2 text-center font-extrabold text-[#087b79]">
                      {sb.kktp}
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-[#68777c]">
                      {sb.teacherCount} Tenaga Pengajar
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL BUAT ROMBEL BARU */}
      {modalRombel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Master Rombel
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Tambah Rombongan Belajar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalRombel(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRombel} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nama Rombel
                </label>
                <input
                  name="name"
                  placeholder="Contoh: XII MIPA 3 atau X-2"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Fase Kurikulum
                  </label>
                  <select
                    name="fase"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="Fase F (Kelas 12)">Fase F (Kelas 12)</option>
                    <option value="Fase F (Kelas 11)">Fase F (Kelas 11)</option>
                    <option value="Fase E (Kelas 10)">Fase E (Kelas 10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Peminatan / Konsentrasi
                  </label>
                  <input
                    name="peminatan"
                    placeholder="Matematika & Sains"
                    defaultValue="Matematika & Sains"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kapasitas Siswa
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue="36"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Wali Kelas Penanggung Jawab
                  </label>
                  <input
                    name="homeroomTeacher"
                    placeholder="Nama Wali Kelas..."
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalRombel(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Plus size={13} /> Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BUAT MATA PELAJARAN BARU */}
      {modalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Master Kurikulum
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Tambah Mata Pelajaran
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSubject(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kode Mapel
                  </label>
                  <input
                    name="code"
                    placeholder="MIPA-04"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Rumpun / Kategori
                  </label>
                  <select
                    name="category"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="Pilihan MIPA">Pilihan MIPA</option>
                    <option value="Pilihan IPS">Pilihan IPS</option>
                    <option value="Wajib">Wajib (Nasional)</option>
                    <option value="Muatan Lokal">Muatan Lokal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nama Mata Pelajaran
                </label>
                <input
                  name="name"
                  placeholder="Contoh: Biologi Lanjutan"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Jam Tatap Muka (Per Minggu)
                  </label>
                  <input
                    type="number"
                    name="hoursPerWeek"
                    defaultValue="4"
                    min="1"
                    max="10"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    KKTP Ambang Batas
                  </label>
                  <input
                    type="number"
                    name="kktp"
                    defaultValue="70"
                    min="0"
                    max="100"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalSubject(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Plus size={13} /> Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
