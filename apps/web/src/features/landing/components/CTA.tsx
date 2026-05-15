import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ───────────────────────────────
   Simple Status Dot
─────────────────────────────── */
function LiveDot() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-[#F97316] opacity-75 animate-ping" />
        <span className="relative w-2 h-2 rounded-full bg-[#F97316]" />
      </span>
      <span className="text-[11px] text-white/40 tracking-wide">
        Live session preview
      </span>
    </div>
  );
}

/* ───────────────────────────────
   Subtle Preview Card (replace terminal vibe)
─────────────────────────────── */
function PreviewCard() {
  const lines = [
    "Analyzing candidate profile...",
    "Matching job requirements...",
    "Generating interview flow...",
    "Session ready",
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-5">
        <LiveDot />
        <span className="text-[10px] text-white/30 font-mono">AI engine</span>
      </div>

      <div className="space-y-3">
        {lines.map((l, i) => (
          <motion.div
            key={l}
            className="text-[13px] text-white/50 font-light"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.4, duration: 0.5 }}
          >
            {l}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 h-[1px] bg-gradient-to-r from-[#F97316] via-[#C084FC] to-transparent opacity-40" />

      <p className="mt-4 text-[12px] text-white/30 leading-relaxed">
        Personalized interview flow based on your CV and target role.
      </p>
    </div>
  );
}

/* ───────────────────────────────
   CTA SECTION (REDESIGN)
─────────────────────────────── */
export function Cta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="px-6 lg:px-12 pb-28 bg-[#0B0C10]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 lg:p-14 items-center">
          {/* LEFT */}
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#F97316] mb-4">
              Get started
            </p>

            <h2 className="font-display text-white text-[42px] lg:text-[54px] leading-[1.05] tracking-[-1px]">
              Your next interview
              <br />
              starts here.
            </h2>

            <p className="mt-5 text-[14px] text-white/50 leading-relaxed max-w-md">
              Practice real interview scenarios with structured feedback that
              adapts to your experience level and target role.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Button className="bg-[#F97316] text-black hover:bg-[#fb923c] font-semibold">
                Start for free
              </Button>

              <Button
                variant="outline"
                className="border-white/10 text-black hover:bg-white/5 hover:text-white"
              >
                View demo
              </Button>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-5 mt-8 text-[12px] text-white/30">
              <span>✓ No credit card</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PreviewCard />
          </motion.div>
        </div>

        {/* bottom accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#F97316]/40 to-transparent" />
      </motion.div>
    </section>
  );
}
