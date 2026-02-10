import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery,
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getNotes: builder.query({
      providesTags: ["Notes"],
      query: (listId) => `/notes/getNotes?listId=${listId}`,
      transformResponse: (response) => response.data,
    }),

    addNote: builder.mutation({
      query: ({ title, listId, position, tags }) => ({
        url: "/notes/insert",
        method: "POST",
        body: { title, listId, position, tags },
      }),
      invalidatesTags: ({ listId }) => [{ type: "Notes", id: listId }],
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
        method: "PATCH",
        body: updateNote,
      }),
      invalidatesTags: ["Notes"],
    }),

    uploadImage: builder.mutation({
      query: ({ noteId, imageFile }) => {
        const formData = new FormData();
        formData.append("picture", imageFile);
        return {
          url: `notes/uploadImage/${noteId}`,
          method: "POST",
          body: formData,
        };
      },
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
        { dispatch, queryFulfilled, getState },
      ) {
        const allQueries = getState().noteApi.queries;
        let oldListId;
        let fullNote;

        for (const key in allQueries) {
          if (key.startsWith("getNotes")) {
            const notes = allQueries[key]?.data;
            if (Array.isArray(notes)) {
              const found = notes.find((n) => n._id === noteId);
              if (found) {
                oldListId = found.listId;
                fullNote = found;
                break;
              }
            }
          }
        }
        if (oldListId && oldListId !== listId) {
          dispatch(
            noteApi.util.updateQueryData("getNotes", oldListId, (draft) => {
              return draft.filter((n) => n._id !== noteId);
            }),
          );
        }
        const patch = dispatch(
          noteApi.util.updateQueryData("getNotes", listId, (draft) => {
            const note = draft.find((n) => n._id === noteId);
            if (note) {
              note.listId = listId;
              note.position = position;
            } else if (fullNote) {
              draft.push({ ...fullNote, listId, position });
            }
            draft.sort((a, b) => a.position - b.position);
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
  useUploadImageMutation,
} = noteApi;
