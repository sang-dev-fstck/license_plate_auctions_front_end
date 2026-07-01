import { api } from "../../apis/apiSlice";

export type BidHistoryItem = {
    id: string;
    auctionSessionId: string;
    amount: number;
    bidderName?: string;
    createdAt: string;
};

export type PlaceBidRequest = {
    auctionSessionId: string;
    amount: number;
};

export type PlaceBidResponse = {
    bidId: string;
    auctionSessionId: string;
    licensePlateNumber: string;
    bidAmount: number;
    currentPrice: number;
    endTime: string;
    message: string;
};

export const bidApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBidHistory: builder.query<BidHistoryItem[], string>({
            query: (sessionId) => `/auction-sessions/${sessionId}/bids`,
            providesTags: (_result, _error, sessionId) => [
                { type: "BidHistory", id: sessionId },
            ],
        }),

        placeBid: builder.mutation<PlaceBidResponse, PlaceBidRequest>({
            query: (body) => ({
                url: "/bids",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useGetBidHistoryQuery, usePlaceBidMutation } = bidApi;