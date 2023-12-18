
import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from "./Order/OrderSlice";


export const store = configureStore({
  reducer: {
  
    order: OrderSlice,
  },
});
