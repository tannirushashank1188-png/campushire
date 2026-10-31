"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Layers,
  Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { JobCard } from "@/components/jobs/JobCard";

export default function LandingPage() {
  const { role, isDemoMode } = useAuth();
  const { jobs } = useData();

  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      {isDemoMode && (
        <div className="bg-navy-950 text-indigo-200 text-xs py-2 px-4 border-b border-indigo-900/50 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                <strong>Hackathon Demo Mode:</strong> Immediate full-stack preview with client persistence.
              </span>
            </span>
            <Link
              href="/login"
              className="text-white hover:text-indigo-300 font-semibold underline underline-offset-2 flex items-center gap-1"
            >
              Demo Switcher <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              Campus<span className="text-indigo-600">Hire</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </Link>
            <Link href="#opportunities" className="hover:text-indigo-600 transition-colors">
              Explore Jobs
            </Link>
            <Link href="#benefits" className="hover:text-indigo-600 transition-colors">
              Benefits
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/student/jobs"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all hover:scale-105"
            >
              Explore Opportunities
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Problem Statement HACK-P410 • Campus Placement Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Career Starts <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                on Campus.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Connecting university students with high-growth technology companies and top enterprise recruiters. Seamlessly manage eligibility checks, real-time applications, and placement drive analytics.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/student/jobs"
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Join CampusHire</span>
              </Link>
            </div>

            {/* Placement Demonstration Metrics */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-slate-900">2,400+</span>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Eligible Students*</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-indigo-600">140+</span>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Visiting Companies*</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-emerald-600">89.4%</span>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Placement Rate*</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-2xl font-extrabold text-slate-900">₹14.2 LPA</span>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Average Package*</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Demonstration metrics presented for prototype review purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="opportunities" className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" /> Live Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Campus Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top internships and entry-level positions actively recruiting graduating batches.
            </p>
          </div>
          <Link
            href="/student/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All {jobs.length} Positions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How CampusHire Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Three streamlined steps for frictionless recruitment on university campuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Build Academic Profile
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students verify CGPA, technical skills, resume links, and graduation batches once for automated eligibility verification.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Discover & 1-Click Apply
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search with instant multi-filtering across salary ranges, technical skill requirements, and company profiles with zero duplicate errors.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Track, Interview & Hire
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recruiters schedule interviews and update status in real-time, while placement officers monitor live placement velocity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Students & Recruiters */}
      <section id="benefits" className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-navy-950 text-white space-y-5 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <GraduationCap className="w-4 h-4" /> For Students
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Unlock Verified Campus Drives
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant automated CGPA & branch eligibility checking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time status updates: Shortlist, Interview, & Selection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent salary ranges, roles, and interview timelines</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/student/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recruiters & Placement Officers */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-slate-900 space-y-5 shadow-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              <Building2 className="w-4 h-4" /> For Recruiters & Placement Officers
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              End-to-End Talent Acquisition
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Post job openings with customizable cutoffs & branch filters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Candidate filtering, resume review, and interview scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Exportable CSV placement analytics and department metrics</span>
              </li>
            </ul>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/recruiter/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                <span>Recruiter View</span>
              </Link>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
              >
                <span>Officer View</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">
              CampusHire — Campus Recruitment Portal
            </span>
          </div>

          <p className="text-center sm:text-right text-slate-400">
            Engineered for Hackathon Challenge HACK-P410 • Built with Next.js, TypeScript & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
