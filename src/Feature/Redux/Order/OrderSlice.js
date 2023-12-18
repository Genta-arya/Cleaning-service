import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: [],
  reducers: {
    addToOrder: (state, action) => {
      return [...state, action.payload];
    },
    clearOrder: () => {
      return [];
    },
  },
});

export const { addToOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
