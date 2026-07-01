import { api } from '../../apis/apiSlice'
type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = unknown;

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;