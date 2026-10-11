import { NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  House,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Megaphone,
  UserRound,
  Settings,
  LogOut,
  X,
  BookOpen,
  LayoutDashboard,
  Users,
  PenTool,
  Clock,
  Layers,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/Hooks/useAuth";
import { studentNavigation } from "../../constants/navigation";
import { roleIcons, roleNavigation } from "../../constants/roleNavigation";

const defaultIcons: Record<string, typeof House> = {
  House,
  CalendarDays,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Megaphone,
  UserRound,
  BookOpen,
  LayoutDashboard,
  Users,
  PenTool,
  Clock,
  Layers,
  Briefcase,
};

interface SidebarProps {
  role?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ role = "siswa", isOpen, onClose }: SidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navigation =
    role === "siswa"
      ? studentNavigation
      : (roleNavigation[role] ?? studentNavigation);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col rounded-tr-[20px] rounded-br-[20px] bg-[#011024] py-7 pl-6 pr-0 transition-transform duration-300 max-md:-translate-x-full ${
          isOpen ? "max-md:translate-x-0" : ""
        }`}
      >
        {/* HEADER / LOGO (SIAKAD DENGAN ICON TOGA) */}
        <div className="flex items-center justify-between pr-6">
          <div className="flex items-center gap-3">
            <GraduationCap
              size={28}
              className="text-[#ffffff]"
              strokeWidth={2.4}
            />
            <span className="text-xl font-extrabold tracking-tight text-[#ffffff]">
              SIAKAD
            </span>
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            type="button"
            aria-label="Tutup sidebar"
            className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eef3] text-[#d9dddf] shadow-[2px_2px_5px_#cbd3db,-2px_-2px_5px_#ffffff] md:hidden"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="mt-8 flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => {
            const IconComponent =
              roleIcons[item.icon as keyof typeof roleIcons] ??
              defaultIcons[item.icon as keyof typeof defaultIcons] ??
              House;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === `/${role}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3.5 py-3 pl-4 pr-3 text-xs font-bold transition-all duration-250 ${
                    isActive
                      ? "rounded-l-xl bg-[#e9eef3] text-[#17345b] shadow-[inset_4px_4px_8px_#e9eef3] " +
                        // --- LEKUKAN KELUAR ATAS ---
                        "before:pointer-events-none before:absolute before:-top-5 before:right-0 before:h-5 before:w-5 " +
                        "before:rounded-br-xl before:shadow-[6px_6px_0_0_#e9eef3] " +
                        // --- LEKUKAN KELUAR BAWAH ---
                        "after:pointer-events-none after:absolute after:-bottom-5 after:right-0 after:h-5 after:w-5 " +
                        "after:rounded-tr-xl after:shadow-[6px_-6px_0_0_#e9eef3]"
                      : "text-[#fdfdfd] hover:text-[#bcd5f7]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-[#17345b]"
                          : "text-[#fdfdfd] group-hover:text-[#bcd5f7]"
                      }`}
                    />
                    <span className="truncate tracking-wide">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS (SETTINGS & LOGOUT) */}
        <div className="mt-auto flex flex-col gap-1.5 pt-4">
          <NavLink
            to={`/${role}/pengaturan`}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3.5 py-2.5 pl-4 pr-3 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "rounded-l-2xl bg-[#e9eef3] text-[#17345b] shadow-[inset_4px_4px_8px_#cad3db]"
                  : "text-[#fdfdfd] hover:text-[#bcd5f7]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  size={18}
                  strokeWidth={1.9}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-[#17345b]"
                      : "text-[#fdfdfd] group-hover:text-[#bcd5f7]"
                  }`}
                />
                <span className="tracking-wide">Settings</span>
              </>
            )}
          </NavLink>

          <button
            type="button"
            title="Keluar"
            className="group flex items-center gap-3.5 py-2.5 pl-4 pr-3 text-xs font-bold text-[#fdfdfd] transition-colors hover:text-[#d9534f] cursor-pointer"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
          >
            <LogOut
              size={18}
              strokeWidth={1.9}
              className="shrink-0 text-[#fdfdfd] transition-colors group-hover:text-[#d9534f]"
            />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* BACKDROP UNTUK TAMPILAN MOBILE */}
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
