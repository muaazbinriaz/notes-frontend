import { configureStore } from "@reduxjs/toolkit";
import { listApi } from "../features/lists/listApi";
import { noteApi } from "../features/lists/noteApi";
import { authApi } from "../features/lists/authApi";
import authReducer, { setCredentials } from "../features/auth/authSlice";
import { boardApi } from "../features/lists/boardApi";
import { automationApi } from "../features/lists/automationApi";

export const store = configureStore({
  reducer: {
    [listApi.reducerPath]: listApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    [automationApi.reducerPath]: automationApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(listApi.middleware)
      .concat(noteApi.middleware)
      .concat(authApi.middleware)
      .concat(boardApi.middleware)
      .concat(automationApi.middleware),
});
