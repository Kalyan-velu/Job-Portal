import type { Router } from 'express'
import type mongoose from 'mongoose'

export interface ModuleRouteConfig {
  prefix: string;
  routes: Router[];
}

export type Role = 'admin' | 'employer' | 'applicant';

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role;

  applicantId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Applicant {
  userId:string
  phone: string;
  resumeLink: string;
  coverLetter?: string;
  linkedin?: string;
  education: Education[];
  skills: Skill[];
  experiences: Experience[];
}

export interface Experience {
  title: string;
  company: string;
  location: string; // Can be a city, state, or country
  startDate: Date;
  endDate?: Date; // If still working, this can be optional
  description?: string; // Brief about the role or responsibilities
}

export interface Skill {
  name: string;
  description?: string; // Optional skill description
}

export interface Education {
  degree: string; // e.g., "Bachelor's in Computer Science"
  institution: string; // Name of the school or university
  startDate: Date;
  endDate?: Date; // Optional if education is ongoing
  description?: string; // Optional to mention any achievements or activities
}

export interface Company {
  name: string;
  industry: string;
  siteUrl: string;
  companySize: '1-10' | '1-50' | '1-100' | '1000<';
  based: string;
  description: string;
  socialMedia: string[];
  createdBy: string;
}

export type Mongoose = typeof mongoose;