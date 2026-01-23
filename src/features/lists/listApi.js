import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const listApi = createApi({
  reducerPath: "listApi",
  baseQuery,
  tagTypes: ["Lists"],
  endpoints: (builder) => ({
    getLists: builder.query({
      query: (boardId) => `/lists?boardId=${boardId}`,
      providesTags: ["Lists"],
      refetchOnMountOrArgChange: true,
      transformResponse: (response) => response.data,
    }),

    addList: builder.mutation({
      query: ({ title, position, boardId }) => ({
        url: "/lists",
        method: "POST",
        body: { title, position, boardId },
      }),
      invalidatesTags: ["Lists"],
    }),

    deleteList: builder.mutation({
      query: (id) => ({
        url: `/lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lists"],
    }),

    updateListOrder: builder.mutation({
      query: (lists) => ({
        url: "/lists/reorder",
        method: "PUT",
        body: { lists },
      }),
      invalidatesTags: ["Lists"],
    }),
  }),
});

export const {
  useGetListsQuery,
  useAddListMutation,
  useDeleteListMutation,
  useUpdateListOrderMutation,
} = listApi;
