"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { StatCard } from "@/components/ui/StatCard";
import { Users, CheckCircle2, Calendar, FileText } from "lucide-react";
import { ApplicationStatus } from "@/lib/types";

export default function RecruiterApplicationsPage() {
  const { user } = useAuth();
  const { jobs, applications, updateApplicationStatus, exportApplicationsCSV } = useData();
  const { success } = useToast();

  const recruiterJobs = jobs.filter(
    (j) => j.recruiterId === user?.id || j.companyName === user?.companyName
  );
  const recruiterJobIds = new Set(recruiterJobs.map((j) => j.id));

  const recruiterApps = applications.filter(
    (a) => recruiterJobIds.has(a.jobId) || a.companyName === user?.companyName
  );

  const total = recruiterApps.length;
  const shortlisted = recruiterApps.filter(
    (a) => a.status === "Shortlisted"
  ).length;
  const interviews = recruiterApps.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;
  const selected = recruiterApps.filter(
    (a) => a.status === "Selected"
  ).length;

  const handleStatusUpdate = (
    appId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    interviewDate?: string | null
  ) => {
    updateApplicationStatus(appId, newStatus, notes, interviewDate);
    success(
      "Application Updated",
      `Candidate status changed to "${newStatus}".`
    );
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Candidate Applications"
        subtitle={`Reviewing applicants for ${user?.companyName || "Nexus Cloud Systems"}`}
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Candidates"
            value={total}
            icon={Users}
            subtext="Applications received across jobs"
            accentColor="indigo"
          />
          <StatCard
            title="Shortlisted"
            value={shortlisted}
            icon={CheckCircle2}
            subtext="Moved to technical screening"
            accentColor="amber"
          />
          <StatCard
            title="Interviews Scheduled"
            value={interviews}
            icon={Calendar}
            subtext="Scheduled live interview rounds"
            accentColor="purple"
          />
          <StatCard
            title="Selected / Offered"
            value={selected}
            icon={CheckCircle2}
            subtext="Extended full offers"
            accentColor="emerald"
          />
        </div>

        {/* Candidate Evaluation Table */}
        <ApplicationTable
          applications={recruiterApps}
          canEditStatus={true}
          onUpdateStatus={handleStatusUpdate}
          showJobColumn={true}
          onExportCSV={exportApplicationsCSV}
        />
      </main>
    </DashboardLayout>
  );
}

