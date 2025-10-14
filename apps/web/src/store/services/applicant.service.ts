import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils'
import type {
  ApplicantApplication,
  PublicJobResponse,
  QueryResponse,
} from '@/types/redux'
import type { Applicant } from '@/zod-schema/applicant.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const applicantApi = createApi({
  reducerPath: 'applicantApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['Public-Jobs', 'Applied-JobIds', 'Applications', 'Applicant'],
  endpoints: (builder) => ({
    getApplicantProfile: builder.query<Applicant, void>({
      query: () => '/applicant/',
      transformResponse: (res: QueryResponse<Applicant>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: ['Applicant'],
    }),
    updateOrCreateApplicant: builder.mutation<void, Applicant>({
      query: (body) => ({
        url: '/applicant/update',
        method: 'POST',
        body,
      }),
      transformErrorResponse,
      invalidatesTags: ['Applicant'],
    }),
    getJobs: builder.query<PublicJobResponse[], void>({
      query: () => '/jobs',
      transformResponse: (res: QueryResponse<PublicJobResponse[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res) => {
        if (!res) return [{ type: 'Public-Jobs' as const, id: 'LIST' }]
        return [
          { type: 'Public-Jobs' as const, id: 'LIST' },
          ...res.map((j) => ({ type: 'Public-Jobs' as const, id: j.id })),
        ]
      },
    }),
    myApplications: builder.query<ApplicantApplication[], void>({
      query: () => ({
        url: '/application/l/applied',
      }),
      transformResponse: (res: QueryResponse<ApplicantApplication[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res) => {
        if (!res) return [{ type: 'Applications' as const, id: 'LIST' }]
        return [
          { type: 'Applications' as const, id: 'LIST' },
          ...res.map((j) => ({ type: 'Applications' as const, id: j.id })),
        ]
      },
    }),
    appliedJobIds: builder.query<string[], void>({
      query: () => ({
        url: '/application/list/ids/applied',
      }),
      transformResponse: (res: QueryResponse<string[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res) => {
        if (!res) return [{ type: 'Applied-JobIds' as const, id: 'LIST' }]
        return [
          { type: 'Applied-JobIds' as const, id: 'LIST' },
          ...res.map((j) => ({ type: 'Applied-JobIds' as const, id: j })),
        ]
      },
    }),
    applyJob: builder.mutation<
      void,
      { companyId: string; jobId: string; coverLetter?: string }
    >({
      query: (body) => ({ url: '/application/apply', method: 'POST', body }),
      transformErrorResponse,
      async onQueryStarted({ jobId }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          applicantApi.util.updateQueryData(
            'appliedJobIds',
            undefined,
            (drafts) => {
              drafts.push(jobId)
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
  }),
})

export const {
  useGetJobsQuery,
  useGetApplicantProfileQuery,
  useUpdateOrCreateApplicantMutation,
  useMyApplicationsQuery,
  useAppliedJobIdsQuery,
  useApplyJobMutation,
} = applicantApi
