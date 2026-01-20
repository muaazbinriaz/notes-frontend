import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery,
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes/getNotes",
      providesTags: ["Notes"],
      transformResponse: (response) => response.data,
    }),

    addNote: builder.mutation({
      query: (note) => ({
        url: "/notes/insert",
        method: "POST",
        body: { ...note, position: note.position },
      }),
      invalidatesTags: ["Notes"],
    }),

    deleteNote: builder.mutation({
      query: (id) => ({
        url: `/notes/deleteNote/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),

    editNote: builder.mutation({
      query: ({ id, updateNote }) => ({
        url: `notes/updateNote/${id}`,
        method: "PUT",
        body: updateNote,
      }),
      invalidatesTags: ["Notes"],
    }),

    moveNote: builder.mutation({
      query: ({ noteId, listId, position }) => ({
        url: `notes/move/${noteId}`,
        method: "PUT",
        body: { listId, position },
      }),
      async onQueryStarted(
        { noteId, listId, position },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          noteApi.util.updateQueryData("getNotes", undefined, (draft) => {
            const note = draft.find((n) => n._id === noteId);
            if (note) {
              note.listId = listId;
              note.position = position;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotesQuery,
  useAddNoteMutation,
  useDeleteNoteMutation,
  useEditNoteMutation,
  useMoveNoteMutation,
} = noteApi;
