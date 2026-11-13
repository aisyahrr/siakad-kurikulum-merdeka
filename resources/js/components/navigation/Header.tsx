import { Bell, LogOut, Menu, Search, Settings, ShieldCheck, Palette } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { roleLabels } from "../../constants/roleNavigation";
import type { SharedData } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    onOpenSidebar: () => void;
}

const iconButton =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e9eef3] text-[#536268] shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#ffffff] transition-all duration-200 hover:text-[#17345b]";

export function Header({ onOpenSidebar }: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;
    const role = user.role;
    const portalLabel = roleLabels[role] ?? roleLabels.siswa;

    const getRoleSubLabel = () => {
        switch (role) {
            case "guru":
                return "Guru Pengampu";
            case "wali-kelas":
                return "Wali Kelas XII MIPA 1";
            case "admin":
                return "Administrator Sistem";
            default:
                return "Kelas XII MIPA 1";
        }
    };

    return (
        <header className="flex h-[88px] items-center justify-between px-5 md:px-8 xl:px-12">
            {/* MOBILE MENU TOGGLE */}
            <button
                type="button"
                aria-label="Buka sidebar"
                className={`${iconButton} md:hidden`}
                onClick={onOpenSidebar}
            >
                <Menu size={21} />
            </button>

            {/* BREADCRUMB */}
            <div className="hidden items-center text-xs font-semibold text-[#758087] md:flex">
                <span>SIAKAD</span>
                <span className="mx-3 text-[#a3adb2]">/</span>
                <span className="font-bold text-[#17345b]">{portalLabel}</span>
            </div>

            {/* RIGHT CONTROLS */}
            <div className="ml-auto flex items-center gap-3 md:gap-5">
                {/* GLOBAL SEARCH */}
                <div className="hidden h-12 w-[320px] items-center gap-2.5 rounded-full px-4 text-xs text-[#7d888c] shadow-[inset_3px_3px_8px_#cbd3db,inset_-3px_-3px_8px_#ffffff] lg:flex">
                    <Search size={16} />
                    <span>Cari mata pelajaran, guru, materi...</span>
                </div>

                {/* NOTIFIKASI */}
                <button
                    type="button"
                    aria-label="Notifikasi"
                    className={iconButton}
                >
                    <Bell size={18} strokeWidth={1.8} />
                </button>

                {/* USER CHIP */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2.5 rounded-full outline-none"
                        >
                            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#17345b] font-bold text-white shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#ffffff]">
                                {user.name?.[0] ?? "U"}
                            </div>

                            <div className="hidden text-left md:block">
                                <p className="text-xs font-bold text-[#20282d]">
                                    {user.name}
                                </p>
                                <p className="text-[11px] text-[#748084]">
                                    {getRoleSubLabel()}
                                </p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <p className="text-xs font-bold text-[#20282d]">
                                {user.name}
                            </p>
                            <p className="text-[11px] font-normal text-[#748084]">
                                {user.email}
                            </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings/profile"
                                className="cursor-pointer"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings/security"
                                className="cursor-pointer"
                            >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Security
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href="/settings/appearance"
                                className="cursor-pointer"
                            >
                                <Palette className="mr-2 h-4 w-4" />
                                Appearance
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-[#d9534f] focus:text-[#d9534f]"
                            onSelect={() => router.post("/logout")}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
