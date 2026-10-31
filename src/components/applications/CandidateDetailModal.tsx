"use client";

import React, { useState } from "react";
import {
  X,
  User,
  GraduationCap,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/lib/types";
import { ApplicationStatusBadge } from "../ui/ApplicationStatusBadge";
import { formatDate } from "@/lib/utils";

interface CandidateDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string | null
  ) => void;
  canEditStatus?: boolean;
}

export function CandidateDetailModal({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  canEditStatus = false,
}: CandidateDetailModalProps) {
  const [status, setStatus] = useState<ApplicationStatus>(
    application?.status || "Applied"
  );
  const [interviewDate, setInterviewDate] = useState(
    application?.interviewDate ? application.interviewDate.slice(0, 16) : ""
  );
  const [notes, setNotes] = useState(application?.notes || "");

  // Update local state when application prop changes
  React.useEffect(() => {
    if (application) {
      setStatus(application.status);
      setInterviewDate(
        application.interviewDate ? application.interviewDate.slice(0, 16) : ""
      );
      setNotes(application.notes || "");
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSave = () => {
    if (onUpdateStatus) {
      onUpdateStatus(
        application.id,
        status,
        notes,
        interviewDate ? new Date(interviewDate).toISOString() : null
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
              {application.studentName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {application.studentName}
              </h2>
              <p className="text-xs text-slate-500">{application.studentEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Applied Role & Current Status */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Applied Position
              </span>
              <span className="text-sm font-bold text-slate-900">
                {application.jobTitle}
              </span>
              <span className="text-xs text-slate-500 block">
                {application.companyName}
              </span>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {/* Academic Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                CGPA
              </span>
              <p className="text-base font-extrabold text-indigo-600 mt-0.5">
                {application.studentCgpa?.toFixed(2) || "N/A"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Grad Year
              </span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">
                {application.studentGradYear}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Degree / Branch
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                {application.studentDegree} - {application.studentBranch}
              </p>
            </div>
          </div>

          {/* College */}
          <div>
            <span className="text-xs font-semibold text-slate-500">Institution:</span>
            <p className="text-xs font-medium text-slate-800 mt-0.5">
              {application.studentCollege}
            </p>
          </div>

          {/* Skills */}
          {application.studentSkills && application.studentSkills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {application.studentSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resume link */}
          <div>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
            >
              <FileText className="w-4 h-4" /> View Resume PDF{" "}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Status Update Form (if Recruiter / Admin) */}
          {canEditStatus && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Update Application Status
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recruitment Stage
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ApplicationStatus)
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected / Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Interview Schedule (if applicable)
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recruiter Feedback / Evaluation Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes from initial screening, coding round scores, or interview link..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          {canEditStatus && (
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
            >
              Save Evaluation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
