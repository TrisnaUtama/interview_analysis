import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ─── Subtle floating glow blobs ─── */
function Glow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-150 h-150 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.18), transparent 60%)",
          top: "10%",
          left: "15%",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-100 h-100 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,0.15), transparent 60%)",
          bottom: "5%",
          right: "10%",
        }}
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-[#0B0B10] text-white"
    >
      {/* background */}
      <Glow />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* FLOAT TAGS (minimal, not AI-looking) */}
      {/* <FloatingTag
        text="Real interview simulation"
        className="top-24 left-10 border-orange-500/20 text-orange-300"
      />

      <FloatingTag
        text="Voice-based practice"
        className="bottom-28 left-14 border-purple-500/20 text-purple-300"
      />

      <FloatingTag
        text="Instant feedback"
        className="top-28 right-14 border-orange-500/20 text-orange-300"
      /> */}

      {/* MAIN CONTENT */}
      <motion.div style={{ y }} className="relative z-10 max-w-3xl text-center">
        {/* pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[12px] text-white/70 mb-8">
          Interview practice platform
        </div>

        {/* headline */}
        <h1 className="text-[clamp(42px,6vw,80px)] font-semibold leading-[1.05] tracking-tight">
          Practice like it’s real.{" "}
          <span className="text-orange-400">Perform like it is.</span>
        </h1>

        {/* subtitle */}
        <p className="mt-6 text-[15px] text-white/60 leading-relaxed max-w-xl mx-auto">
          Simulated interviews with real-time feedback on clarity, structure,
          and confidence — text-[17px] font-extrabold tracking-tight text-white
          cursor-pointerso you improve without even noticing.
        </p>

        {/* actions */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <Button className="bg-orange-500 hover:bg-orange-400 text-white font-medium px-6 cursor-pointer">
            Start free practice
          </Button>

          <Button
            variant="outline"
            className="border-white/15 text-black hover:bg-white/5 hover:text-white cursor-pointer"
          >
            See demo
          </Button>
        </div>

        {/* small trust line */}
        {/* <p className="mt-6 text-[12px] text-white/40">
          No credit card required • Setup in 30 seconds
        </p> */}
      </motion.div>
    </section>
  );
}
