// ResumesPage.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useGetAllResumes } from "../hooks/useResume";
import { ResumeCard } from "../components/ResumeCard";
import { UploadResumeModal } from "../components/UploadResumeModal";

import { PulseDot } from "@/features/landing/components/ui/PulseDot";

import type { Resume } from "../types";

function ResumeCardSkeleton() {
  return (
    <div
      className="
        h-full min-h-[235px]
        rounded-[24px]
        border border-white/[0.08]
        bg-white/[0.03]
        backdrop-blur-xl
        p-4
        animate-pulse
        flex flex-col
      "
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.06]" />

          <div className="flex-1">
            <div className="h-3.5 w-2/3 rounded-full bg-white/[0.06]" />
            <div className="h-3 w-1/2 rounded-full bg-white/[0.05] mt-2.5" />
          </div>
        </div>

        <div className="w-14 h-5 rounded-full bg-white/[0.06]" />
      </div>

      {/* content */}
      <div className="mt-5 space-y-2">
        <div className="h-2.5 rounded-full bg-white/[0.04]" />
        <div className="h-2.5 rounded-full bg-white/[0.04] w-[82%]" />
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-14 rounded-2xl bg-white/[0.04]" />
        <div className="h-14 rounded-2xl bg-white/[0.04]" />
      </div>

      {/* skills */}
      <div className="flex gap-2 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-12 rounded-xl bg-white/[0.05]" />
        ))}
      </div>

      <div className="flex-1" />

      {/* footer */}
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="h-2.5 w-20 rounded-full bg-white/[0.05]" />

        <div className="flex gap-2">
          <div className="h-8 w-16 rounded-xl bg-white/[0.06]" />
          <div className="h-8 w-8 rounded-xl bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export default function ResumesPage() {
  const [showUpload, setShowUpload] = useState(false);

  // pagination
  const [page, setPage] = useState(1);

  const limit = 9;

  const { data, isLoading, isError } = useGetAllResumes({
    page,
    limit,
  });

  const resumes: Resume[] = data?.items ?? [];

  const meta = data?.meta;

  const total = meta?.total_items ?? 0;
  const currentPage = meta?.page ?? page;
  const totalPages = meta?.total_pages ?? 1;

  function handlePrev() {
    if (currentPage > 1) {
      setPage((prev) => prev - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      setPage((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-7 md:px-7">
      {/* background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,179,237,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,179,237,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(circle at center, black 25%, transparent 85%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1450px] mx-auto">
        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="
            relative overflow-hidden
            rounded-[28px]
            border border-white/[0.08]
            bg-white/[0.03]
            backdrop-blur-2xl
            p-6 md:p-7
            mb-6
          "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.05] via-transparent to-cyan-400/[0.03]" />

          <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-7">
            {/* left */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <PulseDot />

                <span className="text-[12px] font-semibold tracking-wide text-white/90">
                  Resume Workspace
                </span>
              </div>

              <h1 className="text-[34px] sm:text-[44px] leading-none tracking-[-2px] font-black text-white">
                My Resumes
              </h1>

              <p className="text-sm text-muted-text mt-4 leading-7 max-w-xl">
                Organize resumes, manage AI analysis, and keep professional
                profile data in one workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <div className="h-10 px-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />

                  <span className="text-sm text-white">
                    {isLoading
                      ? "Loading resumes..."
                      : `${total} resume${total !== 1 ? "s" : ""}`}
                  </span>
                </div>

                <div className="h-10 px-4 rounded-2xl border border-brand/20 bg-brand/10 flex items-center gap-2">
                  <span className="text-sm text-brand font-medium">
                    AI Analysis
                  </span>
                </div>
              </div>
            </div>

            {/* button */}
            <button
              onClick={() => setShowUpload(true)}
              className="
                group relative overflow-hidden
                h-12 px-5 rounded-2xl
                bg-brand text-canvas
                font-semibold text-sm
                transition-all
                hover:scale-[1.02]
                hover:bg-[#90CDF4]
                shadow-[0_0_35px_rgba(99,179,237,0.22)]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-1000" />

              <div className="relative flex items-center gap-2">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload Resume
              </div>
            </button>
          </div>
        </motion.div>

        {/* loading */}
        {isLoading && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-4
            "
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ResumeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* error */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-[26px]
              border border-rose-500/10
              bg-rose-500/[0.03]
              backdrop-blur-2xl
              py-16 px-6 text-center
            "
          >
            <h3 className="text-lg font-semibold text-white">
              Failed to load resumes
            </h3>

            <p className="text-sm text-muted-text mt-3">
              Something went wrong while loading your workspace.
            </p>
          </motion.div>
        )}

        {/* empty */}
        {!isLoading && !isError && resumes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              rounded-[26px]
              border border-white/[0.08]
              bg-white/[0.03]
              backdrop-blur-2xl
              px-8 py-20
              text-center
            "
          >
            <h2 className="text-2xl font-bold text-white">
              No resumes uploaded
            </h2>

            <p className="text-sm text-muted-text mt-4 max-w-md mx-auto leading-7">
              Upload your first resume to start using AI-powered analysis.
            </p>

            <button
              onClick={() => setShowUpload(true)}
              className="
                mt-7 h-11 px-5
                rounded-2xl
                bg-brand text-canvas
                text-sm font-semibold
                hover:bg-[#90CDF4]
                transition-all
              "
            >
              Upload Resume
            </button>
          </motion.div>
        )}

        {/* cards */}
        {!isLoading && !isError && resumes.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                2xl:grid-cols-4
                gap-4
                items-stretch
              "
            >
              {resumes.map((resume: Resume, index: number) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.025,
                    duration: 0.22,
                  }}
                  className="h-full"
                >
                  <ResumeCard resume={resume} />
                </motion.div>
              ))}
            </motion.div>

            {/* pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="
                  mt-7
                  rounded-[24px]
                  border border-white/[0.08]
                  bg-white/[0.03]
                  backdrop-blur-xl
                  px-4 py-4
                  flex flex-col sm:flex-row
                  items-center justify-between
                  gap-4
                "
              >
                <div className="text-sm text-muted-text">
                  Page{" "}
                  <span className="text-white font-semibold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="
                      h-10 px-4 rounded-2xl
                      border border-white/[0.08]
                      bg-white/[0.03]
                      text-sm text-white
                      flex items-center gap-2
                      transition-all
                      hover:bg-white/[0.05]
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Prev
                  </button>

                  <div
                    className="
                      h-10 min-w-[48px]
                      px-4 rounded-2xl
                      border border-brand/20
                      bg-brand/10
                      flex items-center justify-center
                      text-sm font-semibold text-brand
                    "
                  >
                    {currentPage}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="
                      h-10 px-4 rounded-2xl
                      border border-white/[0.08]
                      bg-white/[0.03]
                      text-sm text-white
                      flex items-center gap-2
                      transition-all
                      hover:bg-white/[0.05]
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <UploadResumeModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </div>
  );
}
