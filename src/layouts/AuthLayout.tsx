import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "@/Components/navigation/Sidebar";
import { Header } from "@/Components/navigation/Header";

export function AuthLayout({ role = "siswa" }: { role?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#e9eef3] text-[#20282d]">
      {/* SIDEBAR TETAP */}
      <Sidebar
        role={role}
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      {/* MAIN CONTAINER */}
      <div className="flex h-screen min-w-0 flex-col md:pl-[210px]">
        {/* HEADER TETAP */}
        <div className="z-30 shrink-0">
          <Header
            role={role}
            onOpenSidebar={() => setOpen(true)}
          />
        </div>

        {/* KONTEN SAJA YANG SCROLL */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full px-5 pb-16 pt-2 md:px-8 xl:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
