"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  PlusCircle,
  Users,
  Building2,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { cn, generateInitials } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchRole, logout, isDemoMode } = useAuth();

  const studentNavItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Find Jobs", href: "/student/jobs", icon: Briefcase },
    { label: "My Applications", href: "/student/applications", icon: FileText },
    { label: "Student Profile", href: "/student/profile", icon: User },
  ];

  const recruiterNavItems = [
    { label: "Recruiter Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { label: "Manage Jobs", href: "/recruiter/jobs", icon: Briefcase },
    { label: "Post New Job", href: "/recruiter/jobs/new", icon: PlusCircle },
    { label: "Candidates & Apps", href: "/recruiter/applications", icon: Users },
  ];

  const adminNavItems = [
    { label: "Placement Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Student Directory", href: "/admin/students", icon: Users },
    { label: "Campus Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "All Applications", href: "/admin/applications", icon: FileText },
  ];

  const navItems =
    role === "student"
      ? studentNavItems
      : role === "recruiter"
      ? recruiterNavItems
      : adminNavItems;

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === "student") router.push("/student/dashboard");
    else if (newRole === "recruiter") router.push("/recruiter/dashboard");
    else router.push("/admin/dashboard");
    if (onNavigate) onNavigate();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0b1329] text-slate-200 border-r border-slate-800/80 w-64 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">
                Campus<span className="text-indigo-400">Hire</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Recruitment Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Role Switcher for Hackathon Testing */}
      <div className="px-4 py-3 bg-[#0e1838] border-b border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Demo Role
          </span>
          {isDemoMode && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
              Live Demo
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-700/60">
          {(["student", "recruiter", "admin"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={cn(
                "py-1.5 px-2 text-xs font-medium rounded-md capitalize transition-all",
                role === r
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              {r === "admin" ? "Officer" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {role === "student"
            ? "Student Space"
            : role === "recruiter"
            ? "Recruiter Portal"
            : "Placement Cell"}
        </p>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#091024]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow">
            {generateInitials(user?.fullName || "User")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.fullName || "Active User"}
            </p>
            <p className="text-[11px] text-slate-400 truncate capitalize">
              {role === "admin" ? "Placement Officer" : role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
