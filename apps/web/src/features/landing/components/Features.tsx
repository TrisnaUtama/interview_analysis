import { motion } from "framer-motion";
import { FadeUp } from "./ui/FadeUp";
import { FEATURES } from "../constants";
import {
  Mic,
  BarChart3,
  Brain,
  Target,
  Layers,
  TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Small Accent Icon Renderer
───────────────────────────────────────────── */
function FeatureIcon({ index }: { index: number }) {
  const icons = [Mic, BarChart3, Brain, Target, Layers, TrendingUp];
  const Icon = icons[index] ?? Brain;

  return (
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
      <Icon className="w-4.5 h-4.5 text-[#C084FC]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Soft underline accent
───────────────────────────────────────────── */
function AccentLine() {
  return (
    <div className="w-10 h-px bg-linear-to-r from-brand via-[#C084FC] to-transparent opacity-60" />
  );
}

/* ─────────────────────────────────────────────
   Subtle hover glow (not AI-ish)
───────────────────────────────────────────── */
function HoverGlow() {
  return (
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 20% 10%, rgba(249,115,22,0.10), transparent 55%), radial-gradient(circle at 80% 30%, rgba(192,132,252,0.08), transparent 60%)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   FEATURES SECTION (REDESIGN)
───────────────────────────────────────────── */
export function Features() {
  return (
    <section
      id="features"
      className="relative border-t border-white/5 bg-[#0B0C10]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-28">
        {/* Header */}
        <FadeUp>
          <p className="text-[11px] tracking-[0.2em] uppercase text-brand">
            Features
          </p>
        </FadeUp>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-5 mb-16">
          <FadeUp delay={0.05}>
            <h2 className="font-display text-white text-[42px] lg:text-[56px] leading-[1.05] tracking-[-1px] max-w-xl">
              Practice like it’s real.
              <br />
              <span className="text-[#C084FC]">Perform like it matters.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-[14px] text-white/50 max-w-md leading-relaxed">
              A structured interview experience designed to feel natural — not
              automated, not robotic, not artificial.
            </p>
          </FadeUp>
        </div>

        {/* GRID (more editorial, less “dashboard”) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="relative group rounded-2xl border border-white/10 bg-white/2 p-7 overflow-hidden"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <HoverGlow />

              {/* Top row */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] text-white/30 font-mono">
                  0{i + 1}
                </span>
                <FeatureIcon index={i} />
              </div>

              {/* Title */}
              <h3 className="font-display text-[18px] text-white font-semibold tracking-[-0.3px]">
                {f.title}
              </h3>

              <AccentLine />

              {/* Description */}
              <p className="mt-4 text-[13px] text-white/50 leading-[1.7]">
                {f.desc}
              </p>

              {/* Bottom subtle tag */}
              <div className="mt-6 flex items-center gap-2 text-[11px] text-white/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                Interview-focused design
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
