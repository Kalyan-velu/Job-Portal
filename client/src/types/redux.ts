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
