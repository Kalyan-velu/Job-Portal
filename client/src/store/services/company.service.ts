import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils'
import type {
  ApplicantDetailsResponse,
  CompanyResponseType,
  JobApplicationEmployer,
  JobResponseType,
  QueryResponse,
} from '@/types/redux'
import type { CompanyType } from '@/zod-schema/company.schema'
import type { JobInterface, UpdateJobInterface } from '@/zod-schema/job.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['Company', 'Job', 'Archived-Job', 'Applications', 'Applicant'],
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
              { type: 'Company' as const, id: 'LIST' },
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
    updateMyCompany: builder.mutation<CompanyResponseType, CompanyType>({
      query: (body) => ({ url: '/company/my', method: 'PUT', body }),
    }),
    getCompanyJobs: builder.query<
      JobResponseType[],
      'all' | 'archived' | 'active'
    >({
      query: (status) => ({
        url: `/job/private/status/${status}`,
      }),
      transformResponse: (res: QueryResponse<JobResponseType[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res) =>
        res
          ? [
              { type: 'Job' as const, id: 'LIST' },
              ...res.map((j) => ({ type: 'Job' as const, id: j._id })),
            ]
          : [{ type: 'Job' as const, id: 'LIST' }],
    }),

    deleteJob: builder.mutation<
      void,
      { id: string; context: 'all' | 'archived' | 'active' }
    >({
      query: (id) => ({
        url: `/job/private/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
      async onQueryStarted({ id, context }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getCompanyJobs',
            context,
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

      invalidatesTags: (_, _e, { id }) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    updateJob: builder.mutation<void, UpdateJobInterface & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/job/private/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformErrorResponse,
      invalidatesTags: ['Job'],
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
    archiveJob: builder.mutation<
      void,
      { id: string; context: 'all' | 'archived' | 'active' }
    >({
      query: ({ id }) => ({ url: `/job/private/archive/${id}`, method: 'PUT' }),
      async onQueryStarted({ id, context }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getCompanyJobs',
            context,
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
    unarchiveJob: builder.mutation<
      void,
      { id: string; context: 'all' | 'archived' | 'active' }
    >({
      query: ({ id }) => ({
        url: `/job/private/unarchive/${id}`,
        method: 'PUT',
      }),
      async onQueryStarted({ id, context }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'getCompanyJobs',
            context,
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
    companyApplications: builder.query<JobApplicationEmployer[], void>({
      query: () => ({
        url: `/company/applications`,
      }),
      transformResponse: (res: QueryResponse<JobApplicationEmployer[]>) => {
        return res.data
      },
      transformErrorResponse,
      providesTags: (res) =>
        res
          ? [
              { type: 'Applications' as const, id: 'LIST' },
              ...res.map((j) => ({ type: 'Applications' as const, id: j._id })),
            ]
          : [{ type: 'Applications' as const, id: 'LIST' }],
    }),
    getApplicantDetails: builder.query<
      ApplicantDetailsResponse,
      { applicationId: string }
    >({
      query: ({ applicationId }) => ({
        url: `/company/applications/applicant/${applicationId}`,
      }),
      transformResponse: (res: QueryResponse<ApplicantDetailsResponse>) => {
        return res.data
      },
      providesTags: (_, _e, { applicationId }) => [
        { type: 'Applicant', id: applicationId },
      ],
    }),
    updateApplicationStatus: builder.mutation<
      void,
      {
        newStatus:
          | 'submitted'
          | 'under review'
          | 'interview scheduled'
          | 'offer extended'
          | 'rejected'
        applicationId: string
        note?:string
      }
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/company/applications/${applicationId}`,
        method: 'PUT',
        body,
      }),
      async onQueryStarted(
        { applicationId, newStatus },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          companyApi.util.updateQueryData(
            'companyApplications',
            undefined,
            (draft) => {
              // Update the draft directly without reassigning it
              return draft.map((application) => {
                if (application._id === applicationId) {
                  return { ...application, applicationStatus: newStatus }
                }
                return application
              })
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
  useCreateCompanyyMutation,
  useGetMyCompanyQuery,
  useUpdateMyCompanyMutation,
  useCompanyApplicationsQuery,
  useGetCompanyByIdQuery,
  useGetCompanyJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useCreateJobMutation,
  useArchiveJobMutation,
  useUpdateApplicationStatusMutation,
  useGetApplicantDetailsQuery,
  useUnarchiveJobMutation,
} = companyApi
