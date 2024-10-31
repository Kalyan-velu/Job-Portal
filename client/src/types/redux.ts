import type { Role, User } from '@/types'
import type { CompanyType } from '@/zod-schema/company.schema'
import type { JobInterface } from '@/zod-schema/job.schema'

export interface UserInitialState {
  user: User | null | undefined
  token: null | string
  role: Role | null
}

export interface QueryResponse<T> {
  message: string
  data: T
  status: string
}

export interface CompanySliceState {
  profile: CompanyType | null
  selectedCompany: string | undefined
}

export interface CompanyResponseType extends CompanyType {
  _id: string
}

export interface Company {
  _id: string
  name: string
}

export interface PostedBy {
  _id: string
  name: string
  email: string
  id: string
}

export interface JobResponseType extends JobInterface {
  _id: string
  company: Company
  postedBy: PostedBy
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface PublicJobResponse {
  id: string // Unique identifier for the job
  title: string // Job title
  company: string // Company name
  companyId: string
  location: string // Job location
  type: string // Job type (e.g., Full-time, Part-time, Contract)
  salary: string // Salary range for the position
  postedDate: string // Date the job was posted (ISO format or string)
  description: string // Job description
  requirements: string[] // List of job requirements
  responsibilities: string[] // List of job responsibilities
}

export interface ApplicantApplication {
  id: string // ID of the application
  jobTitle: string // Title of the job
  company: { _id: string; name: string } // ID or name of the company
  status:
    | 'submitted'
    | 'under review'
    | 'interview scheduled'
    | 'offer extended'
    | 'rejected' // Application status
  note?: string
  appliedDate: string // Date when the application was submitted in YYYY-MM-DD format
}

// Applicant details
export interface Applicant {
  _id: string
  name: string
  email: string
}

// Job details
export interface Job {
  _id: string
  title: string
}

// Main application data
export interface JobApplicationEmployer {
  _id: string
  applicantId: Applicant
  jobId: Job
  applicationStatus:
    | 'submitted'
    | 'under review'
    | 'interview scheduled'
    | 'offer extended'
    | 'rejected'
  note?: string
  appliedAt: string
}

interface ContactInfo {
  phone: string | null // Phone can be null if not provided
  email: string | null // Email can be null if not provided
}

interface Education {
  degree: string
  institution: string
  startDate: string // ISO date string
  endDate?: string | null // Optional end date or null
  description?: string | null // Optional description
}

interface Skill {
  name: string
  description?: string | null // Optional description
}

interface Experience {
  title: string
  company: string
  location: string
  startDate: string // ISO date string
  endDate?: string | null // Optional end date or null
  description?: string | null // Optional description
}

interface JobApplication {
  jobTitle: string
  applicationStatus: string
  appliedAt: string // ISO date string
}

export interface ApplicantDetailsResponse {
  contactInfo: ContactInfo
  linkedinProfile: string | null // Optional LinkedIn profile link
  resumeLink: string | null // Optional resume link
  coverLetter: string | null // Optional cover letter text
  education: Education[]
  skills: Skill[]
  experiences: Experience[]
  jobApplication: JobApplication
}
