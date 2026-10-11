import type { ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/Components/ui/Button";

export function Header({
  title,
  description,
  action,
  onAction,
}: {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#17345b]">
          PORTAL GURU
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-[#68777c]">{description}</p>
      </div>
      {action && (
        <Button icon={<Plus size={16} />} onClick={onAction} type="button">
          {action}
        </Button>
      )}
    </div>
  );
}
export function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[#17345b]/35 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[27px] bg-[#edf2f4] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#17345b]">
              PORTAL GURU
            </p>
            <h2 className="mt-1 text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-[#68777c]">{description}</p>
          </div>
          <button
            className="rounded-full p-2 hover:bg-[#dce4e8]"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export const field =
  "mt-1 w-full rounded-2xl bg-[#e9eef3] p-3 outline-none shadow-inner";
export function ModalActions({
  onClose,
  label = "Simpan",
}: {
  onClose: () => void;
  label?: string;
}) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button onClick={onClose} type="button" variant="secondary">
        Batal
      </Button>
      <Button type="submit">{label}</Button>
    </div>
  );
}
