import type { Applicant as ApplicantI } from '@server/zod/applicant.schema'
import { Document, model, Schema, Types } from 'mongoose'

// Custom validators
const phoneValidator = {
  validator: (v: string) => /^\+?[1-9]\d{1,14}$/.test(v),
  message: 'Invalid phone number format',
}

const urlValidator = {
  validator: (v: string) => {
    try {
      new URL(v)
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false
    }
  },
  message: 'Invalid URL format',
}

const dateValidator = {
  validator: function (this: any, endDate: Date) {
    if (!endDate) return true
    const startDate = this.startDate
    return endDate >= startDate
  },
  message: 'End date cannot be before start date',
}

// Skill Schema
const skillSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [1, 'Skill name is required'],
  },
  description: {
    type: String,
    required: false,
    maxlength: [200, 'Skill description must be 200 characters or less'],
  },
})

// Experience Schema
const experienceSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: [2, 'Title must be at least 2 characters long'],
  },
  company: {
    type: String,
    required: true,
    minlength: [2, 'Company name must be at least 2 characters long'],
  },
  location: {
    type: String,
    required: true,
    minlength: [2, 'Location must be at least 2 characters long'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
    validate: dateValidator,
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description must be 500 characters or less'],
  },
})

// Education Schema
const educationSchema = new Schema({
  degree: {
    type: String,
    required: true,
    minlength: [2, 'Degree must be at least 2 characters long'],
  },
  institution: {
    type: String,
    required: true,
    minlength: [2, 'Institution name must be at least 2 characters long'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
    validate: dateValidator,
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description must be 500 characters or less'],
  },
})

interface ApplicantDoc extends Omit<ApplicantI, 'userId'>, Document {
  userId: Schema.Types.ObjectId | string
}

// Applicant Schema
const applicantSchema = new Schema<ApplicantDoc>({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: phoneValidator,
  },
  resumeLink: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  coverLetter: {
    type: String,
    required: false,
    maxlength: [1000, 'Cover letter must be 1000 characters or less'],
  },
  linkedin: {
    type: String,
    required: false,
    validate: urlValidator,
  },
  education: {
    type: [educationSchema],
    required: true,
    validate: {
      validator: (v: any[]) => v.length >= 1,
      message: 'At least one education entry is required',
    },
  },
  skills: {
    type: [skillSchema],
    required: true,
    validate: {
      validator: (v: any[]) => v.length >= 1,
      message: 'At least one skill is required',
    },
  },
  experiences: {
    type: [experienceSchema],
    required: false,
  },
})

// Create and export the Applicant model
export const Applicant = model<ApplicantDoc>('Applicant', applicantSchema)
