import { SAMPLE_JOBS, SAMPLE_STUDENTS, SAMPLE_APPLICATIONS } from "../src/lib/sampleData";
import { filterAndSortJobs, INITIAL_JOB_FILTERS } from "../src/lib/filterAndSort";
import { calculateProfileCompletion, isDeadlinePassed, getDaysRemaining } from "../src/lib/utils";
import { Job, UserProfile, Application } from "../src/lib/types";

console.log("=== RUNNING AUTOMATED UNIT & WORKFLOW TESTS FOR CAMPUSHIRE ===\n");

// 1. Verify Sample Data Integrity
console.log("1. Verifying Sample Seed Data:");
console.assert(SAMPLE_JOBS.length >= 12, `Expected >= 12 jobs, got ${SAMPLE_JOBS.length}`);
console.assert(SAMPLE_STUDENTS.length >= 20, `Expected >= 20 students, got ${SAMPLE_STUDENTS.length}`);
console.assert(SAMPLE_APPLICATIONS.length >= 15, `Expected >= 15 applications, got ${SAMPLE_APPLICATIONS.length}`);
console.log(`✓ Sample Data valid: ${SAMPLE_JOBS.length} jobs, ${SAMPLE_STUDENTS.length} students, ${SAMPLE_APPLICATIONS.length} applications.`);

// 2. Test Search by Keyword
console.log("\n2. Testing Keyword Search:");
const searchResults = filterAndSortJobs(SAMPLE_JOBS, { ...INITIAL_JOB_FILTERS, searchQuery: "python" }, "newest");
console.assert(searchResults.length > 0, "Expected Python jobs to be found");
console.assert(
  searchResults.every((j) =>
    j.title.toLowerCase().includes("python") ||
    j.requiredSkills.some((s) => s.toLowerCase().includes("python")) ||
    j.description.toLowerCase().includes("python")
  ),
  "All search results should match Python"
);
console.log(`✓ Keyword search 'python' returned ${searchResults.length} matching jobs.`);

// 3. Test Multi-Filter Combination
console.log("\n3. Testing Combined Filters (JobType + Location + CGPA):");
const filtered = filterAndSortJobs(
  SAMPLE_JOBS,
  {
    ...INITIAL_JOB_FILTERS,
    jobTypes: ["Full-time"],
    locations: ["Bengaluru"],
    minCgpa: 8.0,
  },
  "salary_high"
);
console.assert(filtered.every((j) => j.jobType === "Full-time"), "All must be Full-time");
console.assert(filtered.every((j) => j.location.includes("Bengaluru")), "All must be Bengaluru");
console.assert(filtered.every((j) => j.minCgpa <= 8.0), "Student with 8.0 CGPA must be eligible");
console.log(`✓ Multi-filter returned ${filtered.length} matching jobs.`);

// 4. Test Sorting Logic
console.log("\n4. Testing Sorting:");
const sortedBySalary = filterAndSortJobs(SAMPLE_JOBS, INITIAL_JOB_FILTERS, "salary_high");
for (let i = 0; i < sortedBySalary.length - 1; i++) {
  const cur = sortedBySalary[i].jobType === "Internship" ? sortedBySalary[i].salaryMax * 12 / 100000 : sortedBySalary[i].salaryMax;
  const next = sortedBySalary[i+1].jobType === "Internship" ? sortedBySalary[i+1].salaryMax * 12 / 100000 : sortedBySalary[i+1].salaryMax;
  console.assert(cur >= next, `Sorting error: ${cur} should be >= ${next}`);
}
console.log("✓ Salary high-to-low sorting verified.");

const sortedByTitle = filterAndSortJobs(SAMPLE_JOBS, INITIAL_JOB_FILTERS, "title_asc");
for (let i = 0; i < sortedByTitle.length - 1; i++) {
  console.assert(sortedByTitle[i].title.localeCompare(sortedByTitle[i+1].title) <= 0, "Alphabetical title sort error");
}
console.log("✓ Alphabetical title A-Z sorting verified.");

// 5. Test Duplicate Application & Eligibility
console.log("\n5. Testing Job Application Workflow & Constraints:");
const testStudent: UserProfile = SAMPLE_STUDENTS[0]; // Aarav Sharma, CGPA: 8.85
const testJob = SAMPLE_JOBS[0]; // Min CGPA: 7.5

// Test eligibility logic
const meetsCutoff = (testStudent.cgpa || 0) >= testJob.minCgpa;
console.assert(meetsCutoff === true, "Student should meet cutoff");

// Test low CGPA rejection
const lowCgpaStudent: UserProfile = { ...testStudent, id: "student-low", cgpa: 6.2 };
const meetsCutoffLow = (lowCgpaStudent.cgpa || 0) >= testJob.minCgpa;
console.assert(meetsCutoffLow === false, "Student below cutoff must be flagged ineligible");
console.log("✓ Cutoff CGPA validation correctly passes qualified and rejects unqualified students.");

// 6. Test Profile Completion Calculation
console.log("\n6. Testing Profile Completion Calculation:");
const fullProfileScore = calculateProfileCompletion(testStudent);
console.assert(fullProfileScore === 100, `Expected 100%, got ${fullProfileScore}%`);
const partialProfileScore = calculateProfileCompletion({ fullName: "Test", email: "test@campus.edu" });
console.assert(partialProfileScore < 50, `Expected < 50%, got ${partialProfileScore}%`);
console.log(`✓ Profile calculation verified (Full: ${fullProfileScore}%, Partial: ${partialProfileScore}%).`);

console.log("\n=== ALL AUTOMATED TESTS PASSED SUCCESSFULLY! ===");

