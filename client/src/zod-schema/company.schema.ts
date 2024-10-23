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
  socialMedia: z.array(
    z.object({
      url: z.string().url({ message: 'Invalid URL format' }),
    })
  ),
  // createdBy: z.string({ message: 'Creator ID is required' }),
  estd: z
    .string({ message: "Establish year can't be empty." })
    .transform((value) => parseInt(value)),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const companySchemaFields = CompanySchema.keyof().options;

export type CompanySchemaFieldsType = typeof companySchemaFields;
export type CompanySchemaFieldType = CompanySchemaFieldsType[number];
export type CompanyType = z.infer<typeof CompanySchema>;
