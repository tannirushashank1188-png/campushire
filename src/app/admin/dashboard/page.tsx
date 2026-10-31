"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { PlacementAnalyticsCharts } from "@/components/admin/PlacementAnalyticsCharts";
import { SAMPLE_COMPANIES } from "@/lib/sampleData";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { jobs, applications, students, exportApplicationsCSV } = useData();

  const totalStudents = students.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const totalApps = applications.length;
  const selectedCount = applications.filter((a) => a.status === "Selected").length;

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Placement Officer Control Center"
        subtitle="Institutional placement analytics, company drives, and candidate selections"
        actions={
          <button
            onClick={exportApplicationsCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Placement Report (CSV)</span>
          </button>
        }
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Registered Students"
            value={totalStudents}
            icon={Users}
            subtext="Enrolled batch profiles"
            accentColor="indigo"
          />
          <StatCard
            title="Partner Recruiters"
            value={SAMPLE_COMPANIES.length}
            icon={Building2}
            subtext="Verified enterprise accounts"
            accentColor="blue"
          />
          <StatCard
            title="Active Campus Drives"
            value={activeJobs}
            icon={Briefcase}
            subtext="Accepting candidate applications"
            accentColor="amber"
          />
          <StatCard
            title="Total Applications"
            value={totalApps}
            icon={FileCheck}
            subtext="Submitted across all branches"
            accentColor="purple"
          />
          <StatCard
            title="Offers Extended"
            value={selectedCount}
            icon={CheckCircle2}
            subtext="Final selections confirmed"
            accentColor="emerald"
          />
        </div>

        {/* Analytics & Placement Charts */}
        <PlacementAnalyticsCharts />

        {/* Two Columns: Top Hiring Companies & Recent Selections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Companies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Participating Hiring Partners
                </h3>
                <p className="text-xs text-slate-500">
                  Verified enterprises with active recruitment slots
                </p>
              </div>
              <Link
                href="/admin/jobs"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Campus Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {SAMPLE_COMPANIES.map((comp) => {
                const compJobs = jobs.filter((j) => j.companyName === comp.name);
                return (
                  <div
                    key={comp.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {comp.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {comp.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {comp.industry} • {comp.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg shrink-0">
                      {compJobs.length} {compJobs.length === 1 ? "opening" : "openings"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Selections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Offers & Selections
                </h3>
                <p className="text-xs text-slate-500">
                  Students confirmed for internships & full-time roles
                </p>
              </div>
              <Link
                href="/admin/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>All Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {applications
                .filter((a) => a.status === "Selected" || a.status === "Interview Scheduled")
                .slice(0, 5)
                .map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {app.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {app.jobTitle} at <strong>{app.companyName}</strong>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === "Selected"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {app.status === "Selected" ? "Offer Extended" : "Interview"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
