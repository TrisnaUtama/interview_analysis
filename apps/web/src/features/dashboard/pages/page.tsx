import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  Mic,
  BarChart3,
  Plus,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

/* ───────── BRAND COLORS ───────── */
const ACCENT = "#FB923C"; // orange (landing page accent feel)

/* ───────── DATA ───────── */
const STATS = [
  { label: "Resumes", value: "0", icon: FileText },
  { label: "Jobs", value: "0", icon: Briefcase },
  { label: "Sessions", value: "0", icon: Mic },
  { label: "Score", value: "—", icon: BarChart3 },
];

const ACTIONS = [
  {
    label: "Upload Resume",
    desc: "Analyze your CV instantly",
    icon: FileText,
    path: "/dashboard/resumes",
  },
  {
    label: "Add Job",
    desc: "Track target role",
    icon: Briefcase,
    path: "/dashboard/jobs",
  },
  {
    label: "Start Interview",
    desc: "AI mock interview session",
    icon: Mic,
    path: "/dashboard/session/new",
    primary: true,
  },
  {
    label: "View Results",
    desc: "Check performance",
    icon: BarChart3,
    path: "/dashboard/results",
  },
];

/* ───────── ANIMATION ───────── */
function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── PAGE ───────── */
export default function OverviewPage() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-10 pb-12 text-slate-200 relative">
      {/* ───────── BACKGROUND ───────── */}
      <div className="fixed inset-0 -z-10 bg-[#070A0F]" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-50 left-1/2 w-150 h-150 -translate-x-1/2 bg-orange-500/10 blur-[140px] rounded-full" />
        <div className="absolute -bottom-50 -right-25 w-125 h-125 bg-cyan-500/10 blur-[140px] rounded-full" />
      </div>

      {/* ───────── HERO ───────── */}
      <FadeUp>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-slate-500">
              Welcome back
            </p>

            <h1 className="text-4xl font-semibold text-white mt-2 tracking-tight">
              {firstName}
              <span className="text-orange-400">.</span>
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Your interview workspace overview
            </p>
          </div>

          <Link to="/dashboard/session/new">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
              style={{
                backgroundColor: ACCENT,
                color: "#0B0F14",
              }}
            >
              <Plus size={16} />
              New Session
            </button>
          </Link>
        </div>
      </FadeUp>

      {/* ───────── STATS ───────── */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="
                rounded-2xl
                border border-white/10
                bg-white/3
                backdrop-blur-xl
                p-5
                hover:border-orange-400/20
                transition
              "
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <s.icon size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="text-2xl font-semibold text-white">{s.value}</div>

              <div className="text-xs tracking-[0.2em] uppercase text-slate-500 mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* ───────── ACTIONS ───────── */}
      <FadeUp delay={0.1}>
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-slate-500 mb-4">
            Quick actions
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {ACTIONS.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link to={a.path} className="block">
                  <div
                    className={`
                      group flex items-center gap-4 p-4 rounded-2xl border transition
                      ${
                        a.primary
                          ? "bg-white text-black border-white"
                          : "bg-white/3 text-white border-white/10 hover:border-orange-400/30"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${a.primary ? "bg-black/10" : "bg-white/5 border border-white/10"}
                      `}
                    >
                      <a.icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.label}</p>
                      <p
                        className={`text-xs mt-0.5 ${
                          a.primary ? "text-black/60" : "text-slate-500"
                        }`}
                      >
                        {a.desc}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={14}
                      className={
                        a.primary ? "text-black/60" : "text-orange-400/70"
                      }
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ───────── EMPTY STATE ───────── */}
      <FadeUp delay={0.15}>
        <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-10 text-center">
          <div className="w-11 h-11 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Clock size={18} className="text-slate-400" />
          </div>

          <h3 className="mt-4 text-sm font-medium text-white">
            No activity yet
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            Start your first interview session to see insights here.
          </p>

          <Link to="/dashboard/session/new">
            <button
              className="mt-5 px-4 py-2 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
              style={{
                backgroundColor: ACCENT,
                color: "#0B0F14",
              }}
            >
              Start Session
            </button>
          </Link>
        </div>
      </FadeUp>

      {/* ───────── TIP ───────── */}
      <FadeUp delay={0.2}>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            "Upload your CV",
            "Define target role",
            "Practice speaking aloud",
          ].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-white/10 bg-white/3 p-5 hover:border-orange-400/20 transition"
            >
              <p className="text-sm font-medium text-white">{t}</p>
              <p className="text-xs text-slate-500 mt-1">
                Improve interview readiness
              </p>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* ───────── UPGRADE ───────── */}
      <FadeUp delay={0.25}>
        <div className="rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-transparent p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-medium">
              Upgrade to Pro <span className="text-orange-400">+</span>
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Unlock deeper AI insights & analytics
            </p>
          </div>

          <Link to={"/dashboard/billing" as any}>
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
              style={{
                backgroundColor: ACCENT,
                color: "#0B0F14",
              }}
            >
              Upgrade
            </button>
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
