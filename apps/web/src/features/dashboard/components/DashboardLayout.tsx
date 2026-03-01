import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ConfirmModal } from "@/components/common/ConfirmationModal";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050709] font-sans flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 shrink-0">
        <div className="fixed left-0 top-0 w-60 h-full">
          <Sidebar open={true} onClose={() => {}} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Global confirm modal — mount sekali, pakai dari mana saja */}
      <ConfirmModal />
    </div>
  );
}
