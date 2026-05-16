import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

type StepState = "pending" | "active" | "done";

export default function CallbackPage() {
  const navigate = useNavigate();
  const { data: user, isError } = useMe();

  const isMounted = useRef(true);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const progress = Math.min((completedSteps.length / STEPS.length) * 100, 100);

  /**
   * STEP ENGINE (single controlled loop)
   * - no overlapping timers
   * - no race condition
   */
  useEffect(() => {
    if (!started) return;
    if (currentStep >= STEPS.length) return;

    const step = STEPS[currentStep];

    const timer = setTimeout(() => {
      if (!isMounted.current) return;

      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, step.duration);

    return () => clearTimeout(timer);
  }, [currentStep, started]);

  /**
   * AUTH SUCCESS → START ANIMATION
   */
  useEffect(() => {
    if (user?.id && !started) {
      setStarted(true);
    }
  }, [user, started]);

  /**
   * NAVIGATE AFTER FINISH
   */
  useEffect(() => {
    if (!started) return;
    if (completedSteps.length !== STEPS.length) return;

    const timer = setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 500);

    return () => clearTimeout(timer);
  }, [completedSteps.length, started, navigate]);

  /**
   * ERROR HANDLING
   */
  useEffect(() => {
    if (isError) {
      navigate({ to: "/login" });
    }
  }, [isError, navigate]);

  /**
   * MOUNT SAFETY
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  function getStepState(index: number): StepState {
    if (completedSteps.includes(index)) return "done";
    if (index === currentStep) return "active";
    return "pending";
  }

  function StepItem({ step, state }: { step: string; state: StepState }) {
    return (
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          {state === "done" && (
            <CheckCircleIcon className="w-5 h-5 text-brand" />
          )}

          {state === "active" && (
            <motion.div
              className="w-3 h-3 rounded-full border-2 border-brand/30 border-t-brand"
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}

          {state === "pending" && (
            <div className="w-2 h-2 rounded-full bg-white/10" />
          )}
        </div>

        <span
          className={`text-[13px] transition-all duration-300 ${
            state === "done"
              ? "text-muted-text line-through opacity-60"
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

  return (
    <div className="min-h-screen bg-black/10 flex items-center justify-center relative overflow-hidden">
      {/* background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #63b3ed 0px, #63b3ed 1px, transparent 1px, transparent 24px)",
        }}
      />

      {/* card */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* logo */}
        <div className="flex items-center gap-2 text-white font-bold">
          <PulseDot />
          TalkHire
        </div>

        {/* spinner */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            className="absolute w-full h-full rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* progress */}
        <div className="w-full h-px bg-white/10">
          <motion.div
            className="h-full bg-brand"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* steps */}
        <div className="flex flex-col gap-3 w-full">
          {STEPS.map((step, i) => (
            <StepItem
              key={step.label}
              step={step.label}
              state={getStepState(i)}
            />
          ))}
        </div>

        {/* loading text */}
        <p className="text-xs text-gray-500">Preparing your workspace...</p>
      </motion.div>
    </div>
  );
}
