# CampusHire — Campus Recruitment Portal 🎓

> **Hackathon Problem Statement:** HACK-P410  
> **Product Objective:** End-to-end modern recruitment platform connecting **Students**, **Recruiters**, and **College Placement Officers**.

---

## 🚀 Live Demo & Quick Start

CampusHire is engineered with an **Immediate Demo Mode**. You can run and evaluate the application immediately with deterministic demonstration data, rich local persistence via `localStorage`, and zero required database credentials.

### Run Locally:

```bash
# 1. Clone repository
git clone https://github.com/your-username/campushire.git
cd campushire

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Or build and start production server
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Hackathon Evaluation Quick Credentials (1-Click Switcher)

Judges can explore any role instantly from the **Login Screen** or the **Demo Role Widget** in the sidebar:

| Role | Demo Identity | Portal Responsibilities |
|---|---|---|
| **Student** | Aarav Sharma (NIT Surathkal, CGPA 8.85) | Search jobs, check CGPA eligibility, 1-click apply, track application stages, edit academic profile |
| **Recruiter** | Vikram Singhania (Nexus Cloud Systems) | Post job openings, manage applicants, filter & sort candidates by CGPA, schedule interviews, update recruitment stages |
| **Placement Officer** | Prof. Rajeshwar Sundaram (Consortium Head) | Placement velocity dashboard, branch analytics charts, salary distributions, student directory, export application report (CSV) |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5 (Strict mode)
- **Styling:** Tailwind CSS with custom navy & indigo color palette
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (Placement rates, CTC distribution, recruiter application velocity)
- **Database / Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Local Mock Data Adapter Fallback
- **Deployment:** Vercel-ready serverless build configuration

---

## 📂 Architecture & Project Structure

```
campushire/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Modern marketing landing page
│   │   ├── login/page.tsx              # 1-click demo login & role selector
│   │   ├── dashboard/page.tsx          # Smart router directing to role dashboard
│   │   ├── student/
│   │   │   ├── dashboard/page.tsx      # Welcome, profile completion, metrics, recommendations
│   │   │   ├── jobs/page.tsx           # Multi-filter search & sortable job listings
│   │   │   ├── applications/page.tsx   # Applied jobs & interview schedule tracker
│   │   │   └── profile/page.tsx        # Academic profile editor with CGPA & resume URL
│   │   ├── recruiter/
│   │   │   ├── dashboard/page.tsx      # Recruiter metrics & applicant velocity chart
│   │   │   ├── jobs/page.tsx           # Active drives, job editing & close/reopen toggles
│   │   │   ├── jobs/new/page.tsx       # New job opening form with full validation
│   │   │   └── applications/page.tsx   # Candidate review, status update & interview notes
│   │   └── admin/
│   │       ├── dashboard/page.tsx      # Officer overview, branch offers & package charts
│   │       ├── students/page.tsx       # Student talent directory with CGPA filters
│   │       ├── jobs/page.tsx           # Campus-wide drives directory
│   │       └── applications/page.tsx   # All applications with exportable CSV report
│   ├── components/
│   │   ├── layout/                     # AppSidebar, DashboardHeader, MobileDrawer
│   │   ├── ui/                         # StatCard, ApplicationStatusBadge, EmptyState, Skeleton
│   │   ├── jobs/                       # JobCard, JobDetailModal, JobSearchBar, JobFilters, SortDropdown
│   │   ├── applications/               # ApplicationTable, CandidateDetailModal
│   │   ├── profile/                    # ProfileForm
│   │   ├── recruiter/                  # RecruiterTrendsChart
│   │   └── admin/                      # PlacementAnalyticsCharts
│   ├── context/
│   │   ├── AuthContext.tsx             # Active role, user switching & demo persistence
│   │   ├── DataContext.tsx             # Local state CRUD, eligibility validation & CSV exporter
│   │   └── ToastContext.tsx            # Fluid notification toast alerts
│   └── lib/
│       ├── types.ts                    # Strongly typed domain models
│       ├── sampleData.ts               # 14 jobs, 20 students, 16 applications (deterministic seed data)
│       ├── filterAndSort.ts            # Pure, reusable multi-filter and sorting functions
│       ├── utils.ts                    # Date formatters, initials, profile completion math
│       └── supabase/
│           ├── client.ts               # Supabase JS client configuration
│           └── server.ts
└── supabase/
    └── schema.sql                      # Production PostgreSQL DDL with RLS policies & indexes
```

---

## 🎯 Key Features Breakdown

### 1. Student Portal
- **Profile Strength Indicator:** Visual percentage score evaluating completeness of CGPA, graduation batch, branch, skills, and resume.
- **Dynamic Job Search & Filters:**
  - Real-time search across title, company, skills, and location.
  - Multi-select filters for Job Type (Full-time, Internship, Part-time), Cutoff CGPA, Graduation Batch (2025, 2026, 2027), Locations, and Skills.
  - Sorting by Newest, Oldest, Salary (High to Low / Low to High), Job Title (A-Z), Company (A-Z), and Application Deadline.
- **Automated Eligibility Engine:**
  - Blocks applications if student's CGPA is below the company's minimum cutoff.
  - Enforces batch graduation year restrictions.
  - Enforces hard prevention of duplicate applications per job.
  - Rejects expired deadlines.
- **Application Status Tracking:**
  - Real-time status badges: `Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`.

### 2. Recruiter Portal
- **Active Drive Management:** Publish new openings, edit existing descriptions/cutoffs, and toggle positions between `active` and `closed`.
- **Applicant Velocity Visualizations:** Recharts Area Chart displaying application volume and shortlist trends over time.
- **Candidate Evaluation:** Search applicants by name or skills, filter by status, sort by CGPA, inspect candidate resumes, add interview dates, and record recruiter feedback notes.

### 3. Placement Officer Portal
- **Consolidated Analytics:** Placement rates by engineering discipline (CSE, IT, ECE, AI&DS, EE, Mech), CTC compensation bracket distribution, and company drive status.
- **Student Talent Directory:** Searchable repository of registered students with filterable CGPA, branch, and graduation year.
- **One-Click CSV Export:** Generates clean, structured `.csv` reports of all applications for offline accreditation and institutional documentation.

---

## 🗄️ Database & Security Configuration (Supabase)

The production database schema is specified in [`supabase/schema.sql`](supabase/schema.sql).

### Tables:
1. `public.profiles`: Stores student, recruiter, and administrator accounts.
2. `public.companies`: Verified enterprise hiring entities.
3. `public.jobs`: Recruitment drive listings with cutoff thresholds and eligible branches.
4. `public.applications`: Submissions linked to students and jobs with unique constraint `(job_id, student_id)` to prevent duplicates.
5. `public.interviews`: Scheduled technical and HR interview rounds.

### Row Level Security (RLS) Policies:
- **Students** can only insert applications for themselves and view their own submissions.
- **Recruiters** can only edit and close jobs belonging to their authorized company.
- **Placement Officers** have audited institutional read/write permissions.

### Connecting Supabase (Optional):
Copy `.env.example` to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Run `supabase/schema.sql` in your Supabase SQL Editor. If these environment variables are omitted, CampusHire seamlessly falls back to the client-side local persistence adapter.

---

## 🚢 GitHub & Vercel Deployment Instructions

### 1. Push to GitHub:
```bash
git init
git add .
git commit -m "feat: complete CampusHire campus recruitment portal"
git branch -M main
git remote add origin https://github.com/<your-username>/campushire.git
git push -u origin main
```

### 2. Deploy to Vercel:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `campushire` repository.
4. Framework Preset will auto-detect **Next.js**.
5. *(Optional)* Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under **Environment Variables**. If omitted, it will automatically operate in Demo Mode.
6. Click **Deploy**. The build will complete in ~40 seconds.

---

## 🧪 Verification & Production Build Status

- **Production Build:** `npm run build` completed with code `0`. All 18 static routes generated cleanly.
- **Type Safety:** `npx tsc --noEmit` passed with 0 TypeScript errors.
- **Linting:** `npm run lint` passed with 0 ESLint warnings or errors.
- **Automated Workflow Test:** `node scripts/dist/scripts/test-workflow.js` passed all test cases for search, multi-filters, sorting, CGPA validation, duplicate prevention, and profile calculation.

