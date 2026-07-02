import { api } from "../../apis/apiSlice";
import type { Pagination } from "../../types/Pagination";

export type AuctionSessionDetail = {
    id: string;
    licensePlateNumber: string;
    status: string;
    currentPrice: number;
    currentLeaderName?: string;
    endTime: string;
};

export type AuctionSessionStatus =
    | "SCHEDULED"
    | "ACTIVE"
    | "PAUSED"
    | "ENDED"
    | "FAILED"
    | "DRAFT"
    | "ENDING";

export type CustomerAuctionSession = {
    id: string;
    licensePlateNumber: string;
    startTime: string;
    endTime: string;
    status: AuctionSessionStatus;
    startingPrice: number;
    currentPrice: number;
    bidStepAmountSnapshot: number;
    categoryName: string;
    remainingSeconds?: number;
    tags: string[];
};

export type GetCustomerAuctionSessionsParams = {
    status?: AuctionSessionStatus;
    fromDate?: string;
    toDate?: string;
    plateNumber?: string;
    vehicleType?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: "ASC" | "DESC";
};

export type CustomerAuctionSessionsResponse = {
    data: CustomerAuctionSession[];
    pagination?: Pagination;
};

type CustomerAuctionSessionsRawResponse =
    | CustomerAuctionSession[]
    | {
        data?: CustomerAuctionSession[];
        items?: CustomerAuctionSession[];
        content?: CustomerAuctionSession[];
        totalItems?: number;
        pageSize?: number;
        totalPages?: number;
        currentPage?: number;
        pagination?: Pagination;
    };

const normalizeCustomerAuctionSessions = (
    response: CustomerAuctionSessionsRawResponse
): CustomerAuctionSessionsResponse => {
    if (Array.isArray(response)) {
        return { data: response };
    }

    const data = response.data ?? response.items ?? response.content ?? [];
    const pagination = response.pagination ?? (
        response.totalItems != null &&
            response.pageSize != null &&
            response.totalPages != null &&
            response.currentPage != null
            ? {
                totalItems: response.totalItems,
                pageSize: response.pageSize,
                totalPages: response.totalPages,
                currentPage: response.currentPage,
            }
            : undefined
    );

    return { data, pagination };
};

export const auctionSessionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCustomerAuctionSessions: builder.query<
            CustomerAuctionSessionsResponse,
            GetCustomerAuctionSessionsParams | void
        >({
            query: (params) => {
                const body: GetCustomerAuctionSessionsParams = { ...(params ?? {}) };

                return {
                    url: "/auction-sessions/customer",
                    method: "POST",
                    body,
                };
            },
            transformResponse: normalizeCustomerAuctionSessions,
            providesTags: ["AuctionSessions"],
        }),

        getSessionDetail: builder.query<AuctionSessionDetail, string>({
            query: (sessionId) => `/auction-sessions/${sessionId}`,
            providesTags: (_result, _error, sessionId) => [
                { type: "SessionDetail", id: sessionId },
            ],
        }),
    }),
});

export const { useGetCustomerAuctionSessionsQuery, useGetSessionDetailQuery } = auctionSessionApi;
