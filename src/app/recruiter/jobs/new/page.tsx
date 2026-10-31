"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { JobPostingForm } from "@/components/jobs/JobPostingForm";

export default function NewJobPage() {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Post New Campus Job"
        subtitle="Publish a new recruitment drive opening with branch and CGPA eligibility criteria"
      />

      <main className="p-4 sm:p-8 max-w-4xl">
        <JobPostingForm isEditing={false} />
      </main>
    </DashboardLayout>
  );
}

