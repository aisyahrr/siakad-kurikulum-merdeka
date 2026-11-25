import { useEffect, useState } from "react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import {
  UserPlus,
  Search,
  KeyRound,
  CheckCircle2,
  X,
  UserCheck,
  UserX,
  Plus,
  Trash2,
} from "lucide-react";

type UserRole = "siswa" | "guru" | "wali-kelas" | "orang-tua" | "admin";

interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  identifier: string;
  isActive: boolean;
  lastLogin: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ManajemenPenggunaProps {
  users?: {
    data: UserAccount[];
    links: PaginationLink[];
    total: number;
  };
  filters?: { search?: string | null; role?: string | null };
  summary?: {
    total: number;
    students: number;
    teachers: number;
    active: number;
  };
}

export default function ManajemenPenggunaPage({
  users,
  filters,
  summary,
}: ManajemenPenggunaProps = {}) {
  const page = usePage<{ flash?: { success?: string; error?: string } }>();
  const flash = page.props.flash;

  const rows = users?.data ?? [];
  const stats = summary ?? {
    total: users?.total ?? 0,
    students: 0,
    teachers: 0,
    active: 0,
  };

  const [searchQuery, setSearchQuery] = useState(filters?.search ?? "");
  const [roleFilter, setRoleFilter] = useState<string>(filters?.role ?? "Semua");
  const [modalCreate, setModalCreate] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] =
    useState<UserAccount | null>(null);
  const [feedback, setFeedback] = useState("");

  const createForm = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "siswa" as UserRole,
    identifier: "",
  });

  const resetForm = useForm({
    password: "",
    password_confirmation: "",
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

  const roles = ["Semua", "siswa", "guru", "wali-kelas", "orang-tua", "admin"];

  const applyFilters = (search: string, role: string) => {
    router.get(
      "/admin/pengguna",
      {
        search: search || undefined,
        role: role === "Semua" ? undefined : role,
      },
      { preserveState: true, preserveScroll: true, replace: true },
    );
  };

  const handleOpenResetModal = (user: UserAccount) => {
    setSelectedUserForReset(user);
    resetForm.reset();
    resetForm.clearErrors();
  };

  const handleSubmitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset) return;

    resetForm.put(`/admin/pengguna/${selectedUserForReset.id}/reset-password`, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedUserForReset(null);
        resetForm.reset();
      },
    });
  };

  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createForm.post("/admin/pengguna", {
      preserveScroll: true,
      onSuccess: () => {
        setModalCreate(false);
        createForm.reset();
      },
    });
  };

  const handleToggleStatus = (user: UserAccount) => {
    router.patch(
      `/admin/pengguna/${user.id}/toggle-status`,
      {},
      { preserveScroll: true },
    );
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (!window.confirm(`Hapus akun ${user.name}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    router.delete(`/admin/pengguna/${user.id}`, { preserveScroll: true });
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
            value: stats.total,
            sub: "Terdaftar di Sistem",
            colorText: "text-[#17345b]",
          },
          {
            label: "Akun Siswa",
            value: stats.students,
            sub: "Peserta Didik Aktif",
            colorText: "text-[#17345b]",
          },
          {
            label: "Guru & Wali Kelas",
            value: stats.teachers,
            sub: "Tenaga Pengajar",
            colorText: "text-[#087b79]",
          },
          {
            label: "Akun Status Aktif",
            value: stats.active,
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
            <strong className={`mt-1 block text-2xl font-black ${item.colorText}`}>
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
              placeholder="Cari berdasarkan nama, username, email, atau NIP/NISN... (Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters(searchQuery, roleFilter);
                }
              }}
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
              onClick={() => {
                setRoleFilter(r);
                applyFilters(searchQuery, r);
              }}
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
          <table className="w-full min-w-[820px] text-left">
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
              {rows.map((u) => (
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
                        onClick={() => handleOpenResetModal(u)}
                        title="Reset Password"
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] hover:text-[#087b79]"
                      >
                        <KeyRound size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
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

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        title="Hapus Akun"
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#e9eef3] text-[#c0392b] shadow-[2px_2px_4px_#cbd3db,-2px_-2px_4px_#fff] hover:bg-[#fadbd8]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-[#718086]">
                    Tidak ada pengguna yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {users && users.links.length > 3 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#d8e1e8] pt-4">
            {users.links.map((link, index) =>
              link.url ? (
                <Link
                  key={index}
                  href={link.url}
                  preserveScroll
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    link.active
                      ? "bg-[#17345b] text-white"
                      : "bg-[#e9eef3] text-[#68777c] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#fff]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span
                  key={index}
                  className="rounded-full bg-[#e9eef3] px-3 py-1 text-[11px] font-bold text-[#a6b3b9]"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ),
            )}
          </div>
        )}
      </div>

      {/* MODAL RESET PASSWORD */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-[#17345b]">Reset Password</h3>
            <p className="text-xs text-[#68777c] mb-4">Set password baru untuk {selectedUserForReset.name}</p>
            <form onSubmit={handleSubmitResetPassword} className="space-y-3">
              <input
                type="password"
                placeholder="Password Baru"
                value={resetForm.data.password}
                onChange={(e) => resetForm.setData("password", e.target.value)}
                className="w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs outline-none"
                required
              />
              {resetForm.errors.password && (
                <span className="block text-[10px] font-semibold text-[#c0392b]">
                  {resetForm.errors.password}
                </span>
              )}
              <input
                type="password"
                placeholder="Konfirmasi Password"
                value={resetForm.data.password_confirmation}
                onChange={(e) => resetForm.setData("password_confirmation", e.target.value)}
                className="w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs outline-none"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setSelectedUserForReset(null)} className="rounded-full px-4 py-2 text-xs bg-[#e9eef3] shadow">Batal</button>
                <button
                  type="submit"
                  disabled={resetForm.processing}
                  className="rounded-full px-4 py-2 text-xs bg-[#17345b] text-white shadow disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH PENGGUNA */}
      {modalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[32px] bg-[#e9eef3] p-6 shadow-2xl">
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
                  value={createForm.data.name}
                  onChange={(e) => createForm.setData("name", e.target.value)}
                  placeholder="Contoh: Rian Anggara, S.Kom"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {createForm.errors.name && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{createForm.errors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Username
                  </label>
                  <input
                    value={createForm.data.username}
                    onChange={(e) => createForm.setData("username", e.target.value)}
                    placeholder="rian.anggara"
                    className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs font-bold text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  />
                  {createForm.errors.username && (
                    <span className="text-[10px] font-semibold text-[#c0392b]">{createForm.errors.username}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17345b]">
                    Peran (Role)
                  </label>
                  <select
                    value={createForm.data.role}
                    onChange={(e) => createForm.setData("role", e.target.value as UserRole)}
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
                  value={createForm.data.email}
                  onChange={(e) => createForm.setData("email", e.target.value)}
                  placeholder="rian@siakad.sch.id"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {createForm.errors.email && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{createForm.errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Password Awal
                </label>
                <input
                  type="password"
                  value={createForm.data.password}
                  onChange={(e) => createForm.setData("password", e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
                  required
                />
                {createForm.errors.password && (
                  <span className="text-[10px] font-semibold text-[#c0392b]">{createForm.errors.password}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17345b]">
                  Nomor Identitas (NIP / NISN / Keterangan)
                </label>
                <input
                  value={createForm.data.identifier}
                  onChange={(e) => createForm.setData("identifier", e.target.value)}
                  placeholder="NIP. 1985... atau NISN. 0064..."
                  className="mt-1 w-full rounded-2xl bg-[#edf2f6] p-2.5 text-xs text-[#20272d] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] outline-none"
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
                  disabled={createForm.processing}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#17345b] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#102743] disabled:opacity-50"
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
