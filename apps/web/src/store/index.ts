import { companySlice } from '@/store/features/company.slice'
import { userSlice } from '@/store/features/user.slice'
import { rtkQueryErrorLogger } from '@/store/middleware/rtk.middleware'
import { applicantApi } from '@/store/services/applicant.service'
import { companyApi } from '@/store/services/company.service'
import { userApi } from '@/store/services/user.service'
import { combineReducers, configureStore, type UnknownAction, } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

const rootReducer = combineReducers({
  user: userSlice.reducer,
  company: companySlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [applicantApi.reducerPath]: applicantApi.reducer,
})

const appReducer = (state: never, action: UnknownAction) => {
  if (action.type === 'auth/logout') {
    state = undefined
  }
  return rootReducer(state, action)
}

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      applicantApi.middleware,
      companyApi.middleware,
      rtkQueryErrorLogger,
    ),
})

setupListeners(store.dispatch)
// Infer the type of store
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
