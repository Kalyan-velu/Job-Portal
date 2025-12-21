import { isRejectedWithValue, type Middleware, type MiddlewareAPI } from '@reduxjs/toolkit/react'
import { toast } from 'sonner'
import { type AppDispatch, type  RootState } from '@/store'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger:Middleware =
  // @ts-expect-error - Keep it like this to match function signature
  // @eslint-disable-next-line @typescript-eslint/no-unused-vars
  (api:MiddlewareAPI<AppDispatch,RootState>) => (next) => async (action) => {
    if (!action) return
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      // const _errorMessage =
      //   'data' in action.error
      //     ? (action.error.data as { message: string }).message
      //     : action.error.message
      toast.dismiss()
      if (action.payload && action.payload === 'Invalid Token') {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
      }
      if (
        action.payload &&
        //@ts-expect-error - Property is private
        action.payload?.status &&
        //@ts-expect-error - Property is private
        action?.payload?.status === 'FETCH_ERROR'
      ) {
        toast.error("Couldn't connect to server.")
      }

      // toast({
      //   variant: 'destructive',
      //   title: 'Async error!',
      //   description:
      //     e,
      // })
      // toast.warn({
      //   title: 'Async error!',
      //   message:
      //     'data' in action.error
      //       ? (action.error.data as { message: string }).message
      //       : action.error.message,
      // })
    }

    return next(action)
  }
//
// export const initialMiddleware: Middleware =
//   (store: MiddlewareAPI) => (next) => async (action) => {
//     return next(action)
//   }
