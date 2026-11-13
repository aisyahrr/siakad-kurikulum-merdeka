import React from "react";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

interface Payment {
  id: number;
  title: string;
  amount: number;
  status: 'pending' | 'lunas';
  due_date: string;
}

interface PageProps {
  payments?: {
    data: Payment[];
  } | Payment[];
  [key: string]: any;
}

export default function KeuanganAnakPage({ payments = [] }: PageProps) {
  // Handle both pagination object from Laravel and plain array
  const paymentList = Array.isArray(payments) 
    ? payments 
    : (payments && 'data' in payments ? payments.data : []);

  return (
    <div className="space-y-6">
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#68777c]">
          Administrasi & Pembayaran
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#17345b]">
          Keuangan & SPP Anak
        </h1>
        <p className="mt-0.5 text-xs text-[#68777c]">
          Monitor status pembayaran SPP dan tagihan sekolah anak Anda.
        </p>
      </div>

      <div className="grid gap-4">
        {paymentList.length === 0 ? (
          <div className="rounded-2xl bg-[#e9eef3] p-8 text-center text-xs text-[#68777c] shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
            Belum ada tagihan atau riwayat pembayaran tercatat.
          </div>
        ) : (
          paymentList.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl bg-[#e9eef3] p-4 shadow-[5px_5px_12px_#cbd3db,-5px_-5px_12px_#fff]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2f6] text-[#17345b] shadow-[inset_2px_2px_4px_#cbd3db,inset_-2px_-2px_4px_#fff]">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#17345b]">{p.title}</h4>
                  <span className="text-[10px] text-[#68777c]">Jatuh Tempo: {p.due_date}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-[#17345b]">Rp {Number(p.amount || 0).toLocaleString('id-ID')}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-extrabold ${p.status === 'lunas' ? 'bg-[#dcebea] text-[#087b79]' : 'bg-[#fef3c7] text-[#92400e]'}`}>
                  {p.status === 'lunas' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {String(p.status || 'pending').toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
