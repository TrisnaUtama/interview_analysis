import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center relative overflow-hidden text-white">
      {/* background glow system */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-size-[32px_32px]" />

        <div className="absolute -top-50 left-1/2 w-150 h-150 -translate-x-1/2 bg-orange-500/10 blur-[140px] rounded-full" />
        <div className="absolute -bottom-50 -right-30 w-125 h-125 bg-purple-500/10 blur-[140px] rounded-full" />
      </div>

      {/* content */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center gap-6 px-6"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* brand */}
        <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
          <PulseDot />
          Interview<span className="text-orange-400">AI</span>
        </div>

        {/* big number */}
        <div className="relative">
          <div className="text-[120px] sm:text-[160px] font-extrabold tracking-[-6px] text-white/5 select-none leading-none">
            404
          </div>

          {/* glow behind number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-orange-500/10 blur-2xl" />
          </div>
        </div>

        {/* text */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Page not found</h1>
          <p className="text-sm text-white/40 max-w-sm">
            The page you’re looking for doesn’t exist, was moved, or never
            existed.
          </p>
        </div>

        {/* actions */}
        <div className="flex gap-3 mt-2">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-white text-black hover:bg-white/90 font-medium px-5"
          >
            Back Home
          </Button>

          <Button
            onClick={() => navigate({ to: "/dashboard" })}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
