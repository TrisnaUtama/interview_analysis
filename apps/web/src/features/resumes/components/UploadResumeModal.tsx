import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadResume } from "../hooks/useResume";
import { PulseDot } from "@/features/landing/components/ui/PulseDot";

interface UploadResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UploadResumeModal({ open, onClose }: UploadResumeModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending, isSuccess, reset } = useUploadResume();

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") return;

    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const file = e.dataTransfer.files[0];

      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleUpload = () => {
    if (!selectedFile) return;

    upload(selectedFile, {
      onSuccess: () => {
        setTimeout(() => {
          setSelectedFile(null);
          reset();
          onClose();
        }, 1200);
      },
    });
  };

  const handleClose = () => {
    if (isPending) return;

    setSelectedFile(null);
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-cyan-400/10 rounded-full blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99,179,237,0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,179,237,0.12) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(circle at center, black 20%, transparent 85%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.45)]"
        >
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

          <div className="p-6 sm:p-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PulseDot />
                  <span className="text-[13px] font-semibold tracking-wide text-white/90">
                    InterviewAI
                  </span>
                </div>

                <h3 className="text-[24px] leading-none tracking-[-1px] font-bold text-white">
                  Upload resume
                </h3>

                <p className="text-sm text-muted-text mt-2">
                  Upload your resume in PDF format to start AI analysis.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-text hover:text-white hover:bg-white/[0.06] transition-all flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Dropzone */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.18 }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer
                ${
                  dragOver
                    ? "border-brand/60 bg-brand/10"
                    : selectedFile
                      ? "border-emerald-400/30 bg-emerald-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-brand/30 hover:bg-white/[0.045]"
                }
              `}
            >
              {/* glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.04] via-transparent to-cyan-400/[0.03]" />
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) handleFile(file);
                }}
              />

              <div className="relative px-6 py-10">
                {selectedFile ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full" />

                      <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-emerald-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-white max-w-[240px] truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-emerald-300/80 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="mt-4 text-xs text-muted-text hover:text-white transition-colors"
                    >
                      Choose another file
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-5">
                      <div className="absolute inset-0 bg-brand/30 blur-2xl rounded-full" />

                      <div className="relative w-16 h-16 rounded-2xl border border-brand/20 bg-brand/10 flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-brand"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                    </div>

                    <h4 className="text-white font-semibold text-[15px]">
                      Drag & drop your resume
                    </h4>

                    <p className="text-sm text-muted-text mt-2 max-w-xs leading-relaxed">
                      Drop your PDF here or{" "}
                      <span className="text-brand font-medium">
                        browse files
                      </span>
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-text">
                      <span className="px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
                        PDF only
                      </span>

                      <span className="px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
                        Max 10MB
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 h-11 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-muted-text hover:bg-white/[0.05] hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isPending || isSuccess}
                className={`
                  flex-1 h-11 rounded-xl text-sm font-semibold transition-all
                  flex items-center justify-center gap-2
                  ${
                    isSuccess
                      ? "bg-emerald-500 text-white"
                      : "bg-brand text-canvas hover:bg-[#90CDF4] disabled:opacity-40 disabled:cursor-not-allowed"
                  }
                `}
              >
                {isPending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-canvas/30 border-t-canvas"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Uploading...
                  </>
                ) : isSuccess ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Uploaded
                  </>
                ) : (
                  "Upload resume"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
