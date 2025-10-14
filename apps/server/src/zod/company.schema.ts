import z from 'zod';

export const CompanySchema = z.object({
  name: z.string({ message: 'Company name is required' }).min(5),
  industry: z.string({ message: 'Industry is required' }),
  siteUrl: z.string().url({ message: 'Invalid URL format' }),
  companySize: z.enum(['1-10', '1-50', '1-100', '1000<'], {
    errorMap: () => ({
      message:
        "Invalid company size. Choose from '1-10', '1-50', '1-100', or '1000<'",
    }),
  }),
  based: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => val ?? ''), // Optional based location
  description: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => val ?? ''), // Optional description
  socialMedia: z
    .array(
      z.string().url({ message: 'Each social media link must be a valid URL' }),
    )
    .optional()
    .nullable()
    .default([])
    .transform((val) => val ?? []), // Optional array for social media links
  // createdBy: z.string({ message: 'Creator ID is required' }),
  estd: z.number({ message: "Establish year can't be empty." }),
});

export type CompanyType = z.infer<typeof CompanySchema>;
