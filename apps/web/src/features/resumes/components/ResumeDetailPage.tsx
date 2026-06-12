import { useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeftIcon,
  TrashIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LanguageIcon,
  SparklesIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import {
  useGetOneResume,
  useDeleteResume,
} from "../hooks/useResume";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { motion } from "framer-motion";

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative p-6 md:p-7">
        <div className="flex items-center gap-2 mb-6">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-brand/10 border border-brand/15 flex items-center justify-center text-brand">
              {icon}
            </div>
          )}

          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#71717A]">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-white/[0.05] last:border-0">
      <span className="w-28 shrink-0 text-[11px] uppercase tracking-wide text-[#71717A]">
        {label}
      </span>

      <span className="text-sm text-[#E4E4E7] flex-1 break-words">
        {value || "—"}
      </span>
    </div>
  );
}

const statusConfig = {
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
  },
  processing: {
    label: "Processing",
    className: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
  },
};

export default function ResumeDetailPage() {
  const { id } = useParams({ from: "/dashboard/resumes/$id" });
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: resume, isLoading, isError } = useGetOneResume(id);
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  function handleDelete() {
    deleteResume(id, {
      onSuccess: () => navigate({ to: "/dashboard/resumes" }),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden px-4 py-8 md:px-8">
        {/* background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(249,115,22,1) 0px, rgba(249,115,22,1) 1px, transparent 1px, transparent 26px)",
            }}
          />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand/10 blur-[160px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-10 w-40 rounded-2xl bg-white/[0.05]" />

          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-7 space-y-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05]" />

              <div className="flex-1 space-y-3">
                <div className="h-6 w-52 rounded-xl bg-white/[0.05]" />
                <div className="h-4 w-72 rounded-xl bg-white/[0.05]" />
                <div className="h-4 w-44 rounded-xl bg-white/[0.05]" />
              </div>
            </div>

            <div className="h-24 rounded-2xl bg-white/[0.05]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
            <div className="h-64 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !resume) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5">
            <DocumentTextIcon className="w-8 h-8 text-rose-300" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Resume not found
          </h1>

          <p className="text-sm text-[#A1A1AA] mb-6">
            The resume you're looking for doesn't exist.
          </p>

          <button
            onClick={() => navigate({ to: "/dashboard/resumes" })}
            className="h-11 px-5 rounded-2xl bg-brand text-canvas text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to resumes
          </button>
        </div>
      </div>
    );
  }

  const p = resume.parsedData;

  const status =
    statusConfig[resume.analysis_status as keyof typeof statusConfig] ??
    statusConfig.pending;

  return (
    <>
      <div className="min-h-screen relative overflow-hidden px-4 py-8 md:px-8">
        {/* background */}
        {/* <div className="absolute inset-0 pointer-events-none"> */}
        {/* grid */}
        {/* <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(249,115,22,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(249,115,22,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(circle at center, black 35%, transparent 100%)",
            }}
          /> */}

        {/* glow */}
        {/* <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-brand/10 blur-[180px]" />
        </div> */}

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* top actions */}
          <div className="flex items-center justify-between gap-4 mb-7">
            <button
              onClick={() => navigate({ to: "/dashboard/resumes" })}
              className="group inline-flex items-center gap-2 h-11 px-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-sm text-[#A1A1AA] hover:text-white hover:border-brand/20 hover:bg-brand/5 transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>

            <button
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-2xl border border-rose-500/15 bg-rose-500/10 text-sm text-rose-300 hover:bg-rose-500/15 transition-all"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>

          <div className="space-y-6">
            {/* hero */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_35%)] pointer-events-none" />

              <div className="relative p-7 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* avatar */}
                  <div className="w-18 h-18 rounded-3xl bg-brand/10 border border-brand/15 flex items-center justify-center shrink-0 text-2xl font-bold text-brand">
                    {p?.full_name?.charAt(0) ?? "?"}
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="min-w-0">
                        <h1 className="text-3xl font-bold tracking-tight text-white truncate">
                          {p?.full_name ?? "Unnamed Resume"}
                        </h1>

                        <div className="flex flex-wrap gap-4 mt-3">
                          {p?.email && (
                            <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                              <EnvelopeIcon className="w-4 h-4 text-brand" />
                              {p.email}
                            </div>
                          )}

                          {p?.phone && (
                            <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                              <PhoneIcon className="w-4 h-4 text-brand" />
                              {p.phone}
                            </div>
                          )}

                          {p?.location && (
                            <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                              <MapPinIcon className="w-4 h-4 text-brand" />
                              {p.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className={`h-fit text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-7">
                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ClockIcon className="w-4 h-4 text-brand" />
                          <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                            Uploaded
                          </span>
                        </div>

                        <p className="text-sm text-white">
                          {formatDistanceToNow(new Date(resume.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BriefcaseIcon className="w-4 h-4 text-brand" />
                          <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                            Experience
                          </span>
                        </div>

                        <p className="text-sm text-white">
                          {p?.total_years_experience ?? 0} years
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <SparklesIcon className="w-4 h-4 text-brand" />
                          <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                            Skills
                          </span>
                        </div>

                        <p className="text-sm text-white">
                          {p?.skills?.length ?? 0} skills
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <LanguageIcon className="w-4 h-4 text-brand" />
                          <span className="text-[11px] uppercase tracking-wide text-[#71717A]">
                            Languages
                          </span>
                        </div>

                        <p className="text-sm text-white">
                          {p?.languages?.length ?? 0} languages
                        </p>
                      </div>
                    </div>

                    {/* summary */}
                    {p?.summary && (
                      <div className="mt-7 pt-6 border-t border-white/[0.06]">
                        <p className="text-sm leading-7 text-[#CFCFD3]">
                          {p.summary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* skills */}
            {p?.skills && p.skills.length > 0 && (
              <Section
                title="Skills"
                icon={<SparklesIcon className="w-4 h-4" />}
              >
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-2xl border border-white/[0.06] bg-white/[0.04] text-sm text-[#D4D4D8] hover:border-brand/20 hover:bg-brand/5 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* education + languages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {p?.education && p.education.length > 0 && (
                <Section
                  title="Education"
                  icon={<AcademicCapIcon className="w-4 h-4" />}
                >
                  <div className="space-y-4">
                    {p.education.map((edu, i) => (
                      <div
                        key={i}
                        className="relative pl-5 border-l border-brand/20"
                      >
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand" />

                        <h3 className="text-sm font-semibold text-white">
                          {edu.degree}
                        </h3>

                        <p className="text-sm text-[#A1A1AA] mt-1">
                          {edu.institution}
                        </p>

                        <p className="text-xs text-[#71717A] mt-2">
                          {edu.start_date} — {edu.end_date}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {p?.languages && p.languages.length > 0 && (
                <Section
                  title="Languages"
                  icon={<LanguageIcon className="w-4 h-4" />}
                >
                  <div>
                    {p.languages.map((lang, i) => (
                      <InfoRow
                        key={i}
                        label={lang.language}
                        value={lang.proficiency}
                      />
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* experience */}
            {p?.experience && p.experience.length > 0 && (
              <Section
                title="Experience"
                icon={<BriefcaseIcon className="w-4 h-4" />}
              >
                <div className="space-y-7">
                  {p.experience.map((exp, i) => (
                    <div
                      key={i}
                      className="relative pl-6 border-l border-white/[0.08]"
                    >
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-brand ring-4 ring-canvas" />

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {exp.position}
                          </h3>

                          <p className="text-sm text-[#A1A1AA] mt-1">
                            {exp.company}
                          </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                          {exp.is_current && (
                            <span className="text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand font-semibold">
                              Current
                            </span>
                          )}

                          <span className="text-xs text-[#71717A]">
                            {exp.start_date} — {exp.end_date || "Present"}
                          </span>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="mt-4 text-sm leading-7 text-[#CFCFD3] whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* file info */}
            <Section
              title="Resume Insights"
              icon={<DocumentTextIcon className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* uploaded */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ClockIcon className="w-4 h-4 text-brand" />

                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#71717A] font-semibold">
                      Uploaded
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-white">
                    {format(new Date(resume.created_at), "dd MMM yyyy")}
                  </p>

                  <p className="text-sm text-text-tertiary mt-1">
                    {format(new Date(resume.created_at), "HH:mm")} •{" "}
                    {formatDistanceToNow(new Date(resume.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* updated */}
                <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-brand" />

                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#71717A] font-semibold">
                      Last Updated
                    </span>
                  </div>

                  <p className="text-lg font-semibold text-white">
                    {format(new Date(resume.updated_at), "dd MMM yyyy")}
                  </p>

                  <p className="text-sm text-text-tertiary mt-1">
                    {format(new Date(resume.updated_at), "HH:mm")} •{" "}
                    {formatDistanceToNow(new Date(resume.updated_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* parsed sections */}
                <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <DocumentTextIcon className="w-4 h-4 text-brand" />

                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#71717A] font-semibold">
                      Resume Content
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary">Experiences</span>

                      <span className="text-white font-medium">
                        {p?.experience?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary">Education</span>

                      <span className="text-white font-medium">
                        {p?.education?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary">Skills</span>

                      <span className="text-white font-medium">
                        {p?.skills?.length ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-tertiary">Languages</span>

                      <span className="text-white font-medium">
                        {p?.languages?.length ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* status */}
                <div className="rounded-2xl border border-white/6 bg-white/3 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <SparklesIcon className="w-4 h-4 text-brand" />

                    <span className="text-[11px] uppercase tracking-[0.18em] text-[#71717A] font-semibold">
                      Analysis Status
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>

                    <span className="text-sm text-text-tertiary">
                      AI parsed successfully
                    </span>
                  </div>

                  <div className="mt-5 h-2 rounded-full bg-white/4 overflow-hidden">
                    <div
                      className={`
            h-full rounded-full
            ${
              resume.analysis_status === "completed"
                ? "w-full bg-emerald-400"
                : resume.analysis_status === "processing"
                  ? "w-2/3 bg-sky-400"
                  : resume.analysis_status === "failed"
                    ? "w-1/3 bg-rose-400"
                    : "w-1/2 bg-amber-400"
            }
          `}
                    />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        open={showDelete}
        name={p?.full_name ?? "this resume"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
