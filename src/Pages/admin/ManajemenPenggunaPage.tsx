import { useState, useMemo } from "react";
import {
  UserPlus,
  Search,
  KeyRound,
  CheckCircle2,
  X,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";

type UserRole = "siswa" | "guru" | "wali-kelas" | "orang-tua" | "admin";

interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  identifier: string; // NISN atau NIP
  isActive: boolean;
  lastLogin: string;
}

export function ManajemenPenggunaPage() {
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "u-1",
      name: "Administrator Utama",
      username: "admin.pusat",
      email: "admin@siakad.sch.id",
      role: "admin",
      identifier: "NIP. 198001012000031001",
      isActive: true,
      lastLogin: "10 menit lalu",
    },
    {
      id: "u-2",
      name: "Drs. Hendra Setiawan, M.Pd",
      username: "hendra.setiawan",
      email: "hendra@siakad.sch.id",
      role: "wali-kelas",
      identifier: "NIP. 197805122005011004",
      isActive: true,
      lastLogin: "25 menit lalu",
    },
    {
      id: "u-3",
      name: "Budi Santoso, M.Pd",
      username: "budi.santoso",
      email: "budi@siakad.sch.id",
      role: "guru",
      identifier: "NIP. 198203152008011002",
      isActive: true,
      lastLogin: "2 jam lalu",
    },
    {
      id: "u-4",
      name: "Alya Putri",
      username: "alya.putri",
      email: "alya@siswa.siakad.sch.id",
      role: "siswa",
      identifier: "NISN. 0064928110",
      isActive: true,
      lastLogin: "Kemarin",
    },
    {
      id: "u-5",
      name: "Ir. Hendrawan",
      username: "ortu.alyaputri",
      email: "hendrawan@gmail.com",
      role: "orang-tua",
      identifier: "Wali dari Alya Putri",
      isActive: true,
      lastLogin: "3 hari lalu",
    },
    {
      id: "u-6",
      name: "Bagas Ramadhan",
      username: "bagas.ramadhan",
      email: "bagas@siswa.siakad.sch.id",
      role: "siswa",
      identifier: "NISN. 0064928111",
      isActive: false,
      lastLogin: "1 minggu lalu",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("Semua");
  const [modalCreate, setModalCreate] = useState(false);
  const [feedback, setFeedback] = useState("");

  const roles = ["Semua", "siswa", "guru", "wali-kelas", "orang-tua", "admin"];

  // Top summary metrics
  const summary = useMemo(() => {
    const total = users.length;
    const students = users.filter((u) => u.role === "siswa").length;
    const teachers = users.filter(
      (u) => u.role === "guru" || u.role === "wali-kelas",
    ).length;
    const active = users.filter((u) => u.isActive).length;
    return { total, students, teachers, active };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.identifier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    );
    setFeedback("Status akses akun berhasil diperbarui.");
    setTimeout(() => setFeedback(""), 3500);
  };

  const handleResetPassword = (name: string) => {
    setFeedback(
      `Tautan reset password untuk akun ${name} telah dikirimkan ke email terdaftar.`,
    );
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: String(form.get("name")),
      username: String(form.get("username")),
      email: String(form.get("email")),
      role: form.get("role") as UserRole,
      identifier: String(form.get("identifier")),
      isActive: true,
      lastLogin: "Baru saja",
    };

    setUsers((prev) => [newUser, ...prev]);
    setModalCreate(false);
    setFeedback(`Akun baru (${newUser.name}) berhasil didaftarkan ke sistem.`);
    setTimeout(() => setFeedback(""), 4000);
  };

  return (
    <section className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
            Otoritas Pengguna • Multi-Aktor SIAKAD
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
            Manajemen Pengguna & Kredensial
          </h1>
          <p className="mt-0.5 text-xs text-[#68777c]">
            Kelola hak akses, status keaktifan akun, dan kredensial seluruh
            aktor dalam sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalCreate(true)}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#17345b] px-4 py-2 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] sm:self-auto"
        >
          <UserPlus size={14} />
          Tambah Pengguna Baru
        </button>
      </div>

      {/* TOP SUMMARY ARRAY METRICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Seluruh Akun",
            value: summary.total,
            sub: "Terdaftar di Sistem",
            colorText: "text-[#17345b]",
          },
          {
            label: "Akun Siswa",
            value: summary.students,
            sub: "Peserta Didik Aktif",
            colorText: "text-[#17345b]",
          },
          {
            label: "Guru & Wali Kelas",
            value: summary.teachers,
            sub: "Tenaga Pengajar",
            colorText: "text-[#087b79]",
          },
          {
            label: "Akun Status Aktif",
            value: summary.active,
            sub: "Dapat Mengakses Portal",
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

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#e9eef3] px-4 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Search size={16} className="text-[#68777c]" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, username, email, atau NIP/NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none placeholder:text-[#88989e]"
            />
          </div>
        </div>

        {/* ROLE FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-3.5 py-1 text-[11px] font-bold capitalize transition ${
                roleFilter === r
                  ? "bg-[#17345b] text-white shadow-sm"
                  : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff] hover:text-[#17345b]"
              }`}
            >
              {r === "wali-kelas"
                ? "Wali Kelas"
                : r === "orang-tua"
                  ? "Orang Tua"
                  : r}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-[28px] bg-[#e9eef3] p-5 shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff] sm:p-7">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#d8e1e8] text-[10px] font-extrabold uppercase tracking-wider text-[#68777c]">
                <th className="py-3 px-3">Nama & Identitas</th>
                <th className="py-3 px-3">Username & Email</th>
                <th className="py-3 px-2 text-center">Peran (Role)</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-center">Aktivitas Terakhir</th>
                <th className="py-3 px-3 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce4ea] text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition hover:bg-white/30">
                  {/* NAMA & NISN/NIP */}
                  <td className="py-3.5 px-3">
                    <strong className="block font-bold text-[#20272d]">
                      {u.name}
                    </strong>
                    <span className="text-[10px] text-[#718086]">
                      {u.identifier}
                    </span>
                  </td>

                  {/* USERNAME & EMAIL */}
                  <td className="py-3.5 px-3">
                    <span className="block font-semibold text-[#17345b]">
                      @{u.username}
                    </span>
                    <span className="text-[10px] text-[#68777c]">
                      {u.email}
                    </span>
                  </td>

                  {/* ROLE BADGE */}
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        u.role === "admin"
                          ? "bg-[#17345b] text-white"
                          : u.role === "wali-kelas"
                            ? "bg-[#087b79] text-white"
                            : u.role === "guru"
                              ? "bg-[#dbe8f5] text-[#17345b]"
                              : u.role === "orang-tua"
                                ? "bg-[#fef3c7] text-[#92400e]"
                                : "bg-[#e2e8f0] text-[#475569]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* STATUS PILL */}
                  <td className="py-3.5 px-2 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        u.isActive
                          ? "bg-[#dcebea] text-[#087b79]"
                          : "bg-[#fadbd8] text-[#c0392b]"
                      }`}
                    >
                      {u.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>

                  {/* LAST LOGIN */}
                  <td className="py-3.5 px-2 text-center text-[11px] text-[#68777c]">
                    {u.lastLogin}
                  </td>

                  {/* AKSI TOMBOL */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResetPassword(u.name)}
                        title="Reset Password"
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] hover:text-[#087b79]"
                      >
                        <KeyRound size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        title={
                          u.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"
                        }
                        className={`grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] ${
                          u.isActive
                            ? "text-[#c0392b] hover:bg-[#fadbd8]"
                            : "text-[#087b79] hover:bg-[#dcebea]"
                        }`}
                      >
                        {u.isActive ? (
                          <UserX size={13} />
                        ) : (
                          <UserCheck size={13} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PENGGUNA */}
      {modalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#d8e1e8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#68777c]">
                  Pendaftaran Akun
                </span>
                <h3 className="text-base font-extrabold text-[#17345b]">
                  Tambah Pengguna Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalCreate(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-gray-600 shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  placeholder="Contoh: Rian Anggara, S.Kom"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Username
                  </label>
                  <input
                    name="username"
                    placeholder="rian.anggara"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Peran (Role)
                  </label>
                  <select
                    name="role"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="wali-kelas">Wali Kelas</option>
                    <option value="orang-tua">Orang Tua</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Email Resmi
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="rian@siakad.sch.id"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nomor Identitas (NIP / NISN / Keterangan)
                </label>
                <input
                  name="identifier"
                  placeholder="NIP. 1985... atau NISN. 0064..."
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#d8e1e8] pt-3">
                <button
                  type="button"
                  onClick={() => setModalCreate(false)}
                  className="rounded-full bg-[#e9eef3] px-4 py-2 text-xs font-bold text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743]"
                >
                  <Plus size={13} />
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
