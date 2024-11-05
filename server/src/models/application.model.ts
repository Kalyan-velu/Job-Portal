import { dateValidator } from '@server/lib/utils'
import { Document, model, Schema, Types } from 'mongoose'

interface JobApplicationDoc extends Document {
  companyId: Types.ObjectId
  applicantId: Types.ObjectId
  jobId: Types.ObjectId
  resumeLink: string
  coverLetter?: string
  contactDetails: {
    phone: string
    email: string
  }
  linkedin?: string
  skills: Array<{ name: string; description?: string }>
  experiences?: Array<{
    title: string
    company: string
    location: string
    startDate: Date
    endDate?: Date
    description?: string
  }>
  education: Array<{
    degree: string
    institution: string
    startDate: Date
    endDate?: Date
    description?: string
  }>
  applicationStatus:
    | 'submitted'
    | 'under review'
    | 'interview scheduled'
    | 'offer extended'
    | 'rejected'
  appliedAt: Date
  note?: string
}

// Job Application Schema
const jobApplicationSchema = new Schema<JobApplicationDoc>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true,
    index: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  resumeLink: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    maxlength: 1000,
  },
  contactDetails: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  linkedin: {
    type: String,
    validate: {
      validator: (v: string) => {
        try {
          new URL(v)
          return true
        } catch {
          return false
        }
      },
      message: 'Invalid URL format',
    },
  },
  skills: [
    {
      name: { type: String, required: true },
      description: { type: String, maxlength: 200 },
    },
  ],
  experiences: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, validate: dateValidator },
      description: { type: String, maxlength: 500 },
    },
  ],
  education: [
    {
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, validate: dateValidator },
      description: { type: String, maxlength: 500 },
    },
  ],
  applicationStatus: {
    type: String,
    enum: [
      'submitted',
      'under review',
      'interview scheduled',
      'offer extended',
      'rejected',
    ],
    default: 'submitted',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
})

export const JobApplication = model<JobApplicationDoc>(
  'JobApplication',
  jobApplicationSchema,
)
