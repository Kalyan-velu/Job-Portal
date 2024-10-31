import {
  fetchBaseQuery,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'

export const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw Error('Please add an api url (VITE_API_URL) in .env ')
}

export const baseQuery = (baseUrl?: string) =>
  fetchBaseQuery({
    baseUrl: baseUrl ?? apiUrl,
    prepareHeaders: async (headers, { getState }) => {
      const sessionToken = sessionStorage.getItem('token')
      const localToken = localStorage.getItem('token')
      if (localToken || sessionToken) {
        headers.set('Authorization', `Bearer ${sessionToken ?? localToken}`)
      }
      return headers
    },
  })

/**
 * Converts a JSON object to FormData.
 * @param data - The JSON object to convert.user
 * @returns The resulting FormData instance.
 */
export function jsonToFormData(data: { [key: string]: any }): FormData {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]

    if (value === undefined || value === null) {
      // Skip undefined values
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof Blob) {
          formData.append(key, item)
        } else {
          formData.append(key, JSON.stringify(item))
        }
      })
    } else if (value instanceof Blob) {
      formData.append(key, value)
    } else if (typeof value === 'object') {
      // Handle nested objects
      for (const nestedKey in value) {
        if (Object.prototype.hasOwnProperty.call(value, nestedKey)) {
          const nestedValue = value[nestedKey]
          if (nestedValue === undefined) {
            // Skip undefined nested values
            continue
          }
          if (nestedValue instanceof Blob) {
            formData.append(`${key}[${nestedKey}]`, nestedValue)
          }
        }
      }
    } else {
      formData.append(key, value)
    }
  })

  return formData
}
export function queryFunction(data: Record<string, unknown | undefined>) {
  const searchParams = new URLSearchParams()
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'refetching' &&
        key !== 'queryArg'
      ) {
        searchParams.append(key, value?.toString() ?? '')
      }
    })
  }
  return `?${searchParams.toString()}`
}

export const transformErrorResponse = (
  response: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined,
  args: unknown,
): string => {
  console.debug('ℹ️ ~ file: rtk-utils.ts:96 ~ response:', response)
  if (
    'data' in response &&
    typeof response.data === 'object' &&
    response.data !== null
  ) {
    const data = response.data as Record<string, any>

    // Handle detailed errors
    if (Array.isArray(data.error)) {
      return data.error
        .map((err: any) => {
          // Format the error message
          const field = err.loc ? err.loc[1] : 'Unknown field'
          const message = err.msg || 'Invalid input'
          return `${message}`
        })
        .join(', ')
    }
    if ('error' in data) {
      if ('message' in data.error) {
        return data.error.message
      }
      return data.error
    }
    // Fallback for a single message
    if ('message' in data) {
      return data.message
    }
  } else if ('error' in response && response.error !== null) {
    if (
      'error' in response &&
      typeof response.error === 'object' &&
      'message' in response.error
    ) {
      return response.error.message
    }
    if (typeof response.error === 'object') {
      const data = response.error as Record<string, any>

      // Handle detailed errors
      if (Array.isArray(data.error)) {
        return data.error
          .map((err: any) => {
            // Format the error message
            const field = err.loc ? err.loc[1] : 'Unknown field'
            const message = err.msg || 'Invalid input'
            return `${message}`
          })
          .join(', ')
      }
    } else {
      return response.error
    }
  }
  return 'Something went wrong'
}
