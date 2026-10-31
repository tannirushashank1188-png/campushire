"use client";

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BRANCH_DATA = [
  { branch: "CSE", offers: 48, eligible: 55 },
  { branch: "IT", offers: 36, eligible: 42 },
  { branch: "ECE", offers: 28, eligible: 38 },
  { branch: "AI & DS", offers: 22, eligible: 25 },
  { branch: "EE", offers: 14, eligible: 22 },
  { branch: "Mech", offers: 12, eligible: 20 },
];

const SALARY_DISTRIBUTION = [
  { range: "< ₹6 LPA", count: 8 },
  { range: "₹6 - 10 LPA", count: 32 },
  { range: "₹10 - 15 LPA", count: 54 },
  { range: "₹15 - 20 LPA", count: 28 },
  { range: "> ₹20 LPA", count: 16 },
];

const STATUS_PIE_DATA = [
  { name: "Selected", value: 38, color: "#10b981" },
  { name: "Interview Scheduled", value: 24, color: "#8b5cf6" },
  { name: "Shortlisted", value: 32, color: "#f59e0b" },
  { name: "Under Review", value: 45, color: "#3b82f6" },
  { name: "Rejected", value: 18, color: "#f43f5e" },
];

export function PlacementAnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Offers vs Eligible by Engineering Discipline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Placement Rate by Engineering Discipline
          </h3>
          <p className="text-xs text-slate-500">
            Total offers extended vs eligible cohort size
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BRANCH_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="branch"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
              />
              <Bar dataKey="offers" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Placed Offers" />
              <Bar dataKey="eligible" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Eligible Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Salary Package Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Salary Package Distribution (CTC)
          </h3>
          <p className="text-xs text-slate-500">
            Offers aggregated across campus compensation brackets
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALARY_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  border: "none",
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Students Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

