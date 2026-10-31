import { Job, JobFilterOptions, JobSortOption } from "./types";

/**
 * Filter and sort jobs according to search terms, multi-select filters, and sort options.
 * Reusable and pure function.
 */
export function filterAndSortJobs(
  jobs: Job[],
  filters: JobFilterOptions,
  sortBy: JobSortOption
): Job[] {
  let result = [...jobs];

  // 1. Text Search (title, company, skills, location)
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter((job) => {
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchCompany = job.companyName.toLowerCase().includes(q);
      const matchLocation = job.location.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(q)
      );
      const matchDesc = job.description.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchLocation || matchSkills || matchDesc;
    });
  }

  // 2. Job Type filter
  if (filters.jobTypes && filters.jobTypes.length > 0) {
    result = result.filter((job) => filters.jobTypes.includes(job.jobType));
  }

  // 3. Minimum CGPA filter (candidate has CGPA >= job.minCgpa, or filter by max cutoff threshold)
  if (filters.minCgpa !== undefined && filters.minCgpa > 0) {
    // If user specifies their CGPA (e.g. 7.5), only show jobs where minCgpa <= user's CGPA
    result = result.filter((job) => job.minCgpa <= (filters.minCgpa as number));
  }

  // 4. Locations filter
  if (filters.locations && filters.locations.length > 0) {
    result = result.filter((job) =>
      filters.locations.some((loc) =>
        job.location.toLowerCase().includes(loc.toLowerCase())
      )
    );
  }

  // 5. Required Skills filter
  if (filters.skills && filters.skills.length > 0) {
    result = result.filter((job) =>
      filters.skills.some((skill) =>
        job.requiredSkills.some(
          (s) => s.toLowerCase() === skill.toLowerCase()
        )
      )
    );
  }

  // 6. Graduation Year Eligibility
  if (filters.graduationYears && filters.graduationYears.length > 0) {
    result = result.filter((job) =>
      job.eligibleGradYears.some((year) =>
        filters.graduationYears.includes(year)
      )
    );
  }

  // 7. Status Filter (active vs closed)
  if (filters.status && filters.status !== "all") {
    result = result.filter((job) => job.status === filters.status);
  }

  // 8. Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      case "salary_high": {
        const valA = a.jobType === "Internship" ? a.salaryMax * 12 / 100000 : a.salaryMax;
        const valB = b.jobType === "Internship" ? b.salaryMax * 12 / 100000 : b.salaryMax;
        return valB - valA;
      }

      case "salary_low": {
        const valA = a.jobType === "Internship" ? a.salaryMin * 12 / 100000 : a.salaryMin;
        const valB = b.jobType === "Internship" ? b.salaryMin * 12 / 100000 : b.salaryMin;
        return valA - valB;
      }

      case "title_asc":
        return a.title.localeCompare(b.title);

      case "company_asc":
        return a.companyName.localeCompare(b.companyName);

      case "deadline_asc":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

      default:
        return 0;
    }
  });

  return result;
}

export const INITIAL_JOB_FILTERS: JobFilterOptions = {
  searchQuery: "",
  jobTypes: [],
  minCgpa: undefined,
  minSalary: undefined,
  maxSalary: undefined,
  locations: [],
  skills: [],
  graduationYears: [],
  status: "all",
};
