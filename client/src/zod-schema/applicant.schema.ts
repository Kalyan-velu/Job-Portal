import { z } from 'zod'

const DateSchema = z.coerce.date()

type DateContext = z.RefinementCtx & {
  parent?: { startDate?: Date } // This assumes that parent has startDate
}

const ExperienceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  company: z.string().min(2, 'Company name must be at least 2 characters long'),
  location: z.string().min(2, 'Location must be at least 2 characters long'),
  startDate: DateSchema,
  endDate: z
    .union([z.coerce.date(), z.null(), z.undefined()])
    .optional()
    .superRefine((endDate, ctx: DateContext) => {
      const parent = ctx.parent

      // If there's no parent or startDate, skip validation
      if (!parent || !parent.startDate) return true

      // If endDate is null/undefined, validation passes
      if (!endDate) return true

      const startDate = parent.startDate

      // Only validate if both dates exist
      if (endDate < startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be before start date',
        })
      }
    }),

  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
})

const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  description: z
    .string()
    .max(200, 'Skill description must be 200 characters or less')
    .optional(),
})

const EducationSchema = z.object({
  degree: z.string().min(2, 'Degree must be at least 2 characters long'),
  institution: z
    .string()
    .min(2, 'Institution name must be at least 2 characters long'),
  startDate: DateSchema,
  endDate: z
    .union([z.coerce.date(), z.null(), z.undefined()])
    .optional()
    .superRefine((endDate, ctx: DateContext) => {
      const parent = ctx.parent

      // If there's no parent or startDate, skip validation
      if (!parent || !parent.startDate) return true

      // If endDate is null/undefined, validation passes
      if (!endDate) return true

      const startDate = parent.startDate

      // Only validate if both dates exist
      if (endDate < startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be before start date',
        })
      }
    }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
})

export const ApplicantSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  resumeLink: z.string().url('Invalid URL format'),
  coverLetter: z
    .string()
    .max(1000, 'Cover letter must be 1000 characters or less')
    .optional(),
  linkedin: z.string().url('Invalid URL format').optional(),
  education: z
    .array(EducationSchema)
    .min(1, 'At least one education entry is required'),
  skills: z.array(SkillSchema).min(1, 'At least one skill is required'),
  experiences: z.array(ExperienceSchema).optional(),
})

export type Applicant = z.infer<typeof ApplicantSchema>
