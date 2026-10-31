"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Job, Application, UserProfile, ApplicationStatus } from "@/lib/types";
import {
  SAMPLE_JOBS,
  SAMPLE_APPLICATIONS,
  SAMPLE_STUDENTS,
} from "@/lib/sampleData";
import { isDeadlinePassed } from "@/lib/utils";

interface ApplyResult {
  success: boolean;
  message: string;
  application?: Application;
}

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  students: UserProfile[];
  addJob: (newJob: Omit<Job, "id" | "createdAt">) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  toggleJobStatus: (id: string) => void;
  applyToJob: (job: Job, student: UserProfile) => ApplyResult;
  hasApplied: (jobId: string, studentId: string) => boolean;
  updateApplicationStatus: (
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    interviewDate?: string | null
  ) => void;
  updateStudent: (studentId: string, updates: Partial<UserProfile>) => void;
  resetToSampleData: () => void;
  exportApplicationsCSV: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: "campushire_jobs_data",
  APPLICATIONS: "campushire_applications_data",
  STUDENTS: "campushire_students_data",
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [students, setStudents] = useState<UserProfile[]>(SAMPLE_STUDENTS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (savedJobs) setJobs(JSON.parse(savedJobs));

      const savedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (savedStudents) setStudents(JSON.parse(savedStudents));
    } catch {}
  }, []);

  const persistJobs = (updated: Job[]) => {
    setJobs(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
    } catch {}
  };

  const persistApps = (updated: Application[]) => {
    setApplications(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    } catch {}
  };

  const persistStudents = (updated: UserProfile[]) => {
    setStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
    } catch {}
  };

  const addJob = (jobInput: Omit<Job, "id" | "createdAt">): Job => {
    const newJob: Job = {
      ...jobInput,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newJob, ...jobs];
    persistJobs(updated);
    return newJob;
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    const updated = jobs.map((job) =>
      job.id === id ? { ...job, ...updates } : job
    );
    persistJobs(updated);
  };

  const toggleJobStatus = (id: string) => {
    const updated = jobs.map((job) =>
      job.id === id
        ? { ...job, status: (job.status === "active" ? "closed" : "active") as "active" | "closed" }
        : job
    );
    persistJobs(updated);
  };

  const hasApplied = (jobId: string, studentId: string): boolean => {
    return applications.some(
      (app) => app.jobId === jobId && app.studentId === studentId
    );
  };

  const applyToJob = (job: Job, student: UserProfile): ApplyResult => {
    // 1. Check if job is still active
    if (job.status === "closed") {
      return { success: false, message: "This job posting is no longer active." };
    }

    // 2. Check deadline
    if (isDeadlinePassed(job.deadline)) {
      return {
        success: false,
        message: "The application deadline for this position has passed.",
      };
    }

    // 3. Check duplicate application
    if (hasApplied(job.id, student.id)) {
      return {
        success: false,
        message: "You have already submitted an application for this position.",
      };
    }

    // 4. Validate CGPA eligibility
    const studentCgpa = student.cgpa || 0;
    if (studentCgpa < job.minCgpa) {
      return {
        success: false,
        message: `Your CGPA (${studentCgpa.toFixed(2)}) does not meet the minimum requirement of ${job.minCgpa.toFixed(2)}.`,
      };
    }

    // 5. Validate Graduation Year eligibility
    if (
      student.graduationYear &&
      job.eligibleGradYears.length > 0 &&
      !job.eligibleGradYears.includes(student.graduationYear)
    ) {
      return {
        success: false,
        message: `This position is only open to batch of ${job.eligibleGradYears.join(", ")}.`,
      };
    }

    // Create Application
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentCollege: student.college || "Campus Institute",
      studentDegree: student.degree || "B.Tech",
      studentBranch: student.branch || "Computer Science",
      studentGradYear: student.graduationYear || 2025,
      studentCgpa: student.cgpa || 8.0,
      studentSkills: student.skills || [],
      resumeUrl: student.resumeUrl || "https://example.com/resumes/default.pdf",
      jobTitle: job.title,
      companyName: job.companyName,
      jobType: job.jobType,
      status: "Applied",
      appliedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newApp, ...applications];
    persistApps(updated);

    return {
      success: true,
      message: `Successfully applied to ${job.title} at ${job.companyName}!`,
      application: newApp,
    };
  };

  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    interviewDate?: string | null
  ) => {
    const updated = applications.map((app) => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          notes: notes !== undefined ? notes : app.notes,
          interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate,
          updatedAt: new Date().toISOString(),
        };
      }
      return app;
    });
    persistApps(updated);
  };

  const updateStudent = (studentId: string, updates: Partial<UserProfile>) => {
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, ...updates } : s
    );
    persistStudents(updated);
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    setJobs(SAMPLE_JOBS);
    setApplications(SAMPLE_APPLICATIONS);
    setStudents(SAMPLE_STUDENTS);
  };

  const exportApplicationsCSV = () => {
    const headers = [
      "Application ID",
      "Student Name",
      "Student Email",
      "College",
      "Branch",
      "Grad Year",
      "CGPA",
      "Company",
      "Job Title",
      "Job Type",
      "Status",
      "Applied Date",
      "Interview Date",
    ];

    const rows = applications.map((app) => [
      `"${app.id}"`,
      `"${app.studentName}"`,
      `"${app.studentEmail}"`,
      `"${app.studentCollege}"`,
      `"${app.studentBranch}"`,
      `"${app.studentGradYear}"`,
      `"${app.studentCgpa}"`,
      `"${app.companyName}"`,
      `"${app.jobTitle}"`,
      `"${app.jobType}"`,
      `"${app.status}"`,
      `"${app.appliedDate}"`,
      `"${app.interviewDate || "N/A"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CampusHire_Applications_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        students,
        addJob,
        updateJob,
        toggleJobStatus,
        applyToJob,
        hasApplied,
        updateApplicationStatus,
        updateStudent,
        resetToSampleData,
        exportApplicationsCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
