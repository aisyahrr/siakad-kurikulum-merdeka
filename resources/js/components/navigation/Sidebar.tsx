import { Link, usePage, router } from "@inertiajs/react";
import { GraduationCap, Settings, LogOut, X, House } from "lucide-react";

import { roleIcons, roleNavigation } from "@/constants/roleNavigation";
import type { SharedData } from "@/types";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { auth } = usePage<SharedData>().props;
    const role = auth.user.role;
    const { url } = usePage();

    // Ambil navigasi berdasarkan role
    const navigation = roleNavigation[role] ?? [];

    // Cek apakah menu sedang aktif
    const isActive = (href: string) => {
        const currentPath = url.split("?")[0];

        return (
            currentPath === href ||
            (href !== `/${role}` && currentPath.startsWith(`${href}/`))
        );
    };
    const handleSignOut = () => {
        router.post("/logout");
    };
    console.log("Current URL:", url);
    console.log("Role:", role);
    console.log("Navigation:", navigation);
    return (
        <>
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-50 flex-col rounded-tr-[10px] rounded-br-[10px] bg-[#011024] py-7 pl-6 pr-0 transition-transform duration-300 max-md:-translate-x-full ${
                    isOpen ? "max-md:translate-x-0" : ""
                }`}
            >
                {/* HEADER / LOGO */}
                <div className="flex items-center justify-between pr-6">
                    <div className="flex items-center gap-3">
                        <GraduationCap
                            size={28}
                            className="text-white"
                            strokeWidth={2.4}
                        />

                        <span className="text-xl font-extrabold tracking-tight text-white">
                            SIAKAD
                        </span>
                    </div>

                    {/* MOBILE CLOSE BUTTON */}
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#17345b] md:hidden"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* NAVIGATION */}
                <nav className="mt-8 flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-y-auto scrollbar-hide">
                    {navigation.map((item) => {
                        const IconComponent = roleIcons[item.icon] ?? House;

                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`group relative flex items-center gap-3.5 py-3 pl-4 pr-3 text-xs font-bold transition-all duration-200 ${
                                    active
                                        ? "rounded-l-xl bg-[#e9eef3] text-[#17345b] shadow-[inset_4px_4px_8px_#e9eef3] before:pointer-events-none before:absolute before:-top-5 before:right-0 before:h-5 before:w-5 before:rounded-br-xl before:shadow-[6px_6px_0_0_#e9eef3] after:pointer-events-none after:absolute after:-bottom-5 after:right-0 after:h-5 after:w-5 after:rounded-tr-xl after:shadow-[6px_-6px_0_0_#e9eef3]"
                                        : "text-white hover:text-[#bcd5f7]"
                                }`}
                            >
                                <IconComponent
                                    size={18}
                                    strokeWidth={active ? 2.2 : 1.9}
                                    className={`shrink-0 transition-colors ${
                                        active
                                            ? "text-[#17345b]"
                                            : "text-white group-hover:text-[#bcd5f7]"
                                    }`}
                                />

                                <span className="truncate tracking-wide">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* BOTTOM ACTIONS */}
                <div className="mt-auto flex flex-col gap-1.5 pt-4">
                    <Link
                        href={`/${role}/pengaturan`}
                        onClick={onClose}
                        className={`group flex items-center gap-3.5 py-2.5 pl-4 pr-3 text-xs font-bold transition-all duration-200 ${
                            isActive(`/${role}/pengaturan`)
                                ? "rounded-l-2xl bg-[#e9eef3] text-[#17345b]"
                                : "text-white hover:text-[#bcd5f7]"
                        }`}
                    >
                        <Settings size={18} strokeWidth={1.9} />

                        <span className="tracking-wide">Settings</span>
                    </Link>

                    <button
                        type="button"
                        title="Keluar"
                        className="group flex cursor-pointer items-center gap-3.5 py-2.5 pl-4 pr-3 text-xs font-bold text-white transition-colors hover:text-[#d9534f]"
                        onClick={handleSignOut}
                    >
                        <LogOut
                            size={18}
                            strokeWidth={1.9}
                            className="shrink-0 transition-colors group-hover:text-[#d9534f]"
                        />

                        <span className="tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>

            {/* MOBILE BACKDROP */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Tutup sidebar"
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
}
