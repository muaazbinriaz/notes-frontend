import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery,
  tagTypes: ["Boards"],
  endpoints: (builder) => ({
    createBoard: builder.mutation({
      query: (newBoard) => ({
        url: "/boards/create",
        method: "POST",
        body: newBoard,
      }),
      invalidatesTags: ["Boards"],
    }),

    getBoards: builder.query({
      query: () => "/boards/getBoards",
      providesTags: ["Boards"],
    }),
  }),
});

export const { useCreateBoardMutation, useGetBoardsQuery } = boardApi;
