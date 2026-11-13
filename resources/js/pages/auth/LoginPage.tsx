import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { DEMO_USERS, ROLE_LABELS } from "../../constants";
import logo from "@/assets/Icon.png";

export default function LoginPage() {
    const { data, setData, post, processing, errors } = useForm({
        email: "siswa@siakad.test",
        password: "password",
    });

    const [show, setShow] = useState(false);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post("/login");
    };

    return (
        <main className="grid min-h-screen place-items-center bg-[#eef2f6] p-4 sm:p-6 lg:p-8">
            {/* Outer Container (Split Screen) */}
            <div className="flex w-full max-w-[1050px] flex-col overflow-hidden rounded-[36px] bg-[#eef2f6] shadow-[16px_16px_32px_#cbd5e1,-16px_-16px_32px_#ffffff] lg:flex-row">
                {/* SISI KIRI: Poster / Banner Akademik */}
                <div className="relative flex flex-col justify-between bg-[#1e293b] p-8 text-white sm:p-12 lg:w-[60%] lg:p-10">
                    {/* Background Subtle Accent */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

                    {/* Top Brand Info */}
                    <div className="flex items-center gap-3.5 z-10">
                        <div className="flex h-15 w-15 p-2 items-center justify-center rounded-2xl bg-[#E4EBF5] text-[#17345B]  transition-all group-hover:shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]">
                            <img src={logo} alt="Icon" width={100} />
                        </div>
                        <div>
                            <b className="block text-lg tracking-wide">
                                SIAKAD UNPAM
                            </b>
                            <small className="text-slate-400">
                                Portal Akademik Terpadu
                            </small>
                        </div>
                    </div>

                    {/* Center Poster Content */}
                    <div className="my-10 z-10">
                        <span className="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase mb-4 border border-blue-400/20">
                            Sistem Informasi Akademik
                        </span>
                        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl text-white">
                            Kelola Studi & Aktivitas Kampus Lebih Mudah.
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-slate-300">
                            Akses transkrip nilai, jadwal kuliah, pengajuan KRS,
                            dan rekap kehadiran mahasiswa dalam satu platform
                            terintegrasi berbasis web.
                        </p>
                    </div>

                    {/* Bottom Quick Feature Badges */}
                    <div className="grid grid-cols-2 gap-3 z-10 pt-4 border-t border-slate-700/60">
                        <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                            <span className="block text-lg font-bold text-blue-400">
                                100%
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Sistem Terintegrasi
                            </span>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/5">
                            <span className="block text-lg font-bold text-emerald-400">
                                Multi-Role
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Admin, Dosen & Mahasiswa
                            </span>
                        </div>
                    </div>
                </div>

                {/* SISI KANAN: Form Login & Demo Accounts */}
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:w-[40%] lg:p-10">
                    <form onSubmit={submit} className="w-full">
                        <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">
                            Masuk ke akun Anda
                        </h1>
                        <p className="mt-1.5 mb-6 text-sm text-[#64748b]">
                            Gunakan akun demo di bawah atau masukkan kredensial
                            Anda.
                        </p>

                        {/* Email Field */}
                        <label className="mb-4 block text-sm font-semibold text-[#334155]">
                            Email Akademik
                            <input
                                className="mt-2 w-full rounded-2xl border-0 bg-[#eef2f6] px-4 py-3.5 text-sm text-[#0f172a] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] outline-none transition-all focus:ring-2 focus:ring-[#1e293b]/20"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                type="email"
                                placeholder="nama@siakad.test"
                                required
                            />
                        </label>
                        {errors.email && (
                            <p className="-mt-3 mb-3 text-xs font-medium text-rose-500">
                                {errors.email}
                            </p>
                        )}

                        {/* Password Field */}
                        <label className="mb-5 block text-sm font-semibold text-[#334155]">
                            Password
                            <div className="mt-2 flex items-center rounded-2xl bg-[#eef2f6] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                                <input
                                    className="w-full border-0 bg-transparent px-4 py-3.5 text-sm text-[#0f172a] outline-none"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    type={show ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    className="px-4 text-xs font-semibold text-[#475569] transition hover:text-[#0f172a]"
                                    type="button"
                                    onClick={() => setShow(!show)}
                                >
                                    {show ? "Sembunyikan" : "Lihat"}
                                </button>
                            </div>
                        </label>
                        {errors.password && (
                            <p className="-mt-4 mb-4 text-xs font-medium text-rose-500">
                                {errors.password}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            className="w-full rounded-2xl bg-[#1e293b] px-5 py-3.5 text-sm font-semibold text-white shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] transition-all hover:bg-[#0f172a] active:scale-[0.98] disabled:opacity-70"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Masuk ke Sistem"}
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-[1px] flex-1 bg-[#cbd5e1]"></div>
                            <span className="text-[11px] font-semibold tracking-wider text-[#94a3b8] uppercase">
                                Pilih Akun Demo Cepat
                            </span>
                            <div className="h-[1px] flex-1 bg-[#cbd5e1]"></div>
                        </div>

                        {/* Demo Accounts List */}
                        <div className="grid gap-2.5 max-h-[190px] overflow-y-auto pr-1">
                            {DEMO_USERS.map((d) => {
                                const isSelected = data.email === d.email;
                                return (
                                    <button
                                        type="button"
                                        className={`flex items-center gap-3 rounded-2xl border-0 p-2.5 text-left transition-all ${
                                            isSelected
                                                ? "bg-[#eef2f6] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] ring-1 ring-[#1e293b]/30"
                                                : "bg-[#eef2f6] shadow-[4px_4px_10px_#cbd5e1,-4px_-4px_10px_#ffffff] hover:shadow-[2px_2px_5px_#cbd5e1,-2px_-2px_5px_#ffffff]"
                                        }`}
                                        key={d.id}
                                        onClick={() => {
                                            setData({
                                                email: d.email,
                                                password: d.password,
                                            });
                                        }}
                                    >
                                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1e293b] text-xs font-bold text-white shadow-[2px_2px_5px_#cbd5e1]">
                                            {d.name[0]}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <b className="block truncate text-xs font-bold text-[#1e293b]">
                                                {d.name}
                                            </b>
                                            <small className="block truncate text-[10px] font-medium text-[#64748b]">
                                                {ROLE_LABELS[d.role]} •{" "}
                                                <span className="text-[#475569]">
                                                    {d.email}
                                                </span>
                                            </small>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
