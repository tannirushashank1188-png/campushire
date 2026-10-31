"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Job } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, isDeadlinePassed, getDaysRemaining } from "@/lib/utils";
import { JobDetailModal } from "./JobDetailModal";

interface JobCardProps {
  job: Job;
  onApplySuccess?: () => void;
}

export function JobCard({ job, onApplySuccess }: JobCardProps) {
  const { user, role } = useAuth();
  const { hasApplied, applyToJob } = useData();
  const { success, error, warning } = useToast();
  const [detailOpen, setDetailOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const applied = user ? hasApplied(job.id, user.id) : false;
  const deadlinePassed = isDeadlinePassed(job.deadline);
  const daysLeft = getDaysRemaining(job.deadline);

  // Student eligibility checks
  const studentCgpa = user?.cgpa ?? 0;
  const isCgpaEligible = studentCgpa >= job.minCgpa;
  const isGradYearEligible =
    !user?.graduationYear ||
    job.eligibleGradYears.length === 0 ||
    job.eligibleGradYears.includes(user.graduationYear);

  const isEligible = isCgpaEligible && isGradYearEligible;

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role !== "student") {
      warning("Only students can apply for campus recruitments.");
      return;
    }
    if (!user) {
      error("Please log in as a student to apply.");
      return;
    }
    if (applied) {
      warning("You have already applied for this job.");
      return;
    }
    if (deadlinePassed) {
      error("Application deadline has passed.");
      return;
    }
    if (!isEligible) {
      error("Eligibility Criteria Not Met", `Min CGPA: ${job.minCgpa.toFixed(2)}.`);
      return;
    }

    setIsApplying(true);
    const result = applyToJob(job, user);
    setIsApplying(false);

    if (result.success) {
      success("Application Submitted!", result.message);
      if (onApplySuccess) onApplySuccess();
    } else {
      error("Application Failed", result.message);
    }
  };

  const jobTypeBadgeColor = {
    "Full-time": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Internship: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Part-time": "bg-amber-50 text-amber-700 border-amber-200",
  }[job.jobType];

  return (
    <>
      <div
        onClick={() => setDetailOpen(true)}
        className="group relative bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
      >
        <div>
          {/* Top Row: Company Logo & Details */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {job.companyInitials}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors truncate">
                  {job.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 truncate">
                  {job.companyName}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${jobTypeBadgeColor}`}
              >
                {job.jobType}
              </span>
              {job.status === "closed" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  Closed
                </span>
              )}
            </div>
          </div>

          {/* Location & Salary */}
          <div className="mt-4 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>{job.salaryDisplay}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Skills Pills */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {job.requiredSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Eligibility, Deadline, Action */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            {/* Eligibility info */}
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Min CGPA: <strong className="text-slate-700">{job.minCgpa.toFixed(1)}</strong></span>
              <span className="mx-1 text-slate-300">•</span>
              <span>Batches: <strong className="text-slate-700">{job.eligibleGradYears.join(", ")}</strong></span>
            </div>

            {/* Deadline */}
            <div
              className={`flex items-center gap-1 font-medium ${
                deadlinePassed
                  ? "text-rose-600"
                  : daysLeft <= 3
                  ? "text-amber-600 font-semibold"
                  : "text-slate-500"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {deadlinePassed
                ? "Expired"
                : daysLeft === 0
                ? "Ends Today"
                : `${daysLeft}d left`}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              View Details <ArrowRight className="w-3 h-3" />
            </span>

            {applied ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Applied
              </span>
            ) : role === "student" ? (
              <button
                onClick={handleApply}
                disabled={isApplying || deadlinePassed || job.status === "closed"}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                  deadlinePassed || job.status === "closed"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : !isEligible
                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                }`}
              >
                {deadlinePassed
                  ? "Closed"
                  : !isEligible
                  ? "Ineligible"
                  : "Quick Apply"}
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                {job.openings} {job.openings === 1 ? "opening" : "openings"}
              </span>
            )}
          </div>
        </div>
      </div>

      <JobDetailModal
        job={job}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onApplySuccess={onApplySuccess}
      />
    </>
  );
}

