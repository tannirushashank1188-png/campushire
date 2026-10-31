"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { Job, JobType } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";

interface JobPostingFormProps {
  initialJob?: Job;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function JobPostingForm({
  initialJob,
  isEditing = false,
  onSuccess,
}: JobPostingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addJob, updateJob } = useData();
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialJob?.title || "");
  const [companyName, setCompanyName] = useState(
    initialJob?.companyName || user?.companyName || "Nexus Cloud Systems"
  );
  const [description, setDescription] = useState(initialJob?.description || "");
  const [location, setLocation] = useState(
    initialJob?.location || "Bengaluru, Karnataka"
  );
  const [jobType, setJobType] = useState<JobType>(
    initialJob?.jobType || "Full-time"
  );
  const [salaryDisplay, setSalaryDisplay] = useState(
    initialJob?.salaryDisplay || "₹12.0 - ₹16.0 LPA"
  );
  const [salaryMin, setSalaryMin] = useState(initialJob?.salaryMin?.toString() || "12");
  const [salaryMax, setSalaryMax] = useState(initialJob?.salaryMax?.toString() || "16");
  const [minCgpa, setMinCgpa] = useState(initialJob?.minCgpa?.toString() || "7.0");
  const [openings, setOpenings] = useState(initialJob?.openings?.toString() || "5");
  const [deadline, setDeadline] = useState(
    initialJob?.deadline ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Skills input
  const [skillsText, setSkillsText] = useState(
    initialJob?.requiredSkills?.join(", ") || "React, TypeScript, Node.js, SQL"
  );

  // Requirements list
  const [requirements, setRequirements] = useState<string[]>(
    initialJob?.requirements || [
      "Solid knowledge of Data Structures and Algorithms.",
      "Proficiency with modern web frameworks and REST APIs.",
      "Good team collaboration and analytical skills.",
    ]
  );
  const [newReq, setNewReq] = useState("");

  // Branches
  const [branches, setBranches] = useState<string[]>(
    initialJob?.eligibleBranches || ["Computer Science", "Information Technology"]
  );

  // Grad years
  const [gradYears, setGradYears] = useState<number[]>(
    initialJob?.eligibleGradYears || [2025, 2026]
  );

  const availableBranches = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Data Science",
    "Artificial Intelligence",
    "Electrical Engineering",
    "All Engineering Branches",
  ];

  const toggleBranch = (b: string) => {
    if (branches.includes(b)) {
      setBranches(branches.filter((x) => x !== b));
    } else {
      setBranches([...branches, b]);
    }
  };

  const toggleGradYear = (y: number) => {
    if (gradYears.includes(y)) {
      setGradYears(gradYears.filter((x) => x !== y));
    } else {
      setGradYears([...gradYears, y]);
    }
  };

  const handleAddRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error("Job title is required.");
      return;
    }
    if (!companyName.trim()) {
      error("Company name is required.");
      return;
    }
    if (!description.trim()) {
      error("Description is required.");
      return;
    }
    if (!deadline) {
      error("Application deadline is required.");
      return;
    }

    const skillsArray = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const initials = companyName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    if (isEditing && initialJob) {
      updateJob(initialJob.id, {
        title,
        companyName,
        companyInitials: initials,
        description,
        requirements,
        requiredSkills: skillsArray,
        location,
        jobType,
        salaryDisplay,
        salaryMin: parseFloat(salaryMin) || 0,
        salaryMax: parseFloat(salaryMax) || 0,
        minCgpa: parseFloat(minCgpa) || 6.0,
        eligibleBranches: branches,
        eligibleGradYears: gradYears,
        deadline,
        openings: parseInt(openings, 10) || 1,
      });
      success("Job Updated", `Successfully updated "${title}".`);
      if (onSuccess) onSuccess();
      else router.push("/recruiter/jobs");
    } else {
      addJob({
        recruiterId: user?.id || "recruiter-1",
        companyId: user?.companyId || "comp-1",
        companyName,
        companyInitials: initials,
        title,
        description,
        requirements,
        requiredSkills: skillsArray,
        location,
        jobType,
        salaryDisplay,
        salaryMin: parseFloat(salaryMin) || 0,
        salaryMax: parseFloat(salaryMax) || 0,
        minCgpa: parseFloat(minCgpa) || 6.0,
        eligibleBranches: branches,
        eligibleGradYears: gradYears,
        deadline,
        openings: parseInt(openings, 10) || 1,
        status: "active",
      });
      success("Job Published!", `New opening "${title}" is now live for students.`);
      if (onSuccess) onSuccess();
      else router.push("/recruiter/jobs");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" /> Basic Job Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Development Intern"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Nexus Cloud Systems"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Type *
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka (or Remote)"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Job Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role mission, team context, and everyday projects..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Compensation & Openings */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" /> Compensation & Vacancies
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Salary / Stipend Display *
            </label>
            <input
              type="text"
              required
              value={salaryDisplay}
              onChange={(e) => setSalaryDisplay(e.target.value)}
              placeholder="e.g. ₹12.0 - ₹18.0 LPA or ₹45,000 / mo"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Number of Openings *
            </label>
            <input
              type="number"
              min="1"
              required
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Application Deadline *
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" /> Eligibility Criteria
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Minimum CGPA Cutoff (0.0 - 10.0) *
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            required
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
            className="w-48 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Eligible Graduation Years
          </label>
          <div className="flex gap-2">
            {[2025, 2026, 2027].map((y) => (
              <button
                type="button"
                key={y}
                onClick={() => toggleGradYear(y)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  gradYears.includes(y)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Batch of {y}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Eligible Branches
          </label>
          <div className="flex flex-wrap gap-2">
            {availableBranches.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => toggleBranch(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  branches.includes(b)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Required Technical Skills (comma separated) *
          </label>
          <input
            type="text"
            required
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="e.g. React, TypeScript, Python, Docker, PostgreSQL"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Key Role Requirements
          </label>
          <div className="space-y-2 mb-3">
            {requirements.map((req, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800"
              >
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(i)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddRequirement();
                }
              }}
              placeholder="Add another requirement bullet..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-4 h-4" />
          {isEditing ? "Save Changes" : "Publish Job Opening"}
        </button>
      </div>
    </form>
  );
}
