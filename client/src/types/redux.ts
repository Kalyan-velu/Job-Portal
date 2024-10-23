import type { Role, User } from '@/types';
import type { CompanyType } from '@/zod-schema/company.schema';

export interface UserInitialState {
  user: User | null | undefined;
  token: null | string;
  role: Role | null;
}

export interface QueryResponse<T> {
  message: string;
  data: T;
  status: string;
}

export interface CompanySliceState {
  profile: CompanyType | null;
  selectedCompany: string | undefined;
}

export interface CompanyResponseType extends CompanyType {
  _id: string;
}
