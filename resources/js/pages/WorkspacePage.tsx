import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Download,
  FileText,
  Info,
  Search,
  Users,
  X,
} from "lucide-react";
import { Card } from "@/Components/ui/Card";
import { workspaceData, type WorkspaceRole } from "@/data/workspace";

type Props = {
  role: WorkspaceRole;
  title: string;
  eyebrow: string;
  description: string;
};
const button =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#17345b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102743]";
const softButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#edf2f4] px-5 py-3 text-sm font-bold text-[#37454a] shadow-[4px_4px_9px_#cbd3db,-4px_-4px_9px_#fff]";

export function WorkspacePage({ role, title, eyebrow, description }: Props) {
  const data = workspaceData[role];
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const filtered = useMemo(
    () =>
      data.records.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [data.records, query],
  );
  const exportData = () => {
    const blob = new Blob(
      [filtered.map((item) => Object.values(item).join(",")).join("\n")],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${role}-rekap.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#17345b]">
          {eyebrow}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#20272d] md:text-4xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-base leading-relaxed text-[#68777c]">
          {description}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map(([label, value, note], index) => {
          const Icon = [Users, BarChart3, ClipboardCheck, BookOpen][index];
          return (
            <Card className="!mb-0" key={label}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#dceafa] text-[#1762bf]">
                <Icon size={21} />
              </span>
              <p className="mt-5 text-sm text-[#68777c]">{label}</p>
              <strong className="mt-1 block text-3xl text-[#17345b]">
                {value}
              </strong>
              <small className="text-[#087b79]">{note}</small>
            </Card>
          );
        })}
      </div>
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Aktivitas dan ringkasan terbaru
            </h2>
            <p className="mt-1 text-sm text-[#68777c]">
              Data dummy siap diganti service API.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-[#e9eef3] px-4 py-3 shadow-inner">
              <Search size={17} />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Cari data..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button
              className={button}
              type="button"
              onClick={() => setModal(true)}
            >
              <FileText size={16} />
              Tambah
            </button>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-[#d4dde1] text-sm text-[#68777c]">
                <th className="pb-3">Nama / Aktivitas</th>
                <th className="pb-3">Konteks</th>
                <th className="pb-3">Keterangan</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  className="border-b border-[#e1e7ea] last:border-0"
                  key={item.name}
                >
                  <td className="py-4 pr-4 font-bold">{item.name}</td>
                  <td>{item.context}</td>
                  <td>{item.detail}</td>
                  <td className="font-bold text-[#17345b]">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="py-8 text-center text-[#68777c]">
              Data tidak ditemukan.
            </p>
          )}
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap gap-3">
          <button className={softButton} type="button" onClick={exportData}>
            <Download size={17} />
            Export CSV
          </button>
          <button
            className={softButton}
            type="button"
            onClick={() => window.print()}
          >
            <Info size={17} />
            Print / preview
          </button>
        </div>
      </Card>
      {modal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#17345b]/35 p-4"
          onClick={() => setModal(false)}
        >
          <div
            className="w-full max-w-md rounded-[27px] bg-[#edf2f4] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Tambah data</h2>
              <button type="button" onClick={() => setModal(false)}>
                <X />
              </button>
            </div>
            <input
              className="mt-5 w-full rounded-2xl bg-[#e9eef3] p-4 outline-none shadow-inner"
              placeholder="Nama aktivitas"
            />
            <button
              className={`${button} mt-5 w-full`}
              type="button"
              onClick={() => setModal(false)}
            >
              Simpan data dummy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
