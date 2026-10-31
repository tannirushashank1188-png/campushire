"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo, isDemoMode } = useAuth();
  const { success } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const handleDemoLogin = (roleToLogin: UserRole) => {
    loginAsDemo(roleToLogin);
    success(
      `Welcome, ${
        roleToLogin === "student"
          ? "Student"
          : roleToLogin === "recruiter"
          ? "Recruiter"
          : "Placement Officer"
      }!`,
      "Demo session initialized."
    );

    if (roleToLogin === "student") router.push("/student/dashboard");
    else if (roleToLogin === "recruiter") router.push("/recruiter/dashboard");
    else router.push("/admin/dashboard");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDemoLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
            Campus<span className="text-indigo-600">Hire</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">
          Sign In to Campus Recruitment Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Select your portal role or use one-click hackathon evaluation demo credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 sm:px-10 space-y-6">
          {/* Hackathon Fast-Evaluation Demo Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> 1-Click Judge Access
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                Fast Prototype
              </span>
            </div>
            <p className="text-xs text-indigo-950/80 leading-relaxed">
              Explore all roles instantly without signing up or creating credentials:
            </p>

            <div className="space-y-2 pt-1">
              {/* Student */}
              <button
                type="button"
                onClick={() => handleDemoLogin("student")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all hover:border-indigo-400 group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600">
                      Continue as Student
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Explore jobs, verify eligibility, submit applications
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Recruiter */}
              <button
                type="button"
                onClick={() => handleDemoLogin("recruiter")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all hover:border-indigo-400 group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600">
                      Continue as Recruiter
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Post openings, manage applicants, schedule interviews
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Placement Officer */}
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all hover:border-indigo-400 group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-600">
                      Continue as Placement Officer
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Placement analytics, student directories, CSV export
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">
                Or Sign In With Email
              </span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["student", "recruiter", "admin"] as UserRole[]).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 text-xs font-semibold rounded-xl border capitalize transition-all ${
                      selectedRole === r
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {r === "admin" ? "Officer" : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === "student"
                      ? "aarav.sharma@campus.edu"
                      : selectedRole === "recruiter"
                      ? "recruiter@nexuscloud.com"
                      : "placement.head@campushire.edu"
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-colors"
            >
              Sign In to {selectedRole === "admin" ? "Placement Cell" : selectedRole}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
