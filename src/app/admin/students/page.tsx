"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  FileText,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminStudentsPage() {
  const { students } = useData();

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"cgpa" | "name" | "year">("cgpa");

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.college?.toLowerCase().includes(q) ||
          s.branch?.toLowerCase().includes(q) ||
          s.skills?.some((sk) => sk.toLowerCase().includes(q))
      );
    }

    if (branchFilter !== "all") {
      result = result.filter((s) => s.branch === branchFilter);
    }

    if (gradYearFilter !== "all") {
      result = result.filter(
        (s) => s.graduationYear === parseInt(gradYearFilter, 10)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "cgpa") {
        return (b.cgpa || 0) - (a.cgpa || 0);
      }
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      }
      return (b.graduationYear || 0) - (a.graduationYear || 0);
    });

    return result;
  }, [students, search, branchFilter, gradYearFilter, sortBy]);

  // Extract unique branches for filter dropdown
  const uniqueBranches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.branch) set.add(s.branch);
    });
    return Array.from(set);
  }, [students]);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Student Directory"
        subtitle={`Enrolled undergraduate and graduate talent pool (${students.length} students)`}
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Search & Filters Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name, email, skills, or college..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">All Branches</option>
              {uniqueBranches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={gradYearFilter}
              onChange={(e) => setGradYearFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="all">All Batches</option>
              <option value="2025">Class of 2025</option>
              <option value="2026">Class of 2026</option>
              <option value="2027">Class of 2027</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer"
            >
              <option value="cgpa">Sort: CGPA (High to Low)</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="year">Sort: Graduation Year</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No students match criteria"
              description="Try adjusting your search terms or clearing branch/batch filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Institution & Branch</th>
                    <th className="py-3.5 px-4">Grad Year</th>
                    <th className="py-3.5 px-4">CGPA</th>
                    <th className="py-3.5 px-4">Technical Skills</th>
                    <th className="py-3.5 px-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredStudents.map((st) => (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {st.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {st.fullName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {st.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">
                          {st.branch}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {st.college}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {st.graduationYear}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {st.cgpa?.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(st.skills || []).slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {st.resumeUrl ? (
                          <a
                            href={st.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}

