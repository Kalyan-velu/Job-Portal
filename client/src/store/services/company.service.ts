import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils'
import type {
  CompanyResponseType,
  JobResponseType,
  QueryResponse,
} from '@/types/redux'
import type { CompanyType } from '@/zod-schema/company.schema'
import type { JobInterface } from '@/zod-schema/job.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['Company', 'Job', 'Archived-Job'],
  endpoints: (builder) => ({
    createCompanyy: builder.mutation<string, CompanyType>({
      query: (body: CompanyType) => ({
        url: '/company/create',
        method: 'POST',
        body,
      }),
      transformResponse: (response: QueryResponse<void>, meta, arg) => {
        return response.message
      },
      transformErrorResponse,
    }),
    getMyCompany: builder.query<CompanyResponseType[], void>({
      query: () => ({
        url: `/company/my`,
      }),
      transformResponse: (res: QueryResponse<CompanyResponseType[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res, error, id) =>
        res
          ? [
              { type: 'Company', id: 'LIST' },
              ...res.map((c) => ({ type: 'Company' as const, id: c._id })),
            ]
          : [],
    }),
    getCompanyById: builder.query<CompanyResponseType, string>({
      query: (id) => ({
        url: `/company/my/${id}`,
      }),
      transformResponse: (res: QueryResponse<CompanyResponseType>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res, error, id) => [{ type: 'Company', id }],
    }),
    updateMyCompany: builder.query<CompanyResponseType, CompanyResponseType>({
      query: (body) => ({ url: '/company/my', method: 'PUT', body }),
    }),
    getCompanyJobs: builder.query<JobResponseType[], void>({
      query: () => ({
        url: '/job/private/',
      }),
      transformResponse: (res: QueryResponse<JobResponseType[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res, error) =>
        res
          ? [
              { type: 'Job' as const, id: 'LIST' },
              ...res.map((j) => ({ type: 'Job' as const, id: j._id })),
            ]
          : [{ type: 'Job' as const, id: 'LIST' }],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/job/private/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getCompanyJobs',
            undefined,
            (draft) => {
              // Update the draft directly without reassigning it
              const updated = draft.filter((job) => job._id !== id)
              draft = { ...updated }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },

      invalidatesTags: (_, _e, id) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    createJob: builder.mutation<void, JobInterface>({
      query: (data) => ({
        url: '/job/private/create',
        method: 'POST',
        body: data,
      }),
      transformErrorResponse,
      invalidatesTags: ['Job'],
    }),
    archiveJob: builder.mutation<void, string>({
      query: (id) => ({ url: `/job/private/archive/${id}`, method: 'PUT' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getCompanyJobs',
            undefined,
            (draft) => {
              // Mutate the draft directly to remove the job with the specified id
              return draft.filter((job) => job._id !== id)
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    unarchiveJob: builder.mutation<void, string>({
      query: (id) => ({ url: `/job/private/unarchive/${id}`, method: 'PUT' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getAllArchivedJob',
            undefined,
            (draft) => {
              // Mutate the draft directly to remove the job with the specified id
              return draft.filter((job) => job._id !== id)
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
    getAllArchivedJob: builder.query<JobResponseType[], void>({
      query: () => ({
        url: '/job/private/status/archived',
      }),
      transformResponse: (res: QueryResponse<JobResponseType[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res, error) =>
        res
          ? [
              { type: 'Archived-Job' as const, id: 'LIST' },
              ...res.map((j) => ({ type: 'Archived-Job' as const, id: j._id })),
            ]
          : [{ type: 'Archived-Job' as const, id: 'LIST' }],
    }),
  }),
})

export const {
  useCreateCompanyyMutation,
  useGetMyCompanyQuery,

  useGetCompanyByIdQuery,
  useGetCompanyJobsQuery,

  useGetAllArchivedJobQuery,
  useDeleteJobMutation,
  useCreateJobMutation,
  useArchiveJobMutation,
  useUnarchiveJobMutation,
} = companyApi
