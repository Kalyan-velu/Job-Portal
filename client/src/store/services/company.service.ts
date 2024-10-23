import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils';
import type { CompanyResponseType, QueryResponse } from '@/types/redux';
import type { CompanyType } from '@/zod-schema/company.schema';
import { createApi } from '@reduxjs/toolkit/query/react';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    createCompanyy: builder.mutation<string, CompanyType>({
      query: (body: CompanyType) => ({
        url: '/company/create',
        method: 'POST',
        body,
      }),
      transformResponse: (response: QueryResponse<void>, meta, arg) => {
        return response.message;
      },
      transformErrorResponse,
    }),
    getMyCompany: builder.query<CompanyResponseType[], void>({
      query: () => ({
        url: `/company/my`,
      }),
      transformResponse: (res: QueryResponse<CompanyResponseType>) => {
        return res.data;
      },
      transformErrorResponse,
      providesTags: (res, error, id) =>
        res ? [{ type: 'Company', id: res._id }] : [],
    }),
    getCompanyById: builder.query<CompanyResponseType, string>({
      query: (id) => ({
        url: `/company/my/${id}`,
      }),
      transformResponse: (res: QueryResponse<CompanyResponseType>) => {
        return res.data;
      },
      transformErrorResponse,
      providesTags: (res, error, id) => [{ type: 'Company', id }],
    }),
    updateMyCompany: builder.query<CompanyResponseType, CompanyResponseType>({
      query: (body) => ({ url: '/company/my', method: 'PUT', body }),
    }),
  }),
});

export const {
  useCreateCompanyyMutation,
  useGetMyCompanyQuery,
  useGetCompanyByIdQuery,
} = companyApi;
