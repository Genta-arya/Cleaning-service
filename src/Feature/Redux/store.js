
import { configureStore } from "@reduxjs/toolkit";
import OrderSlice from "./Order/OrderSlice";
import AuthSlice from "./Auth/AuthSlice";
import ProductSlice from "./Product/ProductSlice";


export const store = configureStore({
  reducer: {
  
    order: OrderSlice,
    auth: AuthSlice,
    product: ProductSlice,
  },
});
