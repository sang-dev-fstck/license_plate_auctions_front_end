import { api } from "../../apis/apiSlice";

export type AuctionSessionDetail = {
    id: string;
    licensePlateNumber: string;
    status: string;
    currentPrice: number;
    currentLeaderName?: string;
    endTime: string;
};

export const auctionSessionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSessionDetail: builder.query<AuctionSessionDetail, string>({
            query: (sessionId) => `/auction-sessions/${sessionId}`,
            providesTags: (_result, _error, sessionId) => [
                { type: "SessionDetail", id: sessionId },
            ],
        }),
    }),
});

export const { useGetSessionDetailQuery } = auctionSessionApi;