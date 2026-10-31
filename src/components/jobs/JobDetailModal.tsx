"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Job } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { formatDate, isDeadlinePassed } from "@/lib/utils";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess?: () => void;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onApplySuccess,
}: JobDetailModalProps) {
  const { user, role } = useAuth();
  const { hasApplied, applyToJob } = useData();
  const { success, error, warning } = useToast();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const applied = user ? hasApplied(job.id, user.id) : false;
  const deadlinePassed = isDeadlinePassed(job.deadline);

  const studentCgpa = user?.cgpa ?? 0;
  const isCgpaEligible = studentCgpa >= job.minCgpa;
  const isGradYearEligible =
    !user?.graduationYear ||
    job.eligibleGradYears.length === 0 ||
    job.eligibleGradYears.includes(user.graduationYear);

  const isEligible = isCgpaEligible && isGradYearEligible;

  const handleApply = () => {
    if (role !== "student") {
      warning("Only students can apply for campus recruitments.");
      return;
    }
    if (!user) {
      error("Please sign in as a student to apply.");
      return;
    }
    if (applied) {
      warning("You have already applied for this opening.");
      return;
    }
    if (deadlinePassed) {
      error("The deadline for this position has passed.");
      return;
    }

    setSubmitting(true);
    const res = applyToJob(job, user);
    setSubmitting(false);

    if (res.success) {
      success("Application Successful!", res.message);
      if (onApplySuccess) onApplySuccess();
      onClose();
    } else {
      error("Application Ineligible", res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-md">
              {job.companyInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {job.jobType}
                </span>
                {job.status === "closed" && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    Closed
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {job.title}
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                {job.companyName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Compensation
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {job.salaryDisplay}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Location
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate">
                {job.location}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Cutoff CGPA
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {job.minCgpa.toFixed(1)} & above
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Deadline
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {formatDate(job.deadline)}
              </span>
            </div>
          </div>

          {/* Student Eligibility Banner */}
          {role === "student" && user && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                applied
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : isEligible
                  ? "bg-indigo-50/80 border-indigo-200 text-indigo-900"
                  : "bg-rose-50/80 border-rose-200 text-rose-900"
              }`}
            >
              {applied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : isEligible ? (
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-bold">
                  {applied
                    ? "You have already applied for this opening."
                    : isEligible
                    ? "You are eligible for this position!"
                    : "Eligibility Criteria Notice"}
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  Your profile CGPA: <strong>{user.cgpa?.toFixed(2) || "Not set"}</strong> |
                  Required cutoff: <strong>{job.minCgpa.toFixed(2)}</strong> |
                  Batches: <strong>{job.eligibleGradYears.join(", ")}</strong>
                </p>
              </div>
            </div>
          )}

          {/* About the Job */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Role Overview
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Requirements & Responsibilities */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Key Requirements & Qualifications
              </h4>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Required Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Eligible Branches & Openings */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Eligible Branches:</span>
              <span className="text-slate-600">
                {job.eligibleBranches.join(", ") || "All Disciplines"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Vacancies / Openings:</span>
              <span className="text-slate-600">{job.openings} positions</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Close
          </button>

          {applied ? (
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" /> Application Submitted
            </span>
          ) : role === "student" ? (
            <button
              onClick={handleApply}
              disabled={submitting || deadlinePassed || job.status === "closed"}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                deadlinePassed || job.status === "closed"
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : !isEligible
                  ? "bg-slate-300 text-slate-600 hover:bg-slate-400"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              {submitting
                ? "Submitting..."
                : deadlinePassed
                ? "Deadline Expired"
                : !isEligible
                ? "Ineligible for this Role"
                : "Apply for this Position"}
            </button>
          ) : (
            <span className="text-xs text-slate-500 italic">
              Viewing as {role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

