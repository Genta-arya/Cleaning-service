
import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from "./Order/OrderSlice";
import AuthSlice from "./Auth/AuthSlice";


export const store = configureStore({
  reducer: {
  
    order: OrderSlice,
    auth: AuthSlice,
  },
});
