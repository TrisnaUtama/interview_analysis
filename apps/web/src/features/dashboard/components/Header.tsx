import { motion } from "framer-motion";
import { Menu, Bell, Search } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Your workspace at a glance" },
  "/dashboard/resumes": { title: "Resumes", subtitle: "Manage your CVs" },
  "/dashboard/jobs": { title: "Jobs", subtitle: "Track target roles" },
  "/dashboard/interviews": {
    title: "Interviews",
    subtitle: "Practice sessions",
  },
  "/dashboard/results": { title: "Results", subtitle: "Performance insights" },
  "/dashboard/billing": { title: "Billing", subtitle: "Plan & subscription" },
  "/dashboard/settings": { title: "Settings", subtitle: "Account preferences" },
  "/dashboard/session/new": {
    title: "New Session",
    subtitle: "Configure your interview",
  },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const match = Object.entries(PAGE_TITLES).find(
    ([path]) =>
      currentPath === path ||
      (path !== "/dashboard" && currentPath.startsWith(path)),
  );

  const page = match?.[1] ?? { title: "Dashboard" };

  return (
    <motion.header
      className="
        sticky top-0 z-30
        h-16
        flex items-center justify-between
        px-5 sm:px-6
        bg-[#0B0C10]/80 backdrop-blur-xl
        border-b border-white/10
      "
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            w-9 h-9
            flex items-center justify-center
            rounded-xl
            bg-white/5 border border-white/10
            text-white/60
            hover:text-white hover:bg-white/10
            transition
          "
        >
          <Menu size={16} />
        </button>

        {/* Title */}
        <motion.div
          key={page.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="min-w-0"
        >
          <h1 className="text-[17px] sm:text-[19px] font-semibold text-white tracking-tight">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="text-[11px] sm:text-[12px] text-white/40 mt-0.5 truncate">
              {page.subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="
            hidden sm:flex items-center gap-2
            px-3 py-2 rounded-xl
            bg-white/5 border border-white/10
            text-white/50
            hover:text-white hover:bg-white/10
            transition
          "
        >
          <Search size={14} />
          <span className="text-[12px]">Search</span>

          {/* shortcut hint */}
          <span className="ml-2 text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-md">
            ⌘K
          </span>
        </button>

        {/* Mobile search */}
        <button
          className="
            sm:hidden
            w-9 h-9
            flex items-center justify-center
            rounded-xl
            bg-white/5 border border-white/10
            text-white/60
            hover:text-white hover:bg-white/10
            transition
          "
        >
          <Search size={14} />
        </button>

        {/* Notifications */}
        <button
          className="
            relative
            w-9 h-9
            flex items-center justify-center
            rounded-xl
            bg-white/5 border border-white/10
            text-white/60
            hover:text-white hover:bg-white/10
            transition
          "
        >
          <Bell size={15} />

          {/* notification dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-sm shadow-orange-400/30" />
        </button>
      </div>
    </motion.header>
  );
}
