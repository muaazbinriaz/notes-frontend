import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const listApi = createApi({
  reducerPath: "listApi",
  baseQuery,
  tagTypes: ["Lists"],
  endpoints: (builder) => ({
    getLists: builder.query({
      query: () => "/lists",
      providesTags: ["Lists"],
      transformResponse: (response) => response.data,
    }),

    addList: builder.mutation({
      query: ({ title, position }) => ({
        url: "/lists",
        method: "POST",
        body: { title, position },
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
    }),
  }),
});

export const {
  useGetListsQuery,
  useAddListMutation,
  useDeleteListMutation,
  useUpdateListOrderMutation,
} = listApi;
