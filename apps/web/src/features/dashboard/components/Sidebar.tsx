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
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";
import { useConfirm } from "@/stores/confirm.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Resumes", icon: FileText, path: "/dashboard/resumes" },
  { label: "Jobs", icon: Briefcase, path: "/dashboard/jobs" },
  { label: "Interviews", icon: Mic, path: "/dashboard/interviews" },
  { label: "Results", icon: BarChart3, path: "/dashboard/results" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const { logout, isLoggingOut } = useAuth();
  const confirm = useConfirm();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
    confirm({
      title: "Sign out",
      description:
        "Are you sure you want to sign out? You'll need to log in again to access your dashboard.",
      confirmLabel: "Sign out",
      cancelLabel: "Stay",
      variant: "default",
      onConfirm: async () => {
        await logout();
      },
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
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
          "fixed left-0 top-0 z-50 h-full w-60 flex flex-col",
          "bg-canvas border-r border-white/6",
          "lg:translate-x-0 lg:static lg:z-auto",
        )}
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/6">
          <div className="flex items-center gap-2 font-display text-[16px] font-extrabold tracking-tight text-white">
            <PulseDot />
            InterviewAI
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[#4B5563] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Create Session CTA */}
        <div className="px-4 py-4 border-b border-white/6">
          <Link to="/dashboard/session/new">
            <Button className="w-full bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20 hover:text-brand font-medium text-[13px] gap-2 justify-start">
              <Plus size={14} />
              New Session
            </Button>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#374151] px-3 mb-2">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className="no-underline"
              >
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer group",
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-muted-text hover:text-[#E8EAF0] hover:bg-white/4",
                  )}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <item.icon
                    size={15}
                    className={
                      active
                        ? "text-brand"
                        : "text-[#4B5563] group-hover:text-[#9CA3AF]"
                    }
                  />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="active-nav"
                      className="ml-auto w-1 h-1 rounded-full bg-brand"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/6">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3 border border-white/6">
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-brand/10 text-brand text-[11px] font-semibold">
                {user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-[#4B5563] truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-[#374151] hover:text-red-400 transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
