"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  Eye,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import { Application, ApplicationStatus } from "@/lib/types";
import { ApplicationStatusBadge } from "../ui/ApplicationStatusBadge";
import { EmptyState } from "../ui/EmptyState";
import { CandidateDetailModal } from "./CandidateDetailModal";
import { formatDate } from "@/lib/utils";

interface ApplicationTableProps {
  applications: Application[];
  canEditStatus?: boolean;
  onUpdateStatus?: (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string | null
  ) => void;
  showJobColumn?: boolean;
  onExportCSV?: () => void;
}

export function ApplicationTable({
  applications,
  canEditStatus = false,
  onUpdateStatus,
  showJobColumn = true,
  onExportCSV,
}: ApplicationTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "cgpa" | "name">("date");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Extract unique job titles for filter dropdown
  const uniqueJobs = useMemo(() => {
    const set = new Set(applications.map((a) => a.jobTitle));
    return Array.from(set);
  }, [applications]);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.studentName.toLowerCase().includes(q) ||
          a.studentEmail.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.studentSkills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (jobFilter !== "all") {
      result = result.filter((a) => a.jobTitle === jobFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "cgpa") {
        return (b.studentCgpa || 0) - (a.studentCgpa || 0);
      }
      if (sortBy === "name") {
        return a.studentName.localeCompare(b.studentName);
      }
      return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    });

    return result;
  }, [applications, search, statusFilter, jobFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, email, skills..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Job Filter if multiple jobs */}
          {uniqueJobs.length > 1 && (
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:border-indigo-500 max-w-[150px] truncate"
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:border-indigo-500"
          >
            <option value="date">Sort: Recent First</option>
            <option value="cgpa">Sort: CGPA (High to Low)</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          {/* CSV Export Button if provided */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
              title="Export filtered applications to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredApplications.length === 0 ? (
          <EmptyState
            title="No applications match your criteria"
            description="Try adjusting your search query, status filters, or clear selected criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch("");
              setStatusFilter("all");
              setJobFilter("all");
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate</th>
                  {showJobColumn && <th className="py-3.5 px-4">Applied Role</th>}
                  <th className="py-3.5 px-4">Academics</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {app.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {app.studentName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {app.studentEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Job */}
                    {showJobColumn && (
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">
                          {app.jobTitle}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {app.companyName}
                        </p>
                      </td>
                    )}

                    {/* Academics */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          CGPA {app.studentCgpa?.toFixed(2)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {app.studentBranch} ({app.studentGradYear})
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(app.appliedDate)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <ApplicationStatusBadge status={app.status} />
                    </td>

                    {/* Action buttons */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View profile & details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick status dropdown for recruiters */}
                        {canEditStatus && onUpdateStatus && (
                          <select
                            value={app.status}
                            onChange={(e) =>
                              onUpdateStatus(
                                app.id,
                                e.target.value as ApplicationStatus
                              )
                            }
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:border-indigo-500"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      <CandidateDetailModal
        application={selectedApp}
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={onUpdateStatus}
        canEditStatus={canEditStatus}
      />
    </div>
  );
}
