"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.applicantSchema = exports.employerSchema = exports.companySchema = exports.baseUserSchema = exports.roleSchema = exports.loginSchema = exports.passwordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.passwordSchema = zod_1.default
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
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string(),
    password: exports.passwordSchema,
});
exports.roleSchema = zod_1.default.enum(['company', 'employer', 'applicant'], {
    message: 'Role is needed',
});
exports.baseUserSchema = zod_1.default
    .object({
    email: zod_1.default.string().email({ message: 'Invalid email address' }),
    password: zod_1.default
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: zod_1.default.string().min(8),
    role: exports.roleSchema,
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.companySchema = exports.baseUserSchema.and(zod_1.default.object({
    role: zod_1.default.enum(['company']),
    companyName: zod_1.default.string().min(2, { message: 'Company name is too short' }),
    companyAddress: zod_1.default.string().optional(),
    companyWebsite: zod_1.default
        .string()
        .url({ message: 'Invalid website URL' })
        .optional(),
}));
exports.employerSchema = exports.baseUserSchema.and(zod_1.default.object({
    role: zod_1.default.enum(['employer']),
    firstName: zod_1.default.string().min(1, { message: 'First name is required' }),
    lastName: zod_1.default.string().min(1, { message: 'Last name is required' }),
    jobTitle: zod_1.default.string().min(1, { message: 'Job title is required' }),
    companyID: zod_1.default.string(),
}));
exports.applicantSchema = exports.baseUserSchema.and(zod_1.default.object({
    role: zod_1.default.enum(['applicant']),
    firstName: zod_1.default.string().min(1, { message: 'First name is required' }),
    lastName: zod_1.default.string().min(1, { message: 'Last name is required' }),
    resumeLink: zod_1.default.string().url({ message: 'Invalid resume URL' }).optional(),
}));
exports.registerSchema = exports.baseUserSchema.and(zod_1.default.union([
    zod_1.default.object({ role: zod_1.default.literal('company') }).and(exports.companySchema),
    zod_1.default.object({ role: zod_1.default.literal('employer') }).and(exports.employerSchema),
    zod_1.default.object({ role: zod_1.default.literal('applicant') }).and(exports.applicantSchema),
]));
