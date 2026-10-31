"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardRedirect() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (role === "student") router.replace("/student/dashboard");
      else if (role === "recruiter") router.replace("/recruiter/dashboard");
      else router.replace("/admin/dashboard");
    }
  }, [role, isLoading, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Loading your dashboard workspace...
        </p>
      </div>
    </div>
  );
}
