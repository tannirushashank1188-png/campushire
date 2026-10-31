"use client";

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";

export default function AdminJobsPage() {
  const { jobs, applications } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((j) => j.status === statusFilter);
    }

    return result;
  }, [jobs, search, statusFilter]);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Campus Drive Job Listings"
        subtitle={`All corporate recruitment drives scheduled on campus (${jobs.length} postings)`}
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drives by job title, company, skills..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">All Drive Statuses</option>
              <option value="active">Active Drives Only</option>
              <option value="closed">Closed Drives</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No drives match criteria"
              description="Try adjusting your search terms or drive status filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Drive & Company</th>
                    <th className="py-3.5 px-4">Compensation</th>
                    <th className="py-3.5 px-4">Eligibility (CGPA & Year)</th>
                    <th className="py-3.5 px-4">Deadline</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Applicants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredJobs.map((job) => {
                    const applicantsCount = applications.filter(
                      (a) => a.jobId === job.id
                    ).length;

                    return (
                      <tr
                        key={job.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {job.companyInitials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {job.title}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {job.companyName} • {job.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {job.salaryDisplay}
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-indigo-600">
                            Min {job.minCgpa.toFixed(1)} CGPA
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Class of {job.eligibleGradYears.join(", ")}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {formatDate(job.deadline)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              job.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {job.status === "active" ? "Active" : "Closed"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {applicantsCount} applicants
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
