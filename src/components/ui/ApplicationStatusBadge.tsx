import React from "react";
import { ApplicationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  size?: "sm" | "md";
}

export function ApplicationStatusBadge({
  status,
  className,
  size = "md",
}: ApplicationStatusBadgeProps) {
  const config: Record<
    ApplicationStatus,
    { bg: string; text: string; dot: string; label: string }
  > = {
    Applied: {
      bg: "bg-slate-100 border-slate-200",
      text: "text-slate-700",
      dot: "bg-slate-500",
      label: "Applied",
    },
    "Under Review": {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      label: "Under Review",
    },
    Shortlisted: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-500",
      label: "Shortlisted",
    },
    "Interview Scheduled": {
      bg: "bg-purple-50 border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
      label: "Interview Scheduled",
    },
    Selected: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Selected / Offered",
    },
    Rejected: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-rose-700",
      dot: "bg-rose-500",
      label: "Not Selected",
    },
  };

  const current = config[status] || config["Applied"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
        current.bg,
        current.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", current.dot)} />
      {current.label}
    </span>
  );
}

