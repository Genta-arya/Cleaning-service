// src/Feature/Redux/Product/ProductSlice.js

import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    categories: [], 
    selectedCategory: "",
    status: "idle",
    error: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const {
  setProducts,
  setCategories,
  setSelectedCategory,
  setError,
} = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.product.products;
export const selectCategories = (state) => state.product.categories; 
export const selectSelectedCategory = (state) =>
  state.product.selectedCategory;
export const selectProductsStatus = (state) => state.product.status;
export const selectProductsError = (state) => state.product.error;

export default productSlice.reducer;
