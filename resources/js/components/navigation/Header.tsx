import { Bell, ChevronDown, ChevronUp, LogOut, Menu, Settings, ShieldCheck, Palette } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
    "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9eef3] text-[#536268] shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#ffffff] transition-all duration-200 hover:text-[#17345b] md:h-11 md:w-11";

export function Header({ onOpenSidebar }: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const user = auth?.user;

    if (!user) {
        return null;
    }

    const role = user.role;
    const portalLabel = roleLabels[role] ?? roleLabels.siswa;

    const getRoleSubLabel = () => {
        switch (role) {
            case "guru":
                return "Guru Pengampu";
            case "wali-kelas":
                return "Wali Kelas";
            case "admin":
                return "Administrator Sistem";
            case "orang-tua":
                return "Orang Tua / Wali";
            case "siswa":
                return "Siswa";
            default:
                return role;
        }
    };

    return (
        <header className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-5 md:h-[88px] md:px-8 xl:px-12">
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
            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3 md:gap-5">
                {/* NOTIFIKASI */}
                <button
                    type="button"
                    aria-label="Notifikasi"
                    className={iconButton}
                >
                    <Bell size={18} strokeWidth={1.8} />
                </button>

                {/* USER CHIP */}
                <DropdownMenu onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2.5 rounded-full outline-none"
                        >
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#17345b] font-bold text-white shadow-[4px_4px_10px_#cbd3db,-4px_-4px_10px_#ffffff] md:h-11 md:w-11">
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

                            <div className="hidden text-[#748084] md:block">
                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-56 border-none bg-[#edf2f6] shadow-[10px_10px_25px_#cbd3db,-10px_-10px_25px_#ffffff]"
                    >
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
                                            onSelect={() => {
                                                toast.info("Keluar dari aplikasi SIAKAD?", {
                                                    action: {
                                                        label: "Ya, Logout",
                                                        onClick: () => router.post("/logout"),
                                                    },
                                                });
                                            }}
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
