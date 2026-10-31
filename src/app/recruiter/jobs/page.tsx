"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  Edit3,
  Power,
  Users,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { JobPostingForm } from "@/components/jobs/JobPostingForm";
import { Job } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function RecruiterJobsPage() {
  const { user } = useAuth();
  const { jobs, applications, toggleJobStatus } = useData();
  const { success } = useToast();

  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Recruiter's own jobs
  const myJobs = jobs.filter(
    (j) => j.recruiterId === user?.id || j.companyName === user?.companyName
  );

  const handleToggle = (jobId: string, currentStatus: string) => {
    toggleJobStatus(jobId);
    success(
      "Posting Status Updated",
      `Job is now ${currentStatus === "active" ? "Closed" : "Active & Accepting Applications"}.`
    );
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Manage Job Postings"
        subtitle={`Active campus drives for ${user?.companyName || "Nexus Cloud Systems"}`}
        actions={
          <Link
            href="/recruiter/jobs/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Opening</span>
          </Link>
        }
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* If editing a job, render inline edit form modal */}
        {editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Job Posting: {editingJob.title}
                </h2>
                <button
                  onClick={() => setEditingJob(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
              <JobPostingForm
                initialJob={editingJob}
                isEditing={true}
                onSuccess={() => setEditingJob(null)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {myJobs.map((job) => {
            const applicantsCount = applications.filter(
              (a) => a.jobId === job.id
            ).length;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {job.title}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        job.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {job.status === "active" ? "Active" : "Closed"}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {job.jobType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {job.salaryDisplay}
                    </span>
                    <span>Min CGPA: {job.minCgpa.toFixed(1)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Deadline: {formatDate(job.deadline)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Actions & Applicants count */}
                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    href={`/recruiter/applications`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{applicantsCount} Applicants</span>
                  </Link>

                  <button
                    onClick={() => setEditingJob(job)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors"
                    title="Edit opening"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggle(job.id, job.status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                      job.status === "active"
                        ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{job.status === "active" ? "Close Job" : "Reopen Job"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </DashboardLayout>
  );
}

