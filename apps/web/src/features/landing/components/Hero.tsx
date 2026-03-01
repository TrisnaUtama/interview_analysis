import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "./ui/PulseDot";

// Animated waveform bars — simulates voice/audio activity
function VoiceWaveform({ active = true }: { active?: boolean }) {
  const BARS = 32;
  return (
    <div className="flex items-center gap-0.75 h-10">
      {Array.from({ length: BARS }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.75 rounded-full bg-brand/60"
          animate={
            active
              ? {
                  height: [
                    `${8 + Math.random() * 20}px`,
                    `${8 + Math.random() * 32}px`,
                    `${8 + Math.random() * 16}px`,
                  ],
                  opacity: [0.4, 0.9, 0.5],
                }
              : { height: "4px", opacity: 0.2 }
          }
          transition={{
            duration: 0.6 + Math.random() * 0.8,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating AI feedback card
function FloatingCard({
  children,
  className,
  delay,
  x,
  y,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  x: number[];
  y: number[];
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        x,
        y,
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        x: {
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay,
        },
        y: {
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: delay + 1,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Ripple pulse around mic
function MicRipple() {
  return (
    <div className="relative flex items-center justify-center">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand/30"
          animate={{
            scale: [1, 2.2 + i * 0.4],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
          style={{ width: 56, height: 56 }}
        />
      ))}
      <div className="relative z-10 w-14 h-14 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-brand"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </div>
    </div>
  );
}

// Score ring
function ScoreRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="rgba(99,179,237,0.1)"
            strokeWidth="3"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="rgba(99,179,237,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-text">{label}</span>
    </div>
  );
}

export function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 relative overflow-hidden"
    >
      {/* ── BACKGROUND: Diagonal scan lines + noise texture ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(99,179,237,1) 0px,
              rgba(99,179,237,1) 1px,
              transparent 1px,
              transparent 28px
            )`,
          }}
        />
        {/* Horizontal scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-brand/20 to-transparent"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #080A0F 100%)",
          }}
        />
      </motion.div>

      {/* ── BACKGROUND: Ambient glows ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 65%)",
            top: "40%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(99,179,237,0.05) 0%, transparent 70%)",
            top: "20%",
            left: "15%",
          }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 250,
            height: 250,
            background:
              "radial-gradient(circle, rgba(99,179,237,0.04) 0%, transparent 70%)",
            top: "60%",
            right: "10%",
          }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── FLOATING UI ELEMENTS ── */}

      {/* Left: Live transcript card */}
      <FloatingCard
        className="left-[4%] top-[22%] hidden xl:block"
        delay={1.0}
        x={[0, -8, 0]}
        y={[0, 12, 0]}
      >
        <div className="w-55 bg-[#0D1117]/90 border border-white/8 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4B5563]">
              Live Transcript
            </span>
          </div>
          <VoiceWaveform />
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-3 italic">
            "My experience with distributed systems includes leading a migration
            from monolith to..."
          </p>
        </div>
      </FloatingCard>

      {/* Right: AI feedback card */}
      <FloatingCard
        className="right-[4%] top-[18%] hidden xl:block"
        delay={1.3}
        x={[0, 10, 0]}
        y={[0, -10, 0]}
      >
        <div className="w-50 bg-[#0D1117]/90 border border-white/8 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4B5563]">
              AI Analysis
            </span>
          </div>
          <div className="flex items-center justify-between">
            <ScoreRing score={87} label="Clarity" />
            <ScoreRing score={92} label="Depth" />
            <ScoreRing score={74} label="Pace" />
          </div>
        </div>
      </FloatingCard>

      {/* Left bottom: question card */}
      <FloatingCard
        className="left-[5%] bottom-[24%] hidden xl:block"
        delay={1.6}
        x={[0, -6, 0]}
        y={[0, -8, 0]}
      >
        <div className="w-57.5 bg-[#0D1117]/90 border border-brand/15 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
              <span className="text-brand text-[9px] font-bold">AI</span>
            </div>
            <span className="text-[10px] font-semibold text-brand">
              Next Question
            </span>
          </div>
          <p className="text-[11px] text-[#C4C8D4] leading-relaxed">
            "Tell me about a time you had to debug a critical production issue
            under pressure."
          </p>
        </div>
      </FloatingCard>

      {/* Right bottom: improvement tag */}
      <FloatingCard
        className="right-[5%] bottom-[26%] hidden xl:block"
        delay={1.9}
        x={[0, 8, 0]}
        y={[0, 10, 0]}
      >
        <div className="bg-[#0D1117]/90 border border-white/8 rounded-xl p-3.5 backdrop-blur-sm">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4B5563] mb-2">
            Suggestion
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              "Use the STAR method",
              "Add specific metrics",
              "Slow down slightly",
            ].map((tip) => (
              <div key={tip} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand/60 shrink-0" />
                <span className="text-[11px] text-[#9CA3AF]">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </FloatingCard>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 bg-brand/10 border-brand/20 text-brand px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
          >
            <PulseDot />
            AI Interview Practice Platform
          </Badge>
        </motion.div>

        {/* Mic visual */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <MicRipple />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display font-extrabold text-white leading-none tracking-[-3px] max-w-205"
          style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Practice interviews.
          <br />
          <span className="text-brand">Land the role.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[18px] font-light text-muted-text max-w-120 leading-[1.7] mt-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          AI that listens, adapts, and evaluates — so every session makes you
          sharper than the last.
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex gap-3 mt-10"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-brand text-canvas hover:bg-[#90CDF4] hover:-translate-y-px font-semibold transition-all duration-200"
          >
            Start Practicing Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/3 text-[#E8EAF0] border-white/[0.07] hover:bg-white/6"
          >
            See How It Works
          </Button>
        </motion.div>

        {/* Live waveform strip */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <VoiceWaveform />
          <p className="text-[11px] text-[#374151] tracking-widest uppercase">
            Session in progress
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
