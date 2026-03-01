import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { STEPS } from "../constants";

function StepCard({
  step,
  index,
  total,
}: {
  step: (typeof STEPS)[0];
  index: number;
  total: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLast = index === total - 1;

  return (
    <div ref={ref} className="flex gap-8 relative">
      {/* Step indicator column */}
      <div className="flex flex-col items-center shrink-0">
        {/* Number bubble */}
        <motion.div
          className="relative w-12 h-12 rounded-2xl bg-[#0D1117] border border-white/8 flex items-center justify-center shrink-0 z-10"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Glow on active */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ boxShadow: "none" }}
            animate={
              inView ? { boxShadow: "0 0 20px rgba(99,179,237,0.15)" } : {}
            }
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          />
          <span className="font-display font-extrabold text-brand text-[13px] tracking-tight z-10">
            {step.number}
          </span>
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 mt-3 mb-0 bg-white/6 relative overflow-hidden min-h-15">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-linear-to-b from-brand/40 to-transparent"
              initial={{ height: 0 }}
              animate={inView ? { height: "100%" } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.1 + 0.4,
                ease: "easeInOut",
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <motion.div
        className="pb-14 flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className={index % 2 === 1 ? "lg:order-2" : ""}>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand/60 mb-2">
              Step {step.number}
            </p>
            <h3 className="font-display font-bold text-white text-[26px] tracking-[-0.8px] mb-3 leading-tight">
              {step.title}
            </h3>
            <p className="text-[15px] font-light text-muted-text leading-[1.75] max-w-md">
              {step.desc}
            </p>
          </div>

          {/* Visual card */}
          <motion.div
            className={`rounded-2xl overflow-hidden ${index % 2 === 1 ? "lg:order-1" : ""}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0D1117] border border-white/6 rounded-2xl h-44 flex items-center justify-center relative overflow-hidden group">
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(99,179,237,0.04) 0%, transparent 70%)",
                }}
              />
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <step.icon className="w-14 h-14 text-brand/40 group-hover:text-brand/60 transition-colors duration-300" />
              </motion.div>
              {/* Corner accent */}
              <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-brand/30" />
              <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-brand/20" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export function HowItWorks() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  return (
    <section
      id="how-it-works"
      className="border-t border-white/[0.07] relative overflow-hidden"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(99,179,237,1) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-225 mx-auto px-8 lg:px-16 py-28">
        {/* Header */}
        <div ref={titleRef} className="mb-16">
          <motion.p
            className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            How it works
          </motion.p>
          <motion.h2
            className="font-display font-extrabold text-white tracking-[-2px] leading-[1.05]"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            From zero to <span className="text-brand">offer-ready</span>
          </motion.h2>
          <motion.p
            className="text-[15px] font-light text-muted-text leading-relaxed mt-4 max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Four steps is all it takes. Each session adapts to where you are and
            where you need to go.
          </motion.p>
        </div>

        {/* Steps timeline */}
        <div>
          {STEPS.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              total={STEPS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
