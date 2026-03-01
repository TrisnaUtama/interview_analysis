import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { authApi } from "../api/auth.api";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Left panel visualizations
function WaveformBar({ delay, height }: { delay: number; height: number }) {
  return (
    <motion.div
      className="w-0.75 rounded-full bg-brand/40"
      animate={{
        height: [`${height * 0.4}px`, `${height}px`, `${height * 0.6}px`],
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function LiveTranscript() {
  const words = [
    "Tell",
    "me",
    "about",
    "a",
    "time",
    "you",
    "resolved",
    "a",
    "production",
    "incident...",
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= words.length) return;
    const t = setTimeout(
      () => setShown((s) => s + 1),
      180 + Math.random() * 120,
    );
    return () => clearTimeout(t);
  }, [shown, words.length]);

  useEffect(() => {
    const reset = setTimeout(() => setShown(0), 6000);
    return () => clearTimeout(reset);
  }, [shown]);

  return (
    <div className="flex flex-wrap gap-1 items-center min-h-6">
      {words.slice(0, shown).map((w, i) => (
        <motion.span
          key={`${i}-${shown}`}
          className="text-[13px] text-[#C4C8D4]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {w}
        </motion.span>
      ))}
      {shown < words.length && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-brand/70 rounded-full"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function ScoreCircle({
  score,
  label,
  delay,
}: {
  score: number;
  label: string;
  delay: number;
}) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="rgba(99,179,237,0.08)"
            strokeWidth="3"
          />
          <motion.circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="rgba(99,179,237,0.75)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (score / 100) * circ }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-[13px] font-bold text-white font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] text-[#4B5563] tracking-wide">{label}</span>
    </div>
  );
}

// Animated timeline steps on left
const PREVIEW_STEPS = [
  { label: "Resume analyzed", done: true, delay: 0.2 },
  { label: "Job matched (87%)", done: true, delay: 0.5 },
  { label: "Interview started", done: true, delay: 0.8 },
  { label: "Feedback ready", done: false, delay: 1.1 },
];

function PreviewTimeline() {
  return (
    <div className="flex flex-col gap-3">
      {PREVIEW_STEPS.map((s) => (
        <motion.div
          key={s.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + s.delay }}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              s.done
                ? "bg-brand/15 border-brand/30"
                : "bg-white/3 border-white/10"
            }`}
          >
            {s.done ? (
              <svg
                className="w-2.5 h-2.5 text-brand"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M2 5l2.5 2.5L8 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-brand/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <span
            className={`text-[13px] ${s.done ? "text-[#9CA3AF]" : "text-brand"}`}
          >
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Main component
export default function LoginPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const waveHeights = Array.from({ length: 28 }, () => 8 + Math.random() * 28);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-canvas text-[#E8EAF0] font-sans flex overflow-hidden"
    >
      {/*  LEFT PANEL  */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden border-r border-white/6">
        {/* Diagonal stripe BG */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, rgba(99,179,237,1) 0px, rgba(99,179,237,1) 1px, transparent 1px, transparent 24px)`,
            }}
          />
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-brand/15 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          {/* Radial mask */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 35%, #080A0F 100%)",
            }}
          />
        </motion.div>

        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 65%)",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <a
            href="/"
            className="flex items-center gap-2 font-display text-[17px] font-extrabold tracking-tight text-white no-underline"
          >
            <PulseDot />
            InterviewAI
          </a>
        </div>

        {/* Center: live session preview */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 gap-8">
          {/* Waveform card */}
          <motion.div
            className="w-full max-w-[320px] bg-[#0D1117]/80 border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4B5563]">
                  Live Session
                </span>
              </div>
              <span className="text-[10px] text-[#374151] font-mono">
                02:34
              </span>
            </div>
            {/* Waveform */}
            <div className="flex items-end gap-0.75 h-10 mb-4">
              {waveHeights.map((h, i) => (
                <WaveformBar key={i} delay={i * 0.04} height={h} />
              ))}
            </div>
            {/* Transcript */}
            <LiveTranscript />
          </motion.div>

          {/* Score card */}
          <motion.div
            className="w-full max-w-[320px] bg-[#0D1117]/80 border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4B5563] mb-4">
              AI Analysis
            </p>
            <div className="flex items-center justify-between">
              <ScoreCircle score={87} label="Clarity" delay={0.8} />
              <ScoreCircle score={92} label="Depth" delay={1.0} />
              <ScoreCircle score={74} label="Pace" delay={1.2} />
              <ScoreCircle score={89} label="STAR" delay={1.4} />
            </div>
          </motion.div>
        </div>

        {/* headline + steps */}
        <div className="relative z-10 p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2
              className="font-display font-extrabold text-white leading-[1.05] tracking-[-2px] mb-6"
              style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
            >
              Your next role starts
              <br />
              <span className="text-brand">with one session.</span>
            </h2>
            <PreviewTimeline />
          </motion.div>
        </div>
      </div>

      {/*  RIGHT PANEL  */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 relative">
        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(99,179,237,0.04) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-100"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 font-display text-[16px] font-extrabold text-white mb-10 justify-center">
            <PulseDot />
            InterviewAI
          </div>

          {/* Card */}
          <div className="bg-[#0D1117] border border-white/8 rounded-2xl overflow-hidden">
            {/* Top accent */}
            <div className="h-px bg-linear-to-r from-transparent via-brand/40 to-transparent" />

            <div className="p-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="inline-flex items-center gap-2 bg-brand/8 border border-brand/18 text-brand px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-6">
                  <PulseDot />
                  Welcome back
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22 }}
              >
                <h1 className="font-display font-extrabold text-white text-[26px] tracking-[-1px] leading-tight mb-2">
                  Sign in to continue
                </h1>
                <p className="text-[13px] text-muted-text leading-relaxed">
                  Practice smarter. Land faster. Your AI interview coach is
                  ready.
                </p>
              </motion.div>

              <div className="my-7 h-px bg-white/5" />

              {/* Google Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <GoogleLoginButton />
              </motion.div>

              <div className="my-7 h-px bg-white/5" />

              {/* Terms */}
              <motion.p
                className="text-[11px] text-[#374151] text-center leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-[#4B5563] hover:text-brand transition-colors underline underline-offset-2"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#4B5563] hover:text-brand transition-colors underline underline-offset-2"
                >
                  Privacy Policy
                </a>
              </motion.p>
            </div>
          </div>

          {/* Back to home */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[12px] text-[#374151] hover:text-[#E8EAF0] transition-colors no-underline group"
            >
              <ArrowLeftIcon className="size-3 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleLoginButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={() => authApi.googleSign()}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/9 hover:border-brand/25 text-white rounded-xl px-5 py-3.5 text-[14px] font-medium transition-colors duration-200 cursor-pointer relative overflow-hidden group"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Hover shimmer */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,179,237,0.04), transparent)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Google icon */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
          fill="#34A853"
        />
        <path
          d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          fill="#EA4335"
        />
      </svg>

      <span>Continue with Google</span>

      <motion.svg
        className="w-3.5 h-3.5 ml-auto text-[#374151] group-hover:text-brand transition-colors"
        viewBox="0 0 14 14"
        fill="none"
        animate={{ x: hovered ? 2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path
          d="M2 7h10M8 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.button>
  );
}
