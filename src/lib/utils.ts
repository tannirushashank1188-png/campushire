import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserProfile } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return dateString;
  }
}

export function isDeadlinePassed(deadline: string): boolean {
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    // End of deadline day
    deadlineDate.setHours(23, 59, 59, 999);
    return now.getTime() > deadlineDate.getTime();
  } catch {
    return false;
  }
}

export function getDaysRemaining(deadline: string): number {
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffMs = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function calculateProfileCompletion(profile: Partial<UserProfile> | null): number {
  if (!profile) return 0;
  
  const fields: (keyof UserProfile)[] = [
    "fullName",
    "email",
    "college",
    "degree",
    "branch",
    "graduationYear",
    "cgpa",
    "skills",
    "resumeUrl",
    "preferredLocation",
  ];

  let completed = 0;
  fields.forEach((field) => {
    const val = profile[field];
    if (Array.isArray(val)) {
      if (val.length > 0) completed++;
    } else if (val !== undefined && val !== null && val !== "") {
      completed++;
    }
  });

  return Math.round((completed / fields.length) * 100);
}

export function generateInitials(name: string): string {
  if (!name) return "CH";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
