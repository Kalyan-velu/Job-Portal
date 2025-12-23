import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils'
import type { User } from '@/types'
import type { QueryResponse } from '@/types/redux'
import type {
  LoginSchemaType,
  RegisterSchemaType,
} from '@/zod-schema/user.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['User'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        token: string
        token_type: string
        redirectTo?: string
        message?: string
        isVerified: boolean
      },
      Partial<LoginSchemaType>
    >({
      query: (body) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body,
        }
      },
      transformResponse: (
        response: QueryResponse<{
          token: string
          token_type: string
          redirectTo?: string
          message?: string
          isVerified: boolean
        }>,
      ) => {
        return response.data
      },
      transformErrorResponse,
    }),
    register: builder.mutation<void, RegisterSchemaType>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: QueryResponse<void>) => {
        return response.data
      },
      transformErrorResponse,
    }),
    getUser: builder.query<User | null, void>({
      query: () => '/user/me',
      transformResponse: (response: QueryResponse<User>) => {
        return response.data
      },
      transformErrorResponse,
      providesTags: ['User'],
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
      transformResponse: (response: QueryResponse<void>) => {
        return response.data
      },
      transformErrorResponse,
    }),
    resetPassword: builder.mutation<void, { password: string; token: string }>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      transformResponse: (response: QueryResponse<void>) => {
        return response.data
      },
      transformErrorResponse,
    }),
    resendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/resent-verification-email',
        method: 'POST',
      }),
      transformResponse: (response: QueryResponse<void>) => {
        return response.data
      },
      transformErrorResponse,
    }),
    verifyEmail: builder.mutation<{ verified: boolean }, string>({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: 'GET',
      }),
      transformResponse: (response: QueryResponse<{ verified: boolean }>) => {
        return response.data
      },
      transformErrorResponse,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      transformResponse: (response: QueryResponse<void>) => {
        return response.data
      },
      transformErrorResponse,
    }),
  }),
})

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useResendVerificationEmailMutation,
  useLogoutMutation,
} = userApi
