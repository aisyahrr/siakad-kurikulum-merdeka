import { Link } from "@inertiajs/react";
import { Compass, Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9eef3] p-4 text-[#20272d]">
      <div className="w-full max-w-md rounded-[28px] bg-[#e9eef3] p-8 text-center shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff]">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#edf2f6] text-[#17345b] shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
          <Compass size={40} className="animate-spin-slow" />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#087b79]">
          Error 404
        </span>
        <h1 className="mt-1 text-2xl font-black text-[#17345b]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-2 text-xs text-[#68777c] leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau Anda tidak memiliki akses ke alamat tersebut.
        </p>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[#17345b] px-6 py-2.5 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743]"
          >
            <Home size={14} />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
