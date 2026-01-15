import { configureStore } from "@reduxjs/toolkit";
import { listApi } from "../features/lists/listApi";
import { noteApi } from "../features/lists/noteApi";
import { authApi } from "../features/lists/authApi";
import authReducer, { setCredentials } from "../features/auth/authSlice";
// force rebuild

export const store = configureStore({
  reducer: {
    [listApi.reducerPath]: listApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(listApi.middleware)
      .concat(noteApi.middleware)
      .concat(authApi.middleware),
});

const storedAuth = localStorage.getItem("auth");
if (storedAuth) {
  const parsed = JSON.parse(storedAuth);
  store.dispatch(setCredentials(parsed));
}
