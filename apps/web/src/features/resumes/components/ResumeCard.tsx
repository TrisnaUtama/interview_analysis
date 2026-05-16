// ResumeCard.tsx

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  EyeIcon,
  TrashIcon,
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

import type { Resume } from "../types";
import { getParsedData } from "../types";
import { useDeleteResume } from "../hooks/useResume";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface ResumeCardProps {
  resume: Resume;
}

const statusConfig = {
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },

  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    dot: "bg-amber-400",
  },

  processing: {
    label: "Processing",
    className: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
    dot: "bg-sky-400",
  },

  failed: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    dot: "bg-rose-400",
  },
};

export function ResumeCard({ resume }: ResumeCardProps) {
  const navigate = useNavigate();

  const [showDelete, setShowDelete] = useState(false);

  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  const parsed = getParsedData(resume);

  const status = statusConfig[resume.analysis_status] ?? statusConfig.pending;

  const timeAgo = formatDistanceToNow(new Date(resume.created_at), {
    addSuffix: true,
  });

  function handleDelete() {
    deleteResume(resume.id, {
      onSuccess: () => setShowDelete(false),
    });
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="
          group
          relative
          h-full
          min-h-[360px]
          overflow-hidden
          rounded-[30px]
          border border-white/[0.08]
          bg-white/[0.03]
          backdrop-blur-xl
          flex flex-col
        "
      >
        {/* glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-brand/10 blur-3xl" />
        </div>

        {/* texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "26px 26px",
          }}
        />

        {/* accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent shrink-0" />

        {/* content */}
        <div className="relative flex flex-col flex-1 p-6">
          {/* top */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              {/* avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-xl" />

                <div
                  className="
                    relative
                    w-14 h-14
                    rounded-2xl
                    border border-white/[0.08]
                    bg-white/[0.04]
                    flex items-center justify-center
                    text-brand
                  "
                >
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
              </div>

              {/* info */}
              <div className="min-w-0">
                <h3 className="text-[17px] font-semibold text-white truncate tracking-[-0.3px]">
                  {parsed?.full_name ?? "Unnamed Resume"}
                </h3>

                <p className="text-sm text-[#A1A1AA] truncate mt-1">
                  {parsed?.email ?? "No email provided"}
                </p>
              </div>
            </div>

            {/* status */}
            <div
              className={`
                shrink-0
                inline-flex items-center gap-1.5
                px-2.5 py-1
                rounded-full
                text-[11px]
                font-semibold
                uppercase tracking-wide
                ${status.className}
              `}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />

              {status.label}
            </div>
          </div>

          {/* summary */}
          <div className="mt-6">
            <p className="text-sm leading-7 text-[#B4B4BC] line-clamp-3 min-h-[84px]">
              {parsed?.summary ||
                "AI parsed resume insights, experience history, skills, and professional profile information."}
            </p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 mb-2">
                <BriefcaseIcon className="w-4 h-4 text-brand" />

                <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                  Experience
                </span>
              </div>

              <p className="text-sm font-medium text-white">
                {parsed?.total_years_experience ?? 0} years
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-brand" />

                <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                  Skills
                </span>
              </div>

              <p className="text-sm font-medium text-white">
                {parsed?.skills?.length ?? 0} skills
              </p>
            </div>
          </div>

          {/* skills */}
          <div className="mt-5 min-h-[72px]">
            <div className="flex flex-wrap gap-2">
              {(parsed?.skills ?? []).slice(0, 4).map((skill) => (
                <div
                  key={skill}
                  className="
                    px-3 py-1.5
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.04]
                    text-[12px]
                    text-[#D4D4D8]
                    truncate
                    max-w-[120px]
                  "
                >
                  {skill}
                </div>
              ))}

              {(parsed?.skills?.length ?? 0) > 4 && (
                <div className="px-3 py-1.5 rounded-xl border border-brand/15 bg-brand/10 text-[12px] text-brand">
                  +{parsed!.skills.length - 4}
                </div>
              )}
            </div>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* footer */}
          <div className="pt-5 mt-5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              {/* uploaded */}
              <div className="flex items-center gap-2 text-[#71717A] min-w-0">
                <ClockIcon className="w-4 h-4 shrink-0" />

                <span className="text-xs truncate">Uploaded {timeAgo}</span>
              </div>

              {/* actions */}
              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    navigate({
                      to: "/dashboard/resumes/$id",
                      params: { id: resume.id },
                    })
                  }
                  className="
                    h-10 px-4
                    rounded-2xl
                    border border-white/[0.08]
                    bg-white/[0.04]
                    text-sm font-medium text-white
                    hover:bg-white/[0.07]
                    transition-all
                    flex items-center gap-2
                  "
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDelete(true)}
                  className="
                    h-10 w-10
                    rounded-2xl
                    border border-rose-500/15
                    bg-rose-500/10
                    text-rose-300
                    hover:bg-rose-500/15
                    transition-all
                    flex items-center justify-center
                  "
                >
                  <TrashIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmModal
        open={showDelete}
        name={parsed?.full_name ?? "this resume"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
