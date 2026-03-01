import { motion } from "framer-motion";

export function PulseDot() {
  return (
    <span className="relative flex size-2">
      <motion.span
        className="absolute inline-flex size-full rounded-full bg-brand opacity-75"
        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex size-2 rounded-full bg-brand" />
    </span>
  );
}
