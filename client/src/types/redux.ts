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
  status: 'submitted' | 'pending' | 'interviewed' | 'rejected' | 'offered' // Application status
  appliedDate: string // Date when the application was submitted in YYYY-MM-DD format
}
