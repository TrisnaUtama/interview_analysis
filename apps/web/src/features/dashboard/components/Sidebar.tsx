import { motion, AnimatePresence } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mic,
  BarChart3,
  Plus,
  X,
  LogOut,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConfirm } from "@/stores/confirm.store";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Resumes", icon: FileText, path: "/dashboard/resumes" },
      { label: "Jobs", icon: Briefcase, path: "/dashboard/jobs" },
    ],
  },
  {
    label: "Practice",
    items: [
      { label: "Interviews", icon: Mic, path: "/dashboard/interviews" },
      { label: "Results", icon: BarChart3, path: "/dashboard/results" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
      { label: "Settings", icon: Settings, path: "/dashboard/settings" },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const confirm = useConfirm();
  const handleLogout = () => {
    confirm({
      title: "Sign out",
      description: "Are you sure you want to sign out?",
      confirmLabel: "Sign out",
      cancelLabel: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        await logout();
      },
    });
  };
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") ?? "U";

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-67.5 flex flex-col",
          "bg-[#0B0C10] border-r border-white/10",
          "lg:static lg:translate-x-0",
        )}
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
      >
        {/* glow edge */}
        <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-purple-500/20 via-orange-500/10 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Mic size={14} className="text-orange-400" />
            </div>

            <span className="font-semibold text-white text-[15px] tracking-tight">
              InterviewAI
            </span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* CTA */}
        <div className="px-4 mb-5">
          <Link to="/dashboard/session/new">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="
                w-full flex items-center justify-center gap-2
                px-3 py-2.5 rounded-xl
                bg-linear-to-r from-orange-500 to-purple-600
                text-white text-[13px] font-medium
                shadow-lg shadow-purple-500/10
              "
            >
              <Plus size={14} />
              New Session
            </motion.button>
          </Link>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 overflow-y-auto flex flex-col gap-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 px-3 mb-2">
                {section.label}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="no-underline"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all relative",
                          active
                            ? "text-white"
                            : "text-white/50 hover:text-white",
                        )}
                      >
                        {/* active glow pill */}
                        {active && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="
                              absolute inset-0 rounded-xl
                              bg-white/5 border border-white/10
                            "
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}

                        <item.icon
                          size={15}
                          className={
                            active ? "text-orange-400" : "text-white/40"
                          }
                        />

                        <span className="flex-1 font-medium relative z-10">
                          {item.label}
                        </span>

                        {active && (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 relative z-10" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="size-8 rounded-xl">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-white/5 text-orange-400 text-[11px] font-semibold rounded-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-white/40 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-white/40 hover:text-orange-400 transition"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
