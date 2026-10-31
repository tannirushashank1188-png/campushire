"use client";

import React from "react";
import { Download } from "lucide-react";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { StatCard } from "@/components/ui/StatCard";
import { FileText, CheckCircle2, Calendar, Clock } from "lucide-react";

export default function AdminApplicationsPage() {
  const { applications, exportApplicationsCSV, updateApplicationStatus } = useData();

  const total = applications.length;
  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted"
  ).length;
  const interviews = applications.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;
  const selected = applications.filter((a) => a.status === "Selected").length;

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Institution-Wide Applications"
        subtitle="Consolidated application audit and recruitment progress tracking"
        actions={
          <button
            onClick={exportApplicationsCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={total}
            icon={FileText}
            subtext="Submitted across all campus drives"
            accentColor="indigo"
          />
          <StatCard
            title="Shortlisted"
            value={shortlisted}
            icon={Clock}
            subtext="Candidates moved forward"
            accentColor="amber"
          />
          <StatCard
            title="Active Interviews"
            value={interviews}
            icon={Calendar}
            subtext="Interview slots booked"
            accentColor="purple"
          />
          <StatCard
            title="Offers Extended"
            value={selected}
            icon={CheckCircle2}
            subtext="Final selections confirmed"
            accentColor="emerald"
          />
        </div>

        {/* Applications Table with CSV export & status controls */}
        <ApplicationTable
          applications={applications}
          canEditStatus={true}
          onUpdateStatus={(appId, status, notes, interviewDate) =>
            updateApplicationStatus(appId, status, notes, interviewDate)
          }
          showJobColumn={true}
          onExportCSV={exportApplicationsCSV}
        />
      </main>
    </DashboardLayout>
  );
}
