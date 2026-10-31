"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default function StudentProfilePage() {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Student Profile & Academic Credentials"
        subtitle="Manage your institutional metrics, verified CGPA, and resume link"
      />

      <main className="p-4 sm:p-8">
        <ProfileForm />
      </main>
    </DashboardLayout>
  );
}

