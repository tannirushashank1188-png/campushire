"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { RecruiterTrendsChart } from "@/components/recruiter/RecruiterTrendsChart";
import { ApplicationStatusBadge } from "@/components/ui/ApplicationStatusBadge";
import { formatDate } from "@/lib/utils";

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const { jobs, applications } = useData();

  // Recruiter's jobs and applications
  const recruiterJobs = jobs.filter(
    (j) => j.recruiterId === user?.id || j.companyName === user?.companyName
  );
  const recruiterJobIds = new Set(recruiterJobs.map((j) => j.id));

  const recruiterApps = applications.filter((a) =>
    recruiterJobIds.has(a.jobId) || a.companyName === user?.companyName
  );

  const totalPosted = recruiterJobs.length;
  const totalApps = recruiterApps.length;
  const shortlisted = recruiterApps.filter(
    (a) => a.status === "Shortlisted" || a.status === "Selected"
  ).length;
  const interviews = recruiterApps.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Recruiter Workspace"
        subtitle={`${user?.companyName || "Nexus Cloud Systems"} • Talent Acquisition Lead`}
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
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Job Postings"
            value={totalPosted}
            icon={Briefcase}
            subtext="Published campus drives"
            accentColor="indigo"
          />
          <StatCard
            title="Applications Received"
            value={totalApps}
            icon={Users}
            subtext="Candidates submitted"
            accentColor="blue"
          />
          <StatCard
            title="Candidates Shortlisted"
            value={shortlisted}
            icon={CheckCircle2}
            subtext="Ready for technical rounds"
            accentColor="emerald"
          />
          <StatCard
            title="Interviews Scheduled"
            value={interviews}
            icon={Calendar}
            subtext="Live interviews this week"
            accentColor="purple"
          />
        </div>

        {/* Charts & Trends */}
        <RecruiterTrendsChart />

        {/* Two Columns: Recent Applicants & Active Postings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Candidates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Candidate Submissions
                </h3>
                <p className="text-xs text-slate-500">
                  Latest students applying to your openings
                </p>
              </div>
              <Link
                href="/recruiter/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All ({recruiterApps.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {recruiterApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No applicants received yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recruiterApps.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {app.studentName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {app.jobTitle} • CGPA {app.studentCgpa?.toFixed(2)}
                        </p>
                      </div>
                      <ApplicationStatusBadge status={app.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Job Openings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Your Published Jobs
                </h3>
                <p className="text-xs text-slate-500">
                  Campus vacancies currently taking applications
                </p>
              </div>
              <Link
                href="/recruiter/jobs"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Manage Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {recruiterJobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No jobs posted yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recruiterJobs.slice(0, 4).map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {job.title}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              job.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {job.salaryDisplay} • Deadline: {formatDate(job.deadline)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        {job.openings} openings
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

