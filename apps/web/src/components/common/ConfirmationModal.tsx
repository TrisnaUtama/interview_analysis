import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useConfirmStore } from "@/stores/confirm.store";

const VARIANT_CONFIG = {
  danger: {
    icon: ExclamationTriangleIcon,
    iconClass: "text-red-400",
    iconBg: "bg-red-400/10 border-red-400/20",
    confirmClass: "bg-red-500/90 hover:bg-red-500 text-white border-none",
  },
  warning: {
    icon: ExclamationCircleIcon,
    iconClass: "text-amber-400",
    iconBg: "bg-amber-400/10 border-amber-400/20",
    confirmClass: "bg-amber-500/90 hover:bg-amber-500 text-white border-none",
  },
  default: {
    icon: QuestionMarkCircleIcon,
    iconClass: "text-brand",
    iconBg: "bg-brand/10 border-brand/20",
    confirmClass: "bg-brand text-canvas hover:bg-[#90CDF4] border-none",
  },
};

export function ConfirmModal() {
  const { open, options, isLoading, cancel, setLoading } = useConfirmStore();

  if (!options) return null;

  const variant = options.variant ?? "default";
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await options.onConfirm();
      useConfirmStore.getState().cancel();
    } catch {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isLoading && cancel()}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-100 bg-[#0D1117] border border-white/8 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {/* Top accent line */}
              <div
                className={`h-px w-full ${
                  variant === "danger"
                    ? "bg-linear-to-r from-transparent via-red-500/50 to-transparent"
                    : variant === "warning"
                      ? "bg-linear-to-r from-transparent via-amber-500/50 to-transparent"
                      : "bg-linear-to-r from-transparent via-brand/50 to-transparent"
                }`}
              />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-2.5 rounded-xl border ${config.iconBg} shrink-0`}
                    >
                      <Icon className={`size-4.5 ${config.iconClass}`} />
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-white text-[16px] tracking-[-0.3px] leading-tight">
                        {options.title}
                      </h3>
                      <p className="text-[13px] text-muted-text leading-relaxed mt-1.5">
                        {options.description}
                      </p>
                    </div>
                  </div>

                  {/* Close */}
                  {!isLoading && (
                    <button
                      onClick={cancel}
                      className="text-[#374151] hover:text-white transition-colors shrink-0 mt-0.5"
                    >
                      <XMarkIcon className="size-3.75" />
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-white/6 mb-5" />

                {/* Actions */}
                <div className="flex gap-2.5 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancel}
                    disabled={isLoading}
                    className="bg-transparent border-white/8 text-[#9CA3AF] hover:text-white hover:bg-white/4 text-[13px] cursor-pointer"
                  >
                    {options.cancelLabel ?? "Cancel"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`text-[13px] cursor-pointer font-medium min-w-22.5 ${config.confirmClass}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white block"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Loading...
                      </span>
                    ) : (
                      (options.confirmLabel ?? "Confirm")
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
