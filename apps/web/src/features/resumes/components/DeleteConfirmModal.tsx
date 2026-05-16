import { AnimatePresence, motion } from "framer-motion";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmModalProps {
  open: boolean;
  name: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  open,
  name,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isDeleting && onCancel()}
          />

          {/* Ambient Glow */}
          <div className="fixed inset-0 z-[101] pointer-events-none overflow-hidden">
            <div
              className="
                absolute top-1/2 left-1/2
                w-[420px] h-[420px]
                -translate-x-1/2 -translate-y-1/2
                rounded-full blur-3xl opacity-20
                bg-gradient-to-r from-orange-500 to-purple-600
              "
            />
          </div>

          {/* Modal */}
          <div className="fixed inset-0 z-[102] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative w-full max-w-md overflow-hidden
                rounded-3xl
                border border-white/10
                bg-[#0B0F19]/95
                shadow-[0_20px_80px_rgba(0,0,0,0.55)]
                backdrop-blur-xl
              "
            >
              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent" />

              {/* Grid texture */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Content */}
              <div className="relative p-6 sm:p-7">
                {/* Close button */}
                <button
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="
                    absolute top-5 right-5
                    text-white/30 hover:text-white
                    transition-colors
                    disabled:opacity-30
                  "
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className="
                    w-14 h-14 rounded-2xl
                    border border-red-500/20
                    bg-red-500/10
                    flex items-center justify-center
                    mb-5
                  "
                >
                  <TrashIcon className="w-6 h-6 text-red-400" />
                </motion.div>

                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-red-400/70 font-semibold mb-2">
                    Permanent action
                  </p>

                  <h2 className="text-white text-[24px] font-bold tracking-[-1px] leading-tight">
                    Delete resume?
                  </h2>

                  <p className="mt-3 text-[14px] leading-relaxed text-white/50">
                    <span className="text-white font-medium">{name}</span> will
                    be permanently removed from your workspace and cannot be
                    recovered later.
                  </p>
                </motion.div>

                {/* Warning Box */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="
                    mt-5 rounded-2xl
                    border border-white/6
                    bg-white/[0.03]
                    p-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />

                    <p className="text-[13px] leading-relaxed text-white/55">
                      This action will also remove related analysis data and
                      interview references connected to this resume.
                    </p>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-3 mt-7"
                >
                  <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="
                      flex-1 h-11 rounded-2xl
                      border border-white/10
                      bg-white/[0.03]
                      text-sm font-medium text-white/70
                      hover:bg-white/[0.06]
                      hover:text-white
                      transition-all
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: isDeleting ? 1 : 1.01 }}
                    whileTap={{ scale: isDeleting ? 1 : 0.985 }}
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="
                      flex-1 h-11 rounded-2xl
                      bg-gradient-to-r from-red-500 to-orange-500
                      text-sm font-semibold text-white
                      shadow-lg shadow-red-500/20
                      hover:opacity-95
                      transition-all
                      disabled:opacity-70
                      flex items-center justify-center gap-2
                    "
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-20"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-90"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete Resume"
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
