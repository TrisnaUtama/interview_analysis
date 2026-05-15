import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "@tanstack/react-router";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SIDEBAR_WIDTH = "260px";

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden bg-[#070A0F]">
      {/* Background (same vibe as landing page) */}
      <div className="fixed inset-0 pointer-events-none">
        {/* soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,179,237,0.08),transparent_60%)]" />

        {/* grid noise */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.6)_1px,transparent_0)] bg-[length:24px_24px]" />

        {/* vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      <div className="flex relative">
        {/* Desktop Sidebar */}
        <div
          className="hidden lg:block fixed left-0 top-0 h-full z-40"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <Sidebar open={true} onClose={() => {}} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <div
          className="flex-1 flex flex-col min-h-screen"
          style={{
            marginLeft: `min(${SIDEBAR_WIDTH}, 100vw)`,
          }}
        >
          {/* Header wrapper (FIX ALIGNMENT + GLASS STYLE) */}
          <div className="sticky top-0 z-30">
            <div className="backdrop-blur-xl bg-[#0B0F17]/70 border-b border-white/5">
              <Header onMenuClick={() => setSidebarOpen(true)} />
            </div>
          </div>

          {/* Content */}
          <main className="flex-1 px-4 sm:px-6 py-10">
            <div className="max-w-[1100px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
