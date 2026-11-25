import { useEffect, useState, useMemo } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Search, Plus, CheckCircle2, X } from "lucide-react";

interface RombelData {
  id: string | number;
  name: string;
  fase: string;
  peminatan: string;
  capacity: number;
  totalStudents: number;
  homeroomTeacher: string;
  wali_kelas_id?: number | null;
}

interface SubjectData {
  id: string | number;
  code: string;
  name: string;
  category: "Wajib" | "Pilihan MIPA" | "Pilihan IPS" | "Muatan Lokal";
  hoursPerWeek: number;
  kktp: number;
  teacherCount: number;
}

interface TeacherOption {
  id: number;
  name: string;
}

interface MasterDataProps {
  classes?: RombelData[];
  subjects?: SubjectData[];
  teachers?: TeacherOption[];
}

export default function MasterDataPage({
  classes = [],
  subjects = [],
  teachers = [],
}: MasterDataProps = {}) {
  const page = usePage<{ flash?: { success?: string; error?: string } }>();
  const flash = page.props.flash;

  const [activeTab, setActiveTab] = useState<"rombel" | "mapel">("rombel");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const [modalRombel, setModalRombel] = useState(false);
  const [modalSubject, setModalSubject] = useState(false);

  const classForm = useForm({
    name: "",
    grade_level: "X",
    peminatan: "Matematika & Sains",
    capacity: "36",
    wali_kelas_id: "",
  });

  const subjectForm = useForm({
    code: "",
    name: "",
    category: "Wajib",
    hours_per_week: "4",
    kktp: "70",
  });

  useEffect(() => {
    if (flash?.success) {
      setFeedback(flash.success);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
    if (flash?.error) {
      setFeedback(flash.error);
      const timer = setTimeout(() => setFeedback(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success, flash?.error]);

  const rombels = classes;

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

    classForm.post("/admin/master-data/kelas", {
      preserveScroll: true,
      onSuccess: () => {
        setModalRombel(false);
        classForm.reset();
      },
    });
  };

  const handleCreateSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    subjectForm.post("/admin/master-data/mapel", {
      preserveScroll: true,
      onSuccess: () => {
        setModalSubject(false);
        subjectForm.reset();
      },
    });
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
            <table className="w-full min-w-[760px] text-left">
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
            <table className="w-full min-w-[820px] text-left">
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
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
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
                  value={classForm.data.name}
                  onChange={(e) => classForm.setData("name", e.target.value)}
                  placeholder="Contoh: XII MIPA 3 atau X-2"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {classForm.errors.name && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{classForm.errors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Fase Kurikulum
                  </label>
                  <select
                    name="grade_level"
                    value={classForm.data.grade_level}
                    onChange={(e) => classForm.setData("grade_level", e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="XII">Fase F (Kelas 12)</option>
                    <option value="XI">Fase F (Kelas 11)</option>
                    <option value="X">Fase E (Kelas 10)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Peminatan / Konsentrasi
                  </label>
                  <input
                    name="peminatan"
                    value={classForm.data.peminatan}
                    onChange={(e) => classForm.setData("peminatan", e.target.value)}
                    placeholder="Matematika & Sains"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kapasitas Siswa
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={classForm.data.capacity}
                    onChange={(e) => classForm.setData("capacity", e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Wali Kelas Penanggung Jawab
                  </label>
                  <select
                    name="wali_kelas_id"
                    value={classForm.data.wali_kelas_id}
                    onChange={(e) => classForm.setData("wali_kelas_id", e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="">-- Belum ditentukan --</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  {classForm.errors.wali_kelas_id && (
                    <span className="text-[10px] font-semibold text-[#c0392b]">{classForm.errors.wali_kelas_id}</span>
                  )}
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
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Kode Mapel
                  </label>
                  <input
                    name="code"
                    value={subjectForm.data.code}
                    onChange={(e) => subjectForm.setData("code", e.target.value)}
                    placeholder="MIPA-04"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                  {subjectForm.errors.code && (
                    <span className="text-[10px] font-semibold text-[#c0392b]">{subjectForm.errors.code}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Rumpun / Kategori
                  </label>
                  <select
                    name="category"
                    value={subjectForm.data.category}
                    onChange={(e) => subjectForm.setData("category", e.target.value)}
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
                  value={subjectForm.data.name}
                  onChange={(e) => subjectForm.setData("name", e.target.value)}
                  placeholder="Contoh: Biologi Lanjutan"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {subjectForm.errors.name && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{subjectForm.errors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Jam Tatap Muka (Per Minggu)
                  </label>
                  <input
                    type="number"
                    name="hours_per_week"
                    value={subjectForm.data.hours_per_week}
                    onChange={(e) => subjectForm.setData("hours_per_week", e.target.value)}
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
                    value={subjectForm.data.kktp}
                    onChange={(e) => subjectForm.setData("kktp", e.target.value)}
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
