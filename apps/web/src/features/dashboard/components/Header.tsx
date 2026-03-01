import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/resumes": "Resumes",
  "/dashboard/jobs": "Jobs",
  "/dashboard/interviews": "Interviews",
  "/dashboard/results": "Results",
  "/dashboard/session/new": "New Session",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Match current page title
  const title =
    Object.entries(PAGE_TITLES).find(
      ([path]) =>
        currentPath === path ||
        (path !== "/dashboard" && currentPath.startsWith(path)),
    )?.[1] ?? "Dashboard";

  return (
    <motion.header
      className="h-14 flex items-center justify-between px-5 border-b border-white/6 bg-canvas/80 backdrop-blur-sm sticky top-0 z-30"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#4B5563] hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>

        <motion.h1
          key={title}
          className="font-display font-bold text-white text-[16px] tracking-[-0.3px]"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#4B5563] hover:text-white hover:bg-white/4 size-8"
        >
          <Bell size={15} />
        </Button>
      </div>
    </motion.header>
  );
}
