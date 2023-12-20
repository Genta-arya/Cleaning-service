import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
 
  },
});

export const { setLoggedIn } = authSlice.actions;
export const selectIsAuthenticated = (state) => state.auth.isLoggedIn;
export default authSlice.reducer;
