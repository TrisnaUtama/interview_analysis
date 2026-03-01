import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useMe } from "../hooks/useMe";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const STEPS = [
  { label: "Verifying your identity", duration: 900 },
  { label: "Fetching your profile", duration: 800 },
  { label: "Setting up workspace", duration: 700 },
  { label: "Almost there", duration: 600 },
];

function StepItem({
  step,
  state,
}: {
  step: string;
  state: "pending" | "active" | "done";
}) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: state === "pending" ? 0.3 : 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        {state === "done" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircleIcon className="w-5 h-5 text-brand" />
          </motion.div>
        ) : state === "active" ? (
          <motion.div
            className="w-3 h-3 rounded-full border-2 border-brand/30 border-t-brand"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <div className="w-2 h-2 rounded-full bg-white/8" />
        )}
      </div>
      <span
        className={`text-[13px] transition-colors duration-300 ${
          state === "done"
            ? "text-muted-text line-through decoration-white/20"
            : state === "active"
              ? "text-white font-medium"
              : "text-[#374151]"
        }`}
      >
        {step}
      </span>
    </motion.div>
  );
}

export default function CallbackPage() {
  const navigate = useNavigate();
  const { data: user, isError } = useMe();
  const hasNavigated = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  // Advance steps sequentially
  useEffect(() => {
    if (currentStep >= STEPS.length) return;
    const t = setTimeout(() => {
      setDoneSteps((d) => [...d, currentStep]);
      setCurrentStep((s) => s + 1);
    }, STEPS[currentStep].duration);
    return () => clearTimeout(t);
  }, [currentStep]);

  // Navigate when user is loaded
  useEffect(() => {
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;
      setTimeout(() => navigate({ to: "/dashboard" }), 600);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isError) navigate({ to: "/login" });
  }, [isError, navigate]);

  const progress = (doneSteps.length / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-canvas font-sans flex items-center justify-center overflow-hidden relative">
      {/* Diagonal stripe BG */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, rgba(99,179,237,1) 0px, rgba(99,179,237,1) 1px, transparent 1px, transparent 24px)`,
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-brand/15 to-transparent pointer-events-none"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Radial mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, transparent 30%, #080A0F 100%)",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 65%)",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-9 w-full max-w-85 px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 font-display text-[17px] font-extrabold text-white"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PulseDot />
          InterviewAI
        </motion.div>

        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring - slow */}
          <motion.div
            className="w-22 h-22 rounded-full border border-white/5"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand/30" />
          </motion.div>

          {/* Mid ring - medium */}
          <motion.div
            className="absolute w-15.5 h-15.5 rounded-full border border-brand/18"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-0.75 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand/60" />
          </motion.div>

          {/* Inner ring - fast */}
          <motion.div
            className="absolute w-9.5 h-9.5 rounded-full border border-brand/12"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand/80" />
          </motion.div>

          {/* Center pulse */}
          <motion.div
            className="absolute w-8 h-8 rounded-xl bg-brand/8 border border-brand/18 flex items-center justify-center"
            animate={{
              scale: [1, 1.12, 1],
              boxShadow: [
                "0 0 0px rgba(99,179,237,0)",
                "0 0 16px rgba(99,179,237,0.12)",
                "0 0 0px rgba(99,179,237,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="14"
              height="14"
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
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-px bg-white/6 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-brand/50 to-brand rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 w-full">
          <AnimatePresence>
            {STEPS.map((step, i) => (
              <StepItem
                key={step.label}
                step={step.label}
                state={
                  doneSteps.includes(i)
                    ? "done"
                    : i === currentStep
                      ? "active"
                      : "pending"
                }
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-[12px] text-[#374151] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Setting up your interview workspace
        </motion.p>
      </motion.div>
    </div>
  );
}
