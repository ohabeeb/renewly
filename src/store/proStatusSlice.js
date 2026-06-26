import { createSlice } from '@reduxjs/toolkit';

const proStatusSlice = createSlice({
  name: 'proStatus',
  initialState: { isPro: false },
  reducers: {
    setProStatus: (state, action) => {
      state.isPro = action.payload;
    },
  },
});

export const { setProStatus } = proStatusSlice.actions;
export const selectIsPro = (state) => state.proStatus.isPro;
export default proStatusSlice.reducer;