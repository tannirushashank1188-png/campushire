"use client";

import React, { useState } from "react";
import {
  Menu,
  RotateCcw,
  Sparkles,
  Database,
  Building,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  onOpenMobileNav,
  actions,
}: DashboardHeaderProps) {
  const { user, role, isDemoMode } = useAuth();
  const { resetToSampleData } = useData();
  const { success } = useToast();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetToSampleData();
    setShowResetConfirm(false);
    success("Sample data reset successfully!", "Factory mock data has been restored.");
  };

  const roleBadgeConfig = {
    student: {
      label: "Student Portal",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    recruiter: {
      label: "Recruiter Workspace",
      icon: Building,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    admin: {
      label: "Placement Officer / Admin",
      icon: ShieldCheck,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  };

  const activeRoleBadge = roleBadgeConfig[role];
  const BadgeIcon = activeRoleBadge.icon;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              <span
                className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeRoleBadge.color}`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                {activeRoleBadge.label}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Actions, Demo indicator, Reset button */}
        <div className="flex items-center gap-2.5">
          {actions}

          {isDemoMode && (
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-200/80 rounded-full text-xs font-medium text-amber-800"
              title="Operating in Demo Mode with client-side localStorage persistence."
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo Mode</span>
            </div>
          )}

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            title="Reset to factory sample jobs, students, and applications"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>

      <ConfirmationDialog
        isOpen={showResetConfirm}
        title="Reset Sample Data?"
        message="This will restore all sample jobs, students, and applications to their initial factory state. Any custom jobs or applications you created in demo mode will be reset."
        confirmLabel="Reset Everything"
        cancelLabel="Keep Changes"
        variant="danger"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}

