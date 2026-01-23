import { createSlice } from "@reduxjs/toolkit";
import { boardApi } from "../lists/boardApi";
import { listApi } from "../lists/listApi";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;

export const logout = () => (dispatch) => {
  dispatch(clearAuth());
  dispatch(boardApi.util.resetApiState());
  dispatch(listApi.util.resetApiState());
};

export default authSlice.reducer;
