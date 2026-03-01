import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  Mic,
  BarChart3,
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  {
    label: "Resumes",
    value: "0",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    label: "Jobs",
    value: "0",
    icon: Briefcase,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    label: "Sessions",
    value: "0",
    icon: Mic,
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
  },
  {
    label: "Avg. Score",
    value: "—",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Upload Resume",
    desc: "Add your CV for AI analysis",
    icon: FileText,
    path: "/dashboard/resumes",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    label: "Add a Job",
    desc: "Paste URL or enter description",
    icon: Briefcase,
    path: "/dashboard/jobs",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    label: "Start Interview",
    desc: "Begin your AI practice session",
    icon: Mic,
    path: "/dashboard/session/new",
    color: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/20",
    highlight: true,
  },
  {
    label: "View Results",
    desc: "Review your past sessions",
    icon: BarChart3,
    path: "/dashboard/results",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
];

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export default function OverviewPage() {
  const { user } = useAuthStore();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-225 mx-auto flex flex-col gap-8">
      {/* Greeting */}
      <FadeUp>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] text-[#4B5563] mb-1">{greeting}</p>
            <h2 className="font-display font-extrabold text-white text-[26px] tracking-[-1px]">
              {user?.name?.split(" ")[0] ?? "there"} 
            </h2>
            <p className="text-[14px] text-muted-text mt-1">
              Ready to practice? Start a new session or review your progress.
            </p>
          </div>
          <Link to="/dashboard/session/new">
            <Button className="bg-brand text-canvas hover:bg-[#90CDF4] font-semibold gap-2 shrink-0">
              <Plus size={15} />
              New Session
            </Button>
          </Link>
        </div>
      </FadeUp>

      {/* Stats */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            >
              <Card className="bg-white/3 border-white/6 rounded-xl">
                <CardContent className="p-4">
                  <div
                    className={`inline-flex p-2 rounded-lg ${stat.bg} border ${stat.border} mb-3`}
                  >
                    <stat.icon size={14} className={stat.color} />
                  </div>
                  <div className="font-display font-extrabold text-white text-[24px] tracking-[-1px] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[12px] text-[#4B5563] mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </FadeUp>

      {/* Quick actions */}
      <FadeUp delay={0.15}>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#374151] mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
              >
                <Link to={action.path} className="no-underline block">
                  <motion.div
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-colors duration-200 cursor-pointer
                      ${
                        action.highlight
                          ? "bg-brand/[0.07] border-brand/20 hover:bg-brand/12"
                          : "bg-white/2 border-white/6 hover:bg-white/5 hover:border-white/10"
                      }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div
                      className={`p-2.5 rounded-lg ${action.bg} border ${action.border} shrink-0`}
                    >
                      <action.icon size={16} className={action.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-[13px] font-semibold ${action.highlight ? "text-brand" : "text-white"}`}
                      >
                        {action.label}
                      </div>
                      <div className="text-[12px] text-[#4B5563] mt-0.5">
                        {action.desc}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#374151] shrink-0" />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Recent activity — empty state */}
      <FadeUp delay={0.25}>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#374151] mb-3">
            Recent Sessions
          </p>
          <Card className="bg-white/2 border-white/6 rounded-xl">
            <CardContent className="py-14 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/4 border border-white/[0.07] flex items-center justify-center">
                <Clock size={18} className="text-[#374151]" />
              </div>
              <div className="text-center">
                <p className="text-[13px] text-white font-medium">
                  No sessions yet
                </p>
                <p className="text-[12px] text-[#4B5563] mt-1">
                  Your interview history will appear here.
                </p>
              </div>
              <Link to="/dashboard/session/new">
                <Button
                  size="sm"
                  className="mt-1 bg-brand/10 border border-brand/20 text-brand hover:bg-brand/20 hover:text-brand text-[12px] font-medium gap-1.5"
                >
                  <Plus size={12} />
                  Start your first session
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </FadeUp>

      {/* Tips */}
      <FadeUp delay={0.3}>
        <Card className="bg-brand/4 border-brand/12 rounded-xl">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brand/10 border border-brand/20 shrink-0 mt-0.5">
              <CheckCircle size={14} className="text-brand" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white mb-0.5">
                Get the most out of InterviewAI
              </p>
              <p className="text-[12px] text-muted-text leading-relaxed">
                Upload your latest CV, add the job you're targeting, then start
                a session. The AI will tailor every question to your background
                and the role.
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
