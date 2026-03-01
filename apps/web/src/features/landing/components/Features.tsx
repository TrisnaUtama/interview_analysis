import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp } from "./ui/FadeUp";
import { FEATURES } from "../constants";

// Mini waveform for Voice Analysis card
function MiniWave() {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.75 rounded-full bg-brand/50"
          animate={{
            height: [
              `${4 + Math.random() * 16}px`,
              `${4 + Math.random() * 24}px`,
              `${4 + Math.random() * 12}px`,
            ],
          }}
          transition={{
            duration: 0.7 + Math.random() * 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Score bar for Instant Feedback card
function ScoreBar({
  label,
  score,
  delay,
}: {
  label: string;
  score: number;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-text">{label}</span>
        <span className="text-[10px] font-semibold text-brand">{score}%</span>
      </div>
      <div className="h-1 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-brand/60 to-brand rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ai questions card
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-brand/60"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Radar chart for JD Matching
function RadarVisual() {
  const points = [
    { label: "Skills", value: 88 },
    { label: "Exp", value: 72 },
    { label: "Domain", value: 91 },
    { label: "Culture", value: 65 },
  ];
  return (
    <div className="flex items-center gap-3">
      {points.map((p, i) => {
        const ref = useRef(null);
        const inView = useInView(ref, { once: true });
        return (
          <div
            key={p.label}
            ref={ref}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  fill="none"
                  stroke="rgba(99,179,237,0.08)"
                  strokeWidth="2.5"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="15"
                  fill="none"
                  stroke="rgba(99,179,237,0.7)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                  animate={
                    inView
                      ? {
                          strokeDashoffset:
                            2 * Math.PI * 15 * (1 - p.value / 100),
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.2,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">
                  {p.value}
                </span>
              </div>
            </div>
            <span className="text-[9px] text-[#4B5563]">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Progress trend line for Progress Tracking card
function TrendLine() {
  const points = [20, 35, 28, 50, 45, 68, 72, 85];
  const maxH = 40;
  const w = 180;
  const step = w / (points.length - 1);
  const pathD = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${maxH - (p / 100) * maxH}`,
    )
    .join(" ");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative">
      <svg
        width={w}
        height={maxH + 8}
        viewBox={`0 0 ${w} ${maxH + 8}`}
        className="overflow-visible"
      >
        {/* Fill */}
        <motion.path
          d={`${pathD} L ${(points.length - 1) * step} ${maxH + 8} L 0 ${maxH + 8} Z`}
          fill="rgba(99,179,237,0.06)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="rgba(99,179,237,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        {/* Last point dot */}
        <motion.circle
          cx={(points.length - 1) * step}
          cy={maxH - (points[points.length - 1] / 100) * maxH}
          r="3"
          fill="rgba(99,179,237,1)"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
      </svg>
    </div>
  );
}

// role pill tags for Role card
function RolePills() {
  const roles = ["Technical", "HR Screen"];
  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role, i) => (
        <motion.div
          key={role}
          className="px-2.5 py-1 rounded-full bg-white/4 border border-white/[0.07] text-[10px] text-[#9CA3AF]"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          whileHover={{ borderColor: "rgba(99,179,237,0.3)", color: "#63B3ED" }}
        >
          {role}
        </motion.div>
      ))}
    </div>
  );
}

// Map feature index to its mini visual
function FeatureVisual({ index }: { index: number }) {
  if (index === 0)
    return (
      <div className="mb-5 p-3 rounded-xl bg-white/3 border border-white/6 inline-flex flex-col gap-2">
        <p className="text-[10px] text-[#4B5563] font-mono">
          AI generating question...
        </p>
        <TypingIndicator />
      </div>
    );
  if (index === 1)
    return (
      <div className="mb-5">
        <MiniWave />
      </div>
    );
  if (index === 2)
    return (
      <div className="mb-5 flex flex-col gap-2 w-full max-w-45">
        <ScoreBar label="Clarity" score={87} delay={0.2} />
        <ScoreBar label="Depth" score={92} delay={0.35} />
        <ScoreBar label="Pacing" score={74} delay={0.5} />
      </div>
    );
  if (index === 3)
    return (
      <div className="mb-5">
        <RadarVisual />
      </div>
    );
  if (index === 4)
    return (
      <div className="mb-5">
        <RolePills />
      </div>
    );
  if (index === 5)
    return (
      <div className="mb-5">
        <TrendLine />
      </div>
    );
  return null;
}

export function Features() {
  return (
    <section id="features" className="border-t border-white/[0.07]">
      <div className="max-w-300 mx-auto px-8 lg:px-16 py-28">
        <FadeUp>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand mb-4">
            Features
          </p>
        </FadeUp>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <FadeUp delay={0.1}>
            <h2
              className="font-display font-extrabold text-white tracking-[-2px] leading-[1.05] max-w-135"
              style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
            >
              Everything you need <span className="text-brand">to prepare</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-[15px] font-light text-muted-text leading-[1.7] max-w-95">
              Built around the real interview process — not a simulation of one.
            </p>
          </FadeUp>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-canvas p-8 flex flex-col group cursor-default relative overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 0% 0%, rgba(99,179,237,0.04) 0%, transparent 60%)",
                }}
              />

              {/* Top: number + icon */}
              <div className="flex items-start justify-between mb-6">
                <span className="text-[11px] font-semibold text-[#374151] font-mono">
                  0{i + 1}
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-brand" />
                </div>
              </div>

              {/* Mini visual */}
              <FeatureVisual index={i} />

              {/* Separator */}
              <div className="w-8 h-px bg-brand/20 mb-4" />

              {/* Text */}
              <div className="font-display text-[16px] font-bold text-white mb-2 tracking-[-0.3px]">
                {f.title}
              </div>
              <div className="text-[13px] font-light text-muted-text leading-[1.65] flex-1">
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
