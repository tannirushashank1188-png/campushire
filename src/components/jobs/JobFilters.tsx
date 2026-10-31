"use client";

import React, { useState } from "react";
import { Filter, X, RotateCcw, Check, SlidersHorizontal } from "lucide-react";
import { JobFilterOptions, JobType } from "@/lib/types";

interface JobFiltersProps {
  filters: JobFilterOptions;
  onChange: (updated: JobFilterOptions) => void;
  onReset: () => void;
  availableSkills?: string[];
  availableLocations?: string[];
  totalResults: number;
}

const JOB_TYPES: JobType[] = ["Full-time", "Internship", "Part-time"];
const GRAD_YEARS = [2025, 2026, 2027];
const CGPA_PRESETS = [
  { label: "Any CGPA", value: undefined },
  { label: "7.0 & above", value: 7.0 },
  { label: "7.5 & above", value: 7.5 },
  { label: "8.0 & above", value: 8.0 },
  { label: "8.5 & above", value: 8.5 },
];

const DEFAULT_SKILLS = [
  "React",
  "TypeScript",
  "Python",
  "Java",
  "Node.js",
  "AWS",
  "SQL",
  "Docker",
  "Kubernetes",
  "PyTorch",
  "Machine Learning",
  "Linux",
];

const DEFAULT_LOCATIONS = [
  "Bengaluru",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Gurugram",
  "Remote",
];

export function JobFilters({
  filters,
  onChange,
  onReset,
  availableSkills = DEFAULT_SKILLS,
  availableLocations = DEFAULT_LOCATIONS,
  totalResults,
}: JobFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilterCount =
    (filters.jobTypes.length > 0 ? 1 : 0) +
    (filters.minCgpa !== undefined ? 1 : 0) +
    (filters.locations.length > 0 ? 1 : 0) +
    (filters.skills.length > 0 ? 1 : 0) +
    (filters.graduationYears.length > 0 ? 1 : 0);

  const toggleJobType = (t: JobType) => {
    const next = filters.jobTypes.includes(t)
      ? filters.jobTypes.filter((x) => x !== t)
      : [...filters.jobTypes, t];
    onChange({ ...filters, jobTypes: next });
  };

  const toggleLocation = (loc: string) => {
    const next = filters.locations.includes(loc)
      ? filters.locations.filter((x) => x !== loc)
      : [...filters.locations, loc];
    onChange({ ...filters, locations: next });
  };

  const toggleSkill = (skill: string) => {
    const next = filters.skills.includes(skill)
      ? filters.skills.filter((x) => x !== skill)
      : [...filters.skills, skill];
    onChange({ ...filters, skills: next });
  };

  const toggleGradYear = (year: number) => {
    const next = filters.graduationYears.includes(year)
      ? filters.graduationYears.filter((x) => x !== year)
      : [...filters.graduationYears, year];
    onChange({ ...filters, graduationYears: next });
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filter Opportunities</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* 1. Job Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Job Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {JOB_TYPES.map((t) => {
            const isSelected = filters.jobTypes.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleJobType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Minimum CGPA Cutoff */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Your CGPA (Cutoff Filter)
        </label>
        <div className="space-y-1">
          {CGPA_PRESETS.map((p) => {
            const isSelected = filters.minCgpa === p.value;
            return (
              <button
                key={p.label}
                onClick={() => onChange({ ...filters, minCgpa: p.value })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{p.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Eligible Graduation Years */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Batch / Graduation Year
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {GRAD_YEARS.map((year) => {
            const isSelected = filters.graduationYears.includes(year);
            return (
              <button
                key={year}
                onClick={() => toggleGradYear(year)}
                className={`py-1.5 text-center rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                Class of {year}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Preferred Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Location
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableLocations.map((loc) => {
            const isSelected = filters.locations.includes(loc);
            return (
              <button
                key={loc}
                onClick={() => toggleLocation(loc)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Required Skills */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
          Top Skills
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {availableSkills.map((s) => {
            const isSelected = filters.skills.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden flex items-center justify-between mb-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        <span className="text-xs font-medium text-slate-500">
          {totalResults} {totalResults === 1 ? "opening" : "openings"}
        </span>
      </div>

      {/* Mobile Filter Slideover Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white p-6 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors"
              >
                Show {totalResults} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar Card */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        {filterContent}
      </div>
    </>
  );
}
