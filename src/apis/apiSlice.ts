import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStoredCsrfToken } from "../utils/csrf";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_ENDPOINT}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const csrfToken = getStoredCsrfToken();

      if (csrfToken) {
        headers.set("X-XSRF-TOKEN", csrfToken);
      }

      return headers;
    }
  }),

  tagTypes: ["SessionDetail", "BidHistory"],
  endpoints: () => ({}),
});