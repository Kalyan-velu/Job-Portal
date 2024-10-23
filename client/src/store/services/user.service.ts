import { baseQuery, transformErrorResponse } from '@/lib/rtk-utils';
import type { User } from '@/types';
import type { QueryResponse } from '@/types/redux';
import type {
  LoginSchemaType,
  RegisterSchemaType,
} from '@/zod-schema/user.schema';
import { createApi } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQuery(undefined),
  tagTypes: ['User'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        token: string;
        token_type: string;
        redirectTo?: string;
        message?: string;
      },
      Partial<LoginSchemaType>
    >({
      query: (body) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body,
        };
      },
      transformResponse: (
        response: QueryResponse<{
          token: string;
          token_type: string;
          redirectTo?: string;
          message?: string;
        }>
      ) => {
        return response.data;
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
        return response.data;
      },
      transformErrorResponse,
    }),
    getUser: builder.query<User | null, void>({
      query: () => '/user/me',
      transformResponse: (response: QueryResponse<User>) => {
        return response.data;
      },
      transformErrorResponse,
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserQuery } =
  userApi;
