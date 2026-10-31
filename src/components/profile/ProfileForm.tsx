"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Building,
  FileText,
  MapPin,
  Sparkles,
  Check,
  CheckCircle2,
} from "lucide-react";
import { UserProfile } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { calculateProfileCompletion } from "@/lib/utils";

export function ProfileForm() {
  const { user, updateCurrentUserProfile } = useAuth();
  const { updateStudent } = useData();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [college, setCollege] = useState(
    user?.college || "National Institute of Technology, Surathkal"
  );
  const [degree, setDegree] = useState(user?.degree || "B.Tech");
  const [branch, setBranch] = useState(user?.branch || "Computer Science");
  const [graduationYear, setGraduationYear] = useState(
    user?.graduationYear?.toString() || "2025"
  );
  const [cgpa, setCgpa] = useState(user?.cgpa?.toString() || "8.85");
  const [skillsText, setSkillsText] = useState(
    user?.skills?.join(", ") || "React, TypeScript, Node.js, PostgreSQL, Docker, Java"
  );
  const [resumeUrl, setResumeUrl] = useState(
    user?.resumeUrl || "https://example.com/resumes/aarav_sharma.pdf"
  );
  const [preferredLocation, setPreferredLocation] = useState(
    user?.preferredLocation || "Bengaluru, Karnataka"
  );

  const previewProfile: Partial<UserProfile> = {
    fullName,
    email,
    college,
    degree,
    branch,
    graduationYear: parseInt(graduationYear, 10),
    cgpa: parseFloat(cgpa),
    skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
    resumeUrl,
    preferredLocation,
  };

  const completionScore = calculateProfileCompletion(previewProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      error("Full name is required.");
      return;
    }
    if (!email.trim()) {
      error("Email address is required.");
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      error("CGPA must be between 0.00 and 10.00.");
      return;
    }

    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updates: Partial<UserProfile> = {
      fullName,
      email,
      college,
      degree,
      branch,
      graduationYear: parseInt(graduationYear, 10) || 2025,
      cgpa: parsedCgpa,
      skills: skillsArray,
      resumeUrl,
      preferredLocation,
    };

    updateCurrentUserProfile(updates);
    if (user?.id) {
      updateStudent(user.id, updates);
    }

    success("Profile Updated!", "Your student credentials and eligibility profile have been saved.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Completion Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Profile Strength
            </h3>
          </div>
          <span className="text-sm font-bold text-indigo-600">
            {completionScore}% Completed
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionScore}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Complete your academic metrics and skills to unlock AI recommendations and recruiter shortlists.
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Academic Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University *
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Degree Program *
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="MCA">MCA (Master of Computer Applications)</option>
                <option value="B.Sc">B.Sc Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Specialization *
              </label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Graduation Year *
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="2024">2024</option>
                <option value="2025">2025 (Graduating Class)</option>
                <option value="2026">2026 (Pre-final Year)</option>
                <option value="2027">2027 (Sophomore)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative CGPA (out of 10.00) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Job Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Mumbai, Remote"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* Skills & Resume */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Technical Skills & Resume
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, TypeScript, Python, Docker, PostgreSQL"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resume URL (Google Drive, GitHub, or Cloud Link)
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/resumes/my_resume.pdf"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-100 flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" /> Save Profile Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
