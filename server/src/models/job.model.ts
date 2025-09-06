import { jobTypeList, type JobInterface } from '../zod/job.schema'
import { model, Schema, type Document, type ObjectId } from 'mongoose'

interface JobDocument
  extends Omit<JobInterface, 'company' | 'postedBy'>,
    Document {
  company: string | ObjectId
  postedBy: string | ObjectId
  isArchived: boolean
}

const jobSchema = new Schema<JobDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: jobTypeList, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    salaryRange: { type: String, required: false },
    requirements: [{ type: String, required: true }],
    isArchived: { type: Boolean, default: false },
    responsibilites: [{ type: String, required: true }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v // Remove __v field
        return ret
      },
    },
  },
)

export const Job = model<JobDocument>('Job', jobSchema)
