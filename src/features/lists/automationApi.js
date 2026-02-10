import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../redux/baseQuery";

export const automationApi = createApi({
  reducerPath: "automationApi",
  baseQuery,
  tagTypes: ["Automation"],
  endpoints: (builder) => ({
    createAutomationRule: builder.mutation({
      query: (rule) => ({
        url: "/automation",
        method: "POST",
        body: rule,
      }),
      invalidatesTags: ["Automation"],
    }),
  }),
});

export const { useCreateAutomationRuleMutation } = automationApi;
