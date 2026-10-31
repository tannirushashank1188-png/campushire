export type UserRole = "student" | "recruiter" | "admin";

export type JobType = "Full-time" | "Internship" | "Part-time";

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

export interface UserProfile {
  id: string;
  userId?: string;
  role: UserRole;
  fullName: string;
  email: string;
  avatarUrl?: string;
  // Student fields
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string[];
  resumeUrl?: string;
  preferredLocation?: string;
  // Recruiter fields
  companyId?: string;
  companyName?: string;
  designation?: string;
  phone?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  initials: string;
  industry: string;
  website: string;
  location: string;
  verified: boolean;
  description: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyInitials: string;
  title: string;
  description: string;
  requirements: string[];
  requiredSkills: string[];
  location: string;
  jobType: JobType;
  salaryMin: number; // in LPA or INR thousands
  salaryMax: number;
  salaryDisplay: string;
  minCgpa: number;
  eligibleBranches: string[];
  eligibleGradYears: number[];
  deadline: string; // ISO format YYYY-MM-DD
  openings: number;
  status: "active" | "closed";
  createdAt: string;
  departmentCategory?: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentDegree: string;
  studentBranch: string;
  studentGradYear: number;
  studentCgpa: number;
  studentSkills: string[];
  resumeUrl: string;
  jobTitle: string;
  companyName: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string; // ISO format
  interviewDate?: string | null;
  notes?: string | null;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  studentId: string;
  recruiterId: string;
  scheduledAt: string;
  locationOrLink: string;
  roundName: string;
  notes?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface JobFilterOptions {
  searchQuery: string;
  jobTypes: JobType[];
  minCgpa?: number;
  minSalary?: number;
  maxSalary?: number;
  locations: string[];
  skills: string[];
  graduationYears: number[];
  status?: "all" | "active" | "closed";
}

export type JobSortOption =
  | "newest"
  | "oldest"
  | "salary_high"
  | "salary_low"
  | "title_asc"
  | "company_asc"
  | "deadline_asc";
