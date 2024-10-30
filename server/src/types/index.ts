import type { Router } from 'express'
import type mongoose from 'mongoose'

export interface ModuleRouteConfig {
  prefix: string
  routes: Router[]
}

export type Role = 'admin' | 'employer' | 'applicant'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  phoneNumber: string
  applicantId: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export type Mongoose = typeof mongoose

export interface JobInterface {
  title: string
  description: string
  location: string
  companyId: string
  salaryRange?: string
  requirements: string[]
  responsibilites: string[]
  postedBy: string
}
