import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setLoggedIn , setRole} = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isLoggedIn;
export const selectIsRole = (state) => state.auth.role;
export default authSlice.reducer;
