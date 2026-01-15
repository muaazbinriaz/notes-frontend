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
      query: (title) => ({
        url: "/lists",
        method: "POST",
        body: { title },
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
  }),
});

export const { useGetListsQuery, useAddListMutation, useDeleteListMutation } =
  listApi;
