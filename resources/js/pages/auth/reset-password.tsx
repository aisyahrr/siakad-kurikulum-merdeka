import { Head, useForm } from "@inertiajs/react";
import { KeyRound, Mail } from "lucide-react";

interface ResetPasswordProps {
  email?: string;
  token?: string;
  passwordRules?: string;
}

export default function ResetPasswordPage({
  email = "",
  token = "",
  passwordRules,
}: ResetPasswordProps = {}) {
  const form = useForm({
    token,
    email,
    password: "",
    password_confirmation: "",
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.post("/reset-password");
  };

  return (
    <div className="space-y-5">
      <Head title="Reset Password" />

      <div>
        <h1 className="text-xl font-extrabold text-[#17345b]">Reset Password</h1>
        <p className="mt-1 text-xs text-[#68777c]">
          Buat password baru untuk akun Anda.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-[11px] font-bold text-[#17345b]">
            Alamat Email
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-[#e9eef3] px-3 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <Mail size={15} className="text-[#68777c]" />
            <input
              type="email"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none"
              required
            />
          </div>
          {form.errors.email && (
            <span className="mt-1 block text-[10px] font-semibold text-[#c0392b]">
              {form.errors.email}
            </span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-[#17345b]">
            Password Baru
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-[#e9eef3] px-3 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <KeyRound size={15} className="text-[#68777c]" />
            <input
              type="password"
              value={form.data.password}
              onChange={(e) => form.setData("password", e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none"
              required
            />
          </div>
          {form.errors.password && (
            <span className="mt-1 block text-[10px] font-semibold text-[#c0392b]">
              {form.errors.password}
            </span>
          )}
          {passwordRules && (
            <span className="mt-1 block text-[10px] text-[#88989e]">{passwordRules}</span>
          )}
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-[#17345b]">
            Konfirmasi Password Baru
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-[#e9eef3] px-3 py-2.5 shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
            <KeyRound size={15} className="text-[#68777c]" />
            <input
              type="password"
              value={form.data.password_confirmation}
              onChange={(e) => form.setData("password_confirmation", e.target.value)}
              className="w-full bg-transparent text-xs text-[#20272d] outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={form.processing}
          className="w-full rounded-full bg-[#17345b] px-4 py-2.5 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743] disabled:opacity-50"
        >
          {form.processing ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>
    </div>
  );
}
