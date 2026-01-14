import { configureStore } from "@reduxjs/toolkit";
import { listApi } from "../features/lists/ListApi";
import { noteApi } from "../features/lists/noteApi";
import { authApi } from "../features/lists/authApi";

export const store = configureStore({
  reducer: {
    [listApi.reducerPath]: listApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(listApi.middleware)
      .concat(noteApi.middleware)
      .concat(authApi.middleware),
});
