import { companySlice } from '@/store/features/company.slice';
import { userSlice } from '@/store/features/user.slice';
import { companyApi } from '@/store/services/company.service';
import { userApi } from '@/store/services/user.service';
import {
  combineReducers,
  configureStore,
  type UnknownAction,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
const rootReducer = combineReducers({
  user: userSlice.reducer,
  company: companySlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
});

const appReducer = (state: any, action: UnknownAction) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, companyApi.middleware),
});

setupListeners(store.dispatch);
// Infer the type of store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
