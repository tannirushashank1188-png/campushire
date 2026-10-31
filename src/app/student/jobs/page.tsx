"use client";

import React, { useState, useMemo } from "react";
import { Briefcase, RotateCcw, ChevronDown, Sparkles } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { JobSearchBar } from "@/components/jobs/JobSearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { SortDropdown } from "@/components/jobs/SortDropdown";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  filterAndSortJobs,
  INITIAL_JOB_FILTERS,
} from "@/lib/filterAndSort";
import { JobFilterOptions, JobSortOption } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

export default function StudentJobsPage() {
  const { jobs } = useData();
  const { user } = useAuth();

  const [filters, setFilters] = useState<JobFilterOptions>(INITIAL_JOB_FILTERS);
  const [sortBy, setSortBy] = useState<JobSortOption>("newest");
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Compute available skills & locations dynamically from current jobs list
  const availableSkills = useMemo(() => {
    const s = new Set<string>();
    jobs.forEach((j) => j.requiredSkills.forEach((skill) => s.add(skill)));
    return Array.from(s).sort();
  }, [jobs]);

  const availableLocations = useMemo(() => {
    const l = new Set<string>();
    jobs.forEach((j) => {
      const city = j.location.split(",")[0].trim();
      l.add(city);
    });
    return Array.from(l).sort();
  }, [jobs]);

  // Pure filtering and sorting
  const filteredJobs = useMemo(() => {
    return filterAndSortJobs(jobs, filters, sortBy);
  }, [jobs, filters, sortBy]);

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const handleResetFilters = () => {
    setFilters(INITIAL_JOB_FILTERS);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Find Campus Opportunities"
        subtitle="Search, filter, and apply for verified enterprise campus drives"
      />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <JobSearchBar
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3 justify-end">
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Layout: Filters Sidebar + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Reusable JobFilters Component */}
          <div className="lg:col-span-1">
            <JobFilters
              filters={filters}
              onChange={(next) => {
                setFilters(next);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              onReset={handleResetFilters}
              availableSkills={availableSkills}
              availableLocations={availableLocations}
              totalResults={filteredJobs.length}
            />
          </div>

          {/* Right Column: Results & Cards */}
          <div className="lg:col-span-3 space-y-4">
            {/* Results Counter Header */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-700">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? "opening" : "openings"}
                {filters.searchQuery && (
                  <span className="font-normal text-slate-500">
                    {" "}for &quot;{filters.searchQuery}&quot;
                  </span>
                )}
              </p>

              {(filters.jobTypes.length > 0 ||
                filters.minCgpa !== undefined ||
                filters.locations.length > 0 ||
                filters.skills.length > 0 ||
                filters.graduationYears.length > 0 ||
                filters.searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset all filters
                </button>
              )}
            </div>

            {/* Empty State when no jobs match */}
            {filteredJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No matching job postings found"
                description="Try loosening your filters, adjusting your CGPA cutoff requirement, or clearing search keywords."
                actionLabel="Clear All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination / Load More Button */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <span>Load More Openings</span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
