import { useEffect, useRef, useState } from "react";
import type { AuctionSessionRealtimeEvent } from "../types/auctionRealtime";

type UseAuctionSessionStreamParams = {
    sessionId?: string;
    onBidAccepted?: (event: AuctionSessionRealtimeEvent) => void;
    onSessionChanged?: (event: AuctionSessionRealtimeEvent) => void;
    onReconnect?: () => void;
};

export function useAuctionSessionStream({
    sessionId,
    onBidAccepted,
    onSessionChanged,
    onReconnect,
}: UseAuctionSessionStreamParams) {
    const [connected, setConnected] = useState(false);

    const hasOpenedOnceRef = useRef(false);

    const onBidAcceptedRef = useRef(onBidAccepted);
    const onSessionChangedRef = useRef(onSessionChanged);
    const onReconnectRef = useRef(onReconnect);

    useEffect(() => {
        onBidAcceptedRef.current = onBidAccepted;
    }, [onBidAccepted]);

    useEffect(() => {
        onSessionChangedRef.current = onSessionChanged;
    }, [onSessionChanged]);

    useEffect(() => {
        onReconnectRef.current = onReconnect;
    }, [onReconnect]);

    useEffect(() => {
        if (!sessionId) return;

        const baseUrl = import.meta.env.VITE_API_ENDPOINT;
        const streamUrl = `${baseUrl}/api/v1/auction-sessions/${sessionId}/stream`;

        const eventSource = new EventSource(streamUrl, {
            withCredentials: true,
        });

        eventSource.onopen = () => {
            setConnected(true);

            if (hasOpenedOnceRef.current) {
                onReconnectRef.current?.();
            }

            hasOpenedOnceRef.current = true;
        };

        eventSource.onerror = () => {
            setConnected(false);
            // EventSource tự reconnect, không tự tạo EventSource mới ở đây.
        };

        const handleBidAccepted = (message: MessageEvent) => {
            const event = JSON.parse(message.data) as AuctionSessionRealtimeEvent;
            onBidAcceptedRef.current?.(event);
        };

        const handleSessionChanged = (message: MessageEvent) => {
            const event = JSON.parse(message.data) as AuctionSessionRealtimeEvent;
            onSessionChangedRef.current?.(event);
        };

        eventSource.addEventListener("BID_ACCEPTED", handleBidAccepted);

        eventSource.addEventListener("SESSION_STARTED", handleSessionChanged);
        eventSource.addEventListener("SESSION_PAUSED", handleSessionChanged);
        eventSource.addEventListener("SESSION_RESUMED", handleSessionChanged);
        eventSource.addEventListener("SESSION_ENDED", handleSessionChanged);
        eventSource.addEventListener("SESSION_FAILED", handleSessionChanged);

        eventSource.addEventListener("HEARTBEAT", () => {
            // no-op
        });

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [sessionId]);

    return {
        connected,
    };
}