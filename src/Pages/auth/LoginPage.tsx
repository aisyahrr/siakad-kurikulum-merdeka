import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { DEMO_USERS, ROLE_LABELS } from "../../constants";
import { useAuth } from "@/Hooks/useAuth";
export function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("siswa@siakad.test");
  const [password, setPassword] = useState("password");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  if (user) return <Navigate to={`/${user.role}`} replace />;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const next = await signIn({ email, password });
      navigate(`/${next.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-[#e9eef3] p-5">
      <form
        className="w-full max-w-[460px] rounded-[28px] bg-[#e9eef3] p-6 shadow-[10px_10px_22px_#c9d1da,-10px_-10px_22px_#fff] sm:p-10"
        onSubmit={submit}
      >
        <div className="mb-8 flex items-center gap-3 text-[#17345b]">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#17345b] text-xl text-white">
            ✦
          </span>
          <div>
            <b className="block">SIAKAD</b>
            <small className="text-[#748084]">Portal Akademik</small>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Masuk ke akun Anda</h1>
        <p className="mb-7 text-[#718087]">
          Gunakan akun demo untuk menjelajah sistem.
        </p>
        <label className="mb-4 block font-medium">
          Email
          <input
            className="mt-2 w-full rounded-xl border-0 bg-[#e9eef3] p-3.5 shadow-[inset_3px_3px_7px_#cbd3db,inset_-3px_-3px_7px_#fff] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="mb-4 block font-medium">
          Password
          <div className="mt-2 flex rounded-xl shadow-[inset_3px_3px_7px_#cbd3db,inset_-3px_-3px_7px_#fff]">
            <input
              className="w-full border-0 bg-transparent p-3.5 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              required
            />
            <button
              className="px-3 text-sm text-[#17345b]"
              type="button"
              onClick={() => setShow(!show)}
            >
              Lihat
            </button>
          </div>
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button
          className="mt-3 w-full rounded-full bg-[#17345b] px-5 py-[13px] text-white"
          type="submit"
        >
          Masuk
        </button>
        <div className="mt-6 grid gap-3">
          {DEMO_USERS.map((d) => (
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border-0 bg-[#e9eef3] p-3 text-left shadow-[3px_3px_8px_#cbd3db,-3px_-3px_8px_#fff]"
              key={d.id}
              onClick={() => {
                setEmail(d.email);
                setPassword(d.password);
              }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#17345b] text-white">
                {d.name[0]}
              </span>
              <span>
                <b className="block">{d.name}</b>
                <small className="text-[#748084]">{ROLE_LABELS[d.role]}</small>
              </span>
            </button>
          ))}
        </div>
      </form>
    </main>
  );
}
