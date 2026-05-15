import { motion } from "framer-motion";

export function PulseDot() {
  return (
    <span className="relative flex size-2">
      <motion.span
        className="absolute inset-0 rounded-full bg-brand"
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <span className="relative size-2 rounded-full bg-brand shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
    </span>
  );
}
