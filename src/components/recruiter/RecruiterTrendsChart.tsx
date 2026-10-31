"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TREND_DATA = [
  { day: "Oct 12", applications: 3, shortlisted: 1 },
  { day: "Oct 15", applications: 7, shortlisted: 2 },
  { day: "Oct 18", applications: 12, shortlisted: 4 },
  { day: "Oct 21", applications: 18, shortlisted: 7 },
  { day: "Oct 24", applications: 24, shortlisted: 9 },
  { day: "Oct 27", applications: 31, shortlisted: 14 },
  { day: "Oct 30", applications: 38, shortlisted: 18 },
];

export function RecruiterTrendsChart() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Application Velocity & Shortlists
          </h3>
          <p className="text-xs text-slate-500">
            Candidate submission trends over the past 3 weeks
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-indigo-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Total Applications
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Shortlisted
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={TREND_DATA}>
            <defs>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
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
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorApps)"
              name="Applications"
            />
            <Area
              type="monotone"
              dataKey="shortlisted"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorShort)"
              name="Shortlisted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
