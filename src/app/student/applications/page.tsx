"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { StatCard } from "@/components/ui/StatCard";
import { CheckCircle2, Clock, Calendar, FileText } from "lucide-react";

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const { applications } = useData();

  // Filter only current student's applications
  const myApplications = applications.filter((app) => app.studentId === user?.id);

  const total = myApplications.length;
  const inReview = myApplications.filter(
    (a) => a.status === "Under Review" || a.status === "Applied"
  ).length;
  const shortlisted = myApplications.filter(
    (a) => a.status === "Shortlisted" || a.status === "Selected"
  ).length;
  const interviews = myApplications.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Applications"
        subtitle="Track the real-time status of your campus drive submissions"
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={total}
            icon={FileText}
            subtext="Submitted applications"
            accentColor="indigo"
          />
          <StatCard
            title="Pending Review"
            value={inReview}
            icon={Clock}
            subtext="Initial recruiter screening"
            accentColor="blue"
          />
          <StatCard
            title="Shortlisted / Selected"
            value={shortlisted}
            icon={CheckCircle2}
            subtext="Passed screening benchmarks"
            accentColor="emerald"
          />
          <StatCard
            title="Interviews"
            value={interviews}
            icon={Calendar}
            subtext="Scheduled live rounds"
            accentColor="purple"
          />
        </div>

        {/* Applications Table */}
        <ApplicationTable
          applications={myApplications}
          canEditStatus={false}
          showJobColumn={true}
        />
      </main>
    </DashboardLayout>
  );
}

