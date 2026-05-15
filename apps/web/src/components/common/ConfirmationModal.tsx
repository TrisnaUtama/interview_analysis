import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { useConfirmStore } from "@/stores/confirm.store";

const VARIANT = {
  danger: {
    icon: ExclamationTriangleIcon,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    btn: "bg-red-500 hover:bg-red-400 text-white",
  },
  default: {
    icon: QuestionMarkCircleIcon,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    btn: "bg-gradient-to-r from-orange-500 to-purple-600 text-white",
  },
};

export function ConfirmModal() {
  const { open, options, isLoading, cancel, setLoading } = useConfirmStore();

  if (!options) return null;

  const config =
    options.variant === "danger" ? VARIANT.danger : VARIANT.default;
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await options.onConfirm();
      cancel();
    } catch {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && cancel()}
          />

          {/* modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
            >
              {/* top glow */}
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

              <div className="p-6">
                {/* header */}
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {options.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-1">
                      {options.description}
                    </p>
                  </div>

                  <button
                    onClick={cancel}
                    className="text-white/30 hover:text-white"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* actions */}
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={cancel}
                    className="bg-white/5 border-white/10 text-white/60 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={config.btn}
                  >
                    {isLoading
                      ? "Loading..."
                      : (options.confirmLabel ?? "Confirm")}
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
