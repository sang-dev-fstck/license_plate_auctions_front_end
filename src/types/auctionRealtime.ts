export type AuctionSessionRealtimeEventType =
  | "CONNECTED"
  | "HEARTBEAT"
  | "BID_ACCEPTED"
  | "SESSION_STARTED"
  | "SESSION_PAUSED"
  | "SESSION_RESUMED"
  | "SESSION_ENDED"
  | "SESSION_FAILED";

export type AuctionSessionRealtimeEvent = {
  type: AuctionSessionRealtimeEventType;
  auctionSessionId: string;

  currentPrice?: number;
  currentLeaderNameSnapshot?: string;
  endTime?: string;
  status?: string;

  bidId?: string;
  bidAmount?: number;
  bidderNameSnapshot?: string;
  bidTime?: string;

  occurredAt?: string;
};