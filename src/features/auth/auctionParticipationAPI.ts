import { api } from "../../apis/apiSlice";

export type JoinAuctionRequest = {
    auctionSessionId: string;
};

export type JoinAuctionResponse = {
    message?: string;
};

export const auctionParticipationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        joinAuction: builder.mutation<JoinAuctionResponse, JoinAuctionRequest>({
            query: (body) => ({
                url: "/auction-participations/join",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useJoinAuctionMutation } = auctionParticipationApi;
