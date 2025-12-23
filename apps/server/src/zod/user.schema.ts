import z from 'zod'

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
    message:
      'Password must contain at least one special character (e.g., !@#$%^&*).',
  })
  .regex(/^\S*$/, { message: 'Password must not contain spaces.' })

export const loginSchema = z.object({
  email: z.string(),
  password: passwordSchema,
})

export type LoginType = z.infer<typeof loginSchema>

export const roleSchema = z.enum(['company', 'employer', 'applicant'], {
  message: 'Role is needed',
})

export const baseUserSchema = z
  .object({
    phoneNumber: z.string().optional(),
    name: z.string({ message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    role: roleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type BaseUserRegisterSchemaType = z.infer<typeof baseUserSchema>
