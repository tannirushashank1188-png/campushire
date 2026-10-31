"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatCard } from "@/components/ui/StatCard";
import { JobCard } from "@/components/jobs/JobCard";
import { ApplicationStatusBadge } from "@/components/ui/ApplicationStatusBadge";
import { calculateProfileCompletion, formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { jobs, applications } = useData();

  // Filter applications for current student
  const studentApps = applications.filter((app) => app.studentId === user?.id);

  const totalApplied = studentApps.length;
  const shortlisted = studentApps.filter(
    (a) => a.status === "Shortlisted" || a.status === "Selected"
  ).length;
  const interviews = studentApps.filter(
    (a) => a.status === "Interview Scheduled"
  ).length;

  const profileCompletion = calculateProfileCompletion(user);

  // Recommended jobs based on student CGPA and skills
  const studentSkills = user?.skills || [];
  const studentCgpa = user?.cgpa || 0;

  const recommendedJobs = jobs
    .filter((job) => {
      const meetsCgpa = studentCgpa >= job.minCgpa;
      const sharesSkills = job.requiredSkills.some((s) =>
        studentSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
      );
      return meetsCgpa && sharesSkills && job.status === "active";
    })
    .slice(0, 4);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Student Dashboard"
        subtitle={`Welcome back, ${user?.fullName || "Student"} • ${user?.college || "Campus Institute"}`}
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Profile Completion Alert Banner if incomplete */}
        {profileCompletion < 100 && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Profile Completion: {profileCompletion}%
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Update your academic CGPA, verified branch, and resume URL to automatically qualify for premium enterprise shortlists.
              </p>
            </div>
            <Link
              href="/student/profile"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm shadow-indigo-100"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {/* Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={totalApplied}
            icon={FileText}
            subtext="Applications submitted across drives"
            accentColor="indigo"
          />
          <StatCard
            title="Shortlisted Positions"
            value={shortlisted}
            icon={CheckCircle2}
            subtext="Advanced past screening stages"
            accentColor="emerald"
          />
          <StatCard
            title="Interview Rounds"
            value={interviews}
            icon={Calendar}
            subtext="Technical & HR interviews scheduled"
            accentColor="purple"
          />
          <StatCard
            title="Recommended Openings"
            value={recommendedJobs.length}
            icon={Sparkles}
            subtext="Matched to your skills & CGPA"
            accentColor="blue"
          />
        </div>

        {/* Two Columns: Recent Application Activity & Recommended Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Applications (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Application Activity
                </h2>
                <p className="text-xs text-slate-500">
                  Live recruitment status of your submissions
                </p>
              </div>
              <Link
                href="/student/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                <span>View All ({studentApps.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {studentApps.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-800">
                    No applications submitted yet
                  </p>
                  <p className="text-xs text-slate-500">
                    Browse active drives and apply with 1-click using your profile.
                  </p>
                  <Link
                    href="/student/jobs"
                    className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Find Openings
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {studentApps.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {app.jobTitle}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {app.companyName} • Applied {formatDate(app.appliedDate)}
                        </p>
                        {app.interviewDate && (
                          <p className="text-[11px] font-semibold text-purple-600 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Interview: {formatDate(app.interviewDate)}
                          </p>
                        )}
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Profile Summary Card */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Academic Snapshot
              </h2>
              <p className="text-xs text-slate-500">
                Verified candidate metrics
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user?.fullName?.slice(0, 2).toUpperCase() || "ST"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {user?.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Cumulative CGPA</span>
                  <span className="font-bold text-indigo-600">
                    {user?.cgpa?.toFixed(2) || "N/A"} / 10.00
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Graduation Batch</span>
                  <span className="font-semibold text-slate-800">
                    Class of {user?.graduationYear || 2025}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Program / Branch</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                    {user?.degree} - {user?.branch}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Key Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.skills || []).slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/student/profile"
                  className="block text-center w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs Carousel */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Recommended For You
              </h2>
              <p className="text-xs text-slate-500">
                Positions aligned with your skill stack and meeting your CGPA threshold
              </p>
            </div>
            <Link
              href="/student/jobs"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

