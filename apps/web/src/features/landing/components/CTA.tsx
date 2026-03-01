import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeUp } from "./ui/FadeUp";

// Typing animation for the terminal
const TERMINAL_LINES = [
  { delay: 0, text: "> Analyzing resume...", color: "text-[#6B7280]" },
  {
    delay: 0.8,
    text: "✓ 6 years backend engineering detected",
    color: "text-emerald-400",
  },
  { delay: 1.6, text: "> Parsing job description...", color: "text-[#6B7280]" },
  {
    delay: 2.4,
    text: "✓ Senior Software Engineer @Tesla",
    color: "text-emerald-400",
  },
  {
    delay: 3.2,
    text: "> Generating tailored questions...",
    color: "text-[#6B7280]",
  },
  { delay: 4.0, text: "✓ 12 questions prepared", color: "text-brand" },
  { delay: 4.8, text: "> Ready. Starting session now.", color: "text-white" },
];

function TerminalLine({
  line,
  startDelay,
}: {
  line: (typeof TERMINAL_LINES)[0];
  startDelay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setVisible(true);
        let i = 0;
        const interval = setInterval(() => {
          setText(line.text.slice(0, i + 1));
          i++;
          if (i >= line.text.length) clearInterval(interval);
        }, 30);
      },
      (startDelay + line.delay) * 1000,
    );
    return () => clearTimeout(timer);
  }, [line, startDelay]);

  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`font-mono text-[12px] leading-relaxed ${line.color}`}
    >
      {text}
      {text.length < line.text.length && (
        <motion.span
          className="inline-block w-2 h-3.5 bg-brand/70 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function Terminal({ inView }: { inView: boolean }) {
  return (
    <div className="bg-canvas border border-white/8 rounded-2xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[11px] text-[#4B5563] ml-2 font-mono">
          interview-ai — session
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
        </div>
      </div>
      {/* Terminal body */}
      <div className="p-5 min-h-50 flex flex-col gap-2">
        {inView &&
          TERMINAL_LINES.map((line, i) => (
            <TerminalLine key={i} line={line} startDelay={0.3} />
          ))}
      </div>
    </div>
  );
}

export function Cta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-8 lg:px-16 pb-28">
      <FadeUp>
        <motion.div
          ref={ref}
          className="relative rounded-3xl overflow-hidden border border-white/[0.07]"
          style={{
            background:
              "linear-gradient(135deg, #0D1117 0%, #080A0F 60%, #0a0e14 100%)",
          }}
          whileHover={{ borderColor: "rgba(99,179,237,0.12)" }}
          transition={{ duration: 0.4 }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand/40 to-transparent" />

          {/* BG glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 600,
              height: 400,
              background:
                "radial-gradient(ellipse, rgba(99,179,237,0.05) 0%, transparent 70%)",
              top: "50%",
              left: "30%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Diagonal stripe accent */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                rgba(99,179,237,1) 0px,
                rgba(99,179,237,1) 1px,
                transparent 1px,
                transparent 24px
              )`,
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-10 lg:p-14 items-center relative z-10">
            {/* Left: copy */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 text-brand px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                Free to start
              </motion.div>

              <motion.h2
                className="font-display font-extrabold text-white leading-[1.05] tracking-[-2px] mb-5"
                style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ready to practice your way to the top?
              </motion.h2>

              <motion.p
                className="text-[15px] font-light text-muted-text leading-relaxed mb-8"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                No templates. No scripts. Just real AI that adapts to your
                background and the role you want.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                  Schedule a Demo
                </Button>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                className="flex items-center gap-5 mt-8"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                {["No credit card", "Cancel anytime"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-brand/50" />
                      <span className="text-[12px] text-[#4B5563]">{item}</span>
                    </div>
                  ),
                )}
              </motion.div>
            </div>

            {/* Right: terminal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Terminal inView={inView} />
            </motion.div>
          </div>
        </motion.div>
      </FadeUp>
    </section>
  );
}
