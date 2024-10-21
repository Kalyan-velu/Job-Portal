import z from 'zod';

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long.' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one numeric digit.',
  })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character.',
  })
  .regex(/^\S*$/, { message: 'Password must not contain spaces.' });

export const loginSchema = z.object({
  email: z.string(),
  password: passwordSchema,
});

export type LoginType = z.infer<typeof loginSchema>;

export const roleSchema = z.enum(['company', 'employer', 'applicant'], {
  message: 'Role is needed',
});

export const baseUserSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8),
    role: roleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type BaseUserRegisterSchemaType = z.infer<typeof baseUserSchema>;

export const companySchema = baseUserSchema.and(
  z.object({
    role: z.enum(['company']),
    companyName: z.string().min(2, { message: 'Company name is too short' }),
    companyAddress: z.string().optional(),
    companyWebsite: z
      .string()
      .url({ message: 'Invalid website URL' })
      .optional(),
  }),
);

export const employerSchema = baseUserSchema.and(
  z.object({
    role: z.enum(['employer']),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    jobTitle: z.string().min(1, { message: 'Job title is required' }),
    companyID: z.string(),
  }),
);
export type EmployerSchema = z.infer<typeof employerSchema>;

export const applicantSchema = baseUserSchema.and(
  z.object({
    role: z.enum(['applicant']),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    resumeLink: z.string().url({ message: 'Invalid resume URL' }).optional(),
  }),
);
export type ApplicantSchemaType = z.infer<typeof applicantSchema>;

export const registerSchema = baseUserSchema.and(
  z.union([
    z.object({ role: z.literal('company') }).and(companySchema),
    z.object({ role: z.literal('employer') }).and(employerSchema),
    z.object({ role: z.literal('applicant') }).and(applicantSchema),
  ]),
);

export type RegisterSchemaType = z.infer<typeof registerSchema>;
