export type Role = 'admin' | 'employer' | 'applicant';

export interface User {
  name: string;
  avatar?: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber: string | null;
  applicantId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
