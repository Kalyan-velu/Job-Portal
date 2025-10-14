import type { CompanySliceState } from '@/types/redux';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: CompanySliceState = {
  profile: null,
  selectedCompany: undefined,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    companySelected: (state, { payload }: PayloadAction<string>) => {
      state.selectedCompany = payload;
    },
  },
});

export const { companySelected } = companySlice.actions;
