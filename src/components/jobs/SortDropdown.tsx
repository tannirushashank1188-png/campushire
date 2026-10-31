"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { JobSortOption } from "@/lib/types";

interface SortDropdownProps {
  value: JobSortOption;
  onChange: (val: JobSortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="relative inline-flex items-center">
        <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as JobSortOption)}
          className="appearance-none pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="deadline_asc">Deadline: Earliest First</option>
          <option value="salary_high">Salary: High to Low</option>
          <option value="salary_low">Salary: Low to High</option>
          <option value="title_asc">Job Title: A to Z</option>
          <option value="company_asc">Company: A to Z</option>
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
