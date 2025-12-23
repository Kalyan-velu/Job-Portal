import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

export const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

if (!apiUrl && import.meta.env.DEV) {
  throw Error('Please add an api url (VITE_API_URL) in .env ')
}

export const baseQuery = (
  baseUrl?: string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQueryInstance = fetchBaseQuery({
    baseUrl: baseUrl ?? apiUrl,
  })

  return async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()

    let result = await baseQueryInstance(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire()

        try {
          const refreshResult = await baseQueryInstance(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions,
          )

          if (refreshResult.data) {
            // Retry the initial query
            result = await baseQueryInstance(args, api, extraOptions)
          } else {
            // Refresh failed - logout
            window.location.href = '/login'
          }
        } finally {
          release()
        }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock()
        result = await baseQueryInstance(args, api, extraOptions)
      }
    }

    return result
  }
}

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
): string => {
  if (
    'data' in response &&
    typeof response.data === 'object' &&
    response.data !== null
  ) {
    const data = response.data as {
      statuCode: number
      error?: string | { message: string } | unknown[]
      message?: string
    }

    // Handle detailed errors
    if (Array.isArray(data.error)) {
      return data.error
        .map((err) => {
          const message = (err as { msg: string }).msg || 'Invalid input'
          return `${message}`
        })
        .join(', ')
    }
    if ('error' in data && data.error) {
      if (typeof data.error !== 'string' && 'message' in data.error) {
        return data.error.message
      } else if (typeof data.error === 'string') {
        return data.error
      }
    }
    // Fallback for a single message
    if ('message' in data) {
      return data.message ?? 'Something went wrong'
    }
  } else if ('error' in response && response.error !== null) {
    if (
      'error' in response &&
      typeof response.error === 'object' &&
      'message' in response.error
    ) {
      //@ts-expect-error - Fix this
      return response.error.message
    }
    if (typeof response.error === 'object') {
      const data = response.error as Record<string, unknown>

      // Handle detailed errors
      if (Array.isArray(data.error)) {
        return data.error
          .map((err) => {
            const message = (err as { msg: string }).msg || 'Invalid input'
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
