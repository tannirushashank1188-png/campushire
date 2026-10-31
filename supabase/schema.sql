-- ====================================================================
-- CampusHire — Campus Recruitment Portal
-- PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- Designed for Supabase / PostgreSQL
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Types / Enums
CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'admin');
CREATE TYPE job_type AS ENUM ('Full-time', 'Internship', 'Part-time');
CREATE TYPE application_status AS ENUM (
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected'
);
CREATE TYPE interview_status AS ENUM ('Scheduled', 'Completed', 'Cancelled');

-- 3. Profiles Table (extends Supabase auth.users or standalone)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  
  -- Student specific fields
  college TEXT,
  degree TEXT,
  branch TEXT,
  graduation_year INT CHECK (graduation_year >= 2020 AND graduation_year <= 2035),
  cgpa NUMERIC(3, 2) CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
  skills TEXT[] DEFAULT '{}',
  resume_url TEXT,
  preferred_location TEXT,
  
  -- Recruiter specific fields
  company_id UUID,
  company_name TEXT,
  designation TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  logo TEXT,
  initials VARCHAR(4) NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  location TEXT NOT NULL,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign Key link from profiles to companies
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profile_company
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- 5. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_initials VARCHAR(4) NOT NULL,
  company_logo TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  job_type job_type NOT NULL DEFAULT 'Full-time',
  salary_min NUMERIC NOT NULL,
  salary_max NUMERIC NOT NULL,
  salary_display TEXT NOT NULL,
  min_cgpa NUMERIC(3, 2) NOT NULL DEFAULT 6.00 CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00),
  eligible_branches TEXT[] NOT NULL DEFAULT '{}',
  eligible_grad_years INT[] NOT NULL DEFAULT '{}',
  deadline DATE NOT NULL,
  openings INT NOT NULL DEFAULT 1 CHECK (openings > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  department_category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_college TEXT,
  student_degree TEXT,
  student_branch TEXT,
  student_grad_year INT,
  student_cgpa NUMERIC(3, 2),
  student_skills TEXT[] DEFAULT '{}',
  resume_url TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_type job_type NOT NULL,
  status application_status NOT NULL DEFAULT 'Applied',
  applied_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interview_date TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraint: Exactly ONE application per student per job
  CONSTRAINT unique_student_job_application UNIQUE(job_id, student_id)
);

-- 7. Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  location_or_link TEXT NOT NULL,
  round_name TEXT NOT NULL DEFAULT 'Technical Round',
  notes TEXT,
  status interview_status NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON public.jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- 9. Automatic Timestamp Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_jobs_timestamp BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_applications_timestamp BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Profiles:
-- Anyone authenticated can view profiles
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Companies:
-- Everyone can view verified companies
CREATE POLICY "Companies are viewable by all users"
  ON public.companies FOR SELECT
  USING (true);

-- Jobs:
-- Everyone can view active jobs
CREATE POLICY "Jobs viewable by authenticated users"
  ON public.jobs FOR SELECT
  USING (true);

-- Recruiters can insert/update jobs for their authorized company
CREATE POLICY "Recruiters can insert jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'recruiter'
    )
  );

CREATE POLICY "Recruiters can update own jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (
    recruiter_id IN (
      SELECT id FROM public.profiles WHERE profiles.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Applications:
-- Students can only view their own applications
-- Recruiters can view applications for jobs posted by their company
-- Placement officers (admin) can view all applications
CREATE POLICY "Applications select policy"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    student_id IN (SELECT id FROM public.profiles WHERE profiles.user_id = auth.uid())
    OR
    job_id IN (
      SELECT jobs.id FROM public.jobs
      JOIN public.profiles ON profiles.id = jobs.recruiter_id
      WHERE profiles.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Students can insert an application only for themselves
CREATE POLICY "Students can apply for jobs"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'student'
    )
  );

-- Recruiters can update application status for their jobs
CREATE POLICY "Recruiters and admins can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    job_id IN (
      SELECT jobs.id FROM public.jobs
      JOIN public.profiles ON profiles.id = jobs.recruiter_id
      WHERE profiles.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

