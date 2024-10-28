import { z } from "zod";

export const jobTypeEnum = z.enum([
  "full-time",
  "part-time",
  "contractual",
  "freelance",
  "temporary",
  "internship",
  "apprenticeship",
  "volunteer",
]);

export const jobTypeList = jobTypeEnum.options;

export type JobType = typeof jobTypeList;

export const JobSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),

  type: jobTypeEnum,

  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters long" })
    .max(100, { message: "Location cannot exceed 100 characters" }),

  salaryRange: z.string().optional(),

  requirements: z
    .array(
      z.string().min(2, {
        message: "Each requirement must be at least 2 characters long",
      }),
    )
    .min(1, { message: "At least one requirement is required" })
    .optional(),

  responsibilites: z
    .array(
      z.string().min(2, {
        message: "Each responsibility must be at least 2 characters long",
      }),
    )
    .min(1, { message: "At least one responsibility is required" })
    .optional(),
});

// For TypeScript inference
export type JobInterface = z.infer<typeof JobSchema>;
