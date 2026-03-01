import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas font-sans flex items-center justify-center relative overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <motion.div
        className="relative z-10 text-center flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 font-display text-[16px] font-extrabold text-white mb-4">
          <PulseDot />
          InterviewAI
        </div>

        <div
          className="font-display font-extrabold text-white/6 leading-none tracking-[-4px] select-none"
          style={{ fontSize: "clamp(100px, 20vw, 180px)" }}
        >
          404
        </div>

        <div className="-mt-8">
          <h1 className="font-display font-extrabold text-white text-[28px] tracking-[-1px] mb-3">
            Page not found
          </h1>
          <p className="text-[14px] text-muted-text max-w-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-brand text-canvas hover:bg-[#90CDF4] font-semibold"
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/dashboard" })}
            className="bg-white/3 border-white/[0.07] text-[#E8EAF0] hover:bg-white/6"
          >
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
