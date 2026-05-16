import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "../constants";

/* ───────────────────────────────
   Simple Step Badge
─────────────────────────────── */
function StepBadge({ number }: { number: number }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
      <span className="text-[12px] font-semibold text-brand">{number}</span>
    </div>
  );
}

/* ───────────────────────────────
   Step Item
─────────────────────────────── */
function StepItem({ step, index }: { step: (typeof STEPS)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-10 py-10 border-t border-white/5 first:border-t-0"
    >
      {/* Left number */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="flex md:justify-center"
      >
        <StepBadge number={Number(step.number)} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="space-y-3"
      >
        <h3 className=" text-[22px] md:text-[26px] text-white tracking-[-0.5px] leading-tight">
          {step.title}
        </h3>

        <p className="text-[14px] text-white/55 leading-[1.75] max-w-xl">
          {step.desc}
        </p>

        {/* subtle accent line */}
        <div className="w-10 h-px bg-linear-to-r from-brand via-[#C084FC] to-transparent opacity-60" />
      </motion.div>
    </div>
  );
}

/* ───────────────────────────────
   HOW IT WORKS SECTION
─────────────────────────────── */
export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="relative border-t border-white/5 bg-[#0B0C10]"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-28">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-brand">
            How it works
          </p>

          <h2 className="mt-4 text-white text-[40px] md:text-[54px] leading-[1.05] tracking-[-1px]">
            Simple steps.
            <br />
            <span className="text-[#C084FC]">Real improvement.</span>
          </h2>

          <p className="mt-5 text-[14px] text-white/50 max-w-xl leading-relaxed">
            No complexity, no setup friction. Just structured practice that
            adapts as you go.
          </p>
        </motion.div>

        {/* Steps */}
        <div>
          {STEPS.map((step, i) => (
            <StepItem key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
