// discountSlice.js
import { createSlice } from '@reduxjs/toolkit';

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    amount: 0,
    isApplied: false,
  },
  reducers: {
    setDiscountAmount: (state, action) => {
      state.amount = action.payload;
      state.isApplied = true;
    },
    clearDiscountAmount: (state) => {
      state.amount = 0;
      state.isApplied = false;
    },
  },
});
const discountReducer = discountSlice.reducer;
export const { setDiscountAmount, clearDiscountAmount } = discountSlice.actions;
export default discountReducer;