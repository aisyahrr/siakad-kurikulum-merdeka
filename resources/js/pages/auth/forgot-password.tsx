import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/Icon.png";

interface PageProps {
  status?: string | null;
  email?: string | null;
  step?: number | null;
  demo_otp?: string | null;
  errors: Record<string, string>;
}

export default function ForgotPasswordPage() {
  const pageProps = usePage().props as unknown as PageProps;
  
  const [step, setStep] = useState<number>(pageProps.step || 1);
  const [email, setEmail] = useState<string>(pageProps.email || "");
  const [otp, setOtp] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (pageProps.step) {
      setStep(pageProps.step);
    }
    if (pageProps.email) {
      setEmail(pageProps.email);
    }
  }, [pageProps]);

  const sendOtpForm = useForm({
    email: email,
  });

  const verifyOtpForm = useForm({
    email: email,
    otp: "",
  });

  const resetPasswordForm = useForm({
    email: email,
    otp: "",
    password: "",
    password_confirmation: "",
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpForm.post("/forgot-password/send-otp", {
      onSuccess: () => {
        setStep(2);
      },
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpForm.setData("email", email);
    verifyOtpForm.setData("otp", otp);
    verifyOtpForm.post("/forgot-password/verify-otp", {
      onSuccess: () => {
        setStep(3);
      },
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordForm.setData("email", email);
    resetPasswordForm.setData("otp", otp);
    resetPasswordForm.post("/forgot-password/reset");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#eef2f6] p-4 sm:p-6 lg:p-8">
      <Head title="Lupa Password - JEGUK HIGH SCHOOL" />

      {/* Outer Container (Split Screen) - Same as Login */}
      <div className="flex w-full max-w-[1050px] flex-col overflow-hidden rounded-[36px] bg-[#eef2f6] shadow-[16px_16px_32px_#cbd5e1,-16px_-16px_32px_#ffffff] lg:flex-row">
        
        {/* SISI KIRI: Poster / Banner Akademik (60%) */}
        <div className="relative hidden flex-col justify-between bg-[#1e293b] p-8 text-white sm:p-12 lg:flex lg:w-[60%] lg:p-10">

          {/* Top Brand Info */}
          <div className="flex items-center gap-3.5 z-10">
            <div className="flex h-15 w-15 p-2 items-center justify-center rounded-2xl bg-[#E4EBF5] text-[#17345B]">
              <img src={logo} alt="Icon" width={100} />
            </div>
            <div>
              <b className="block text-lg tracking-wide">JEGUK HIGH SCHOOL</b>
              <small className="text-slate-400">Recovery Akses Akun</small>
            </div>
          </div>

          {/* Center Content */}
          <div className="my-10 z-10">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#d9b46a] uppercase mb-4 border border-white/10">
              Langkah {step} dari 3
            </span>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl text-white">
              {step === 1 && "Verifikasi Identitas Anda."}
              {step === 2 && "Masukkan Kode Keamanan."}
              {step === 3 && "Perbarui Password Anda."}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {step === 1 && "Kami akan mengirimkan kode OTP ke email Anda untuk memastikan bahwa ini benar-benar Anda."}
              {step === 2 && `Silakan periksa kotak masuk email ${email}. Masukkan 6 digit kode yang kami kirimkan.`}
              {step === 3 && "Gunakan kombinasi huruf, angka, dan simbol untuk membuat password baru yang lebih kuat."}
            </p>
          </div>

          {/* Bottom Link */}
          <div className="z-10 pt-4 border-t border-slate-700/60">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition"
            >
              <ArrowLeft size={16} /> Kembali ke halaman Login
            </Link>
          </div>
        </div>

        {/* SISI KANAN: Form Content (40%) */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:w-[40%] lg:p-10">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="rounded-full bg-[#e2e8f0] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#17345b]">
              Langkah {step} dari 3
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0f172a]"
            >
              <ArrowLeft size={14} /> Login
            </Link>
          </div>

          {pageProps.status && (
            <div className="mb-6 flex items-start gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span>{pageProps.status}</span>
            </div>
          )}

          {/* STEP 1: Input Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="w-full">
              <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">Lupa Password</h1>
              <p className="mt-1.5 mb-6 text-sm text-[#64748b]">
                Masukkan email akademik Anda.
              </p>

              <label className="mb-6 block text-sm font-semibold text-[#334155]">
                Email Akademik
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#eef2f6] px-4 py-3.5 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                  <Mail size={18} className="text-[#64748b]" />
                  <input
                    type="email"
                    value={sendOtpForm.data.email}
                    onChange={(e) => {
                      sendOtpForm.setData("email", e.target.value);
                      setEmail(e.target.value);
                    }}
                    className="w-full bg-transparent text-sm text-[#0f172a] outline-none"
                    placeholder="nama@siakad.test"
                    required
                  />
                </div>
              </label>

              {(sendOtpForm.errors.email || pageProps.errors?.email) && (
                <p className="-mt-4 mb-4 text-xs font-medium text-rose-500">
                  {sendOtpForm.errors.email || pageProps.errors?.email}
                </p>
              )}

              <button
                type="submit"
                disabled={sendOtpForm.processing}
                className="w-full rounded-2xl bg-[#1e293b] px-5 py-3.5 text-sm font-semibold text-white shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] transition-all hover:bg-[#0f172a] active:scale-[0.98] disabled:opacity-70"
              >
                {sendOtpForm.processing ? "Mengirim OTP..." : "Kirim Kode OTP"}
              </button>
            </form>
          )}

          {/* STEP 2: Input OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="w-full">
              <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">Verifikasi OTP</h1>
              <p className="mt-1.5 mb-6 text-sm text-[#64748b]">
                Kode terkirim ke <b>{email}</b>
              </p>

              {pageProps.demo_otp && (
                <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-center text-xs text-amber-700">
                  Demo Local OTP: <b>{pageProps.demo_otp}</b>
                </div>
              )}

              <label className="mb-6 block text-sm font-semibold text-[#334155]">
                Kode OTP 6-Digit
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#eef2f6] px-4 py-3.5 shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                  <KeyRound size={18} className="text-[#64748b]" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-transparent text-center text-lg font-bold tracking-[0.5em] text-[#0f172a] outline-none"
                    placeholder="000000"
                    required
                  />
                </div>
              </label>

              {(verifyOtpForm.errors.otp || pageProps.errors?.otp) && (
                <p className="-mt-4 mb-4 text-xs font-medium text-rose-500">
                  {verifyOtpForm.errors.otp || pageProps.errors?.otp}
                </p>
              )}

              <button
                type="submit"
                disabled={verifyOtpForm.processing}
                className="w-full rounded-2xl bg-[#1e293b] px-5 py-3.5 text-sm font-semibold text-white shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] transition-all hover:bg-[#0f172a] active:scale-[0.98] disabled:opacity-70"
              >
                {verifyOtpForm.processing ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 w-full text-center text-xs font-semibold text-[#64748b] hover:text-[#0f172a] hover:underline"
              >
                Ganti Email / Kirim Ulang
              </button>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="w-full">
              <h1 className="text-2xl font-extrabold text-[#0f172a] sm:text-3xl">Password Baru</h1>
              <p className="mt-1.5 mb-6 text-sm text-[#64748b]">
                Atur password baru untuk akun Anda.
              </p>

              <label className="mb-4 block text-sm font-semibold text-[#334155]">
                Password Baru
                <div className="mt-2 flex items-center rounded-2xl bg-[#eef2f6] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                  <div className="pl-4">
                    <Lock size={18} className="text-[#64748b]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={resetPasswordForm.data.password}
                    onChange={(e) => resetPasswordForm.setData("password", e.target.value)}
                    className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-[#0f172a] outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 text-[#475569] hover:text-[#0f172a]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <label className="mb-6 block text-sm font-semibold text-[#334155]">
                Konfirmasi Password
                <div className="mt-2 flex items-center rounded-2xl bg-[#eef2f6] shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                  <div className="pl-4">
                    <Lock size={18} className="text-[#64748b]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={resetPasswordForm.data.password_confirmation}
                    onChange={(e) => resetPasswordForm.setData("password_confirmation", e.target.value)}
                    className="w-full border-0 bg-transparent px-3 py-3.5 text-sm text-[#0f172a] outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </label>

              {resetPasswordForm.errors.password && (
                <p className="-mt-4 mb-4 text-xs font-medium text-rose-500">
                  {resetPasswordForm.errors.password}
                </p>
              )}

              <button
                type="submit"
                disabled={resetPasswordForm.processing}
                className="w-full rounded-2xl bg-[#1e293b] px-5 py-3.5 text-sm font-semibold text-white shadow-[6px_6px_14px_#cbd5e1,-6px_-6px_14px_#ffffff] transition-all hover:bg-[#0f172a] active:scale-[0.98] disabled:opacity-70"
              >
                {resetPasswordForm.processing ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

