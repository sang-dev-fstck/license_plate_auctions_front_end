import { Alert, Button, Card, Form, InputNumber, List, Space, Spin, Tag, Typography, message } from "antd";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSessionDetailQuery } from "../features/auth/auctionSessionAPI";
import { useJoinAuctionMutation } from "../features/auth/auctionParticipationAPI";
import { useGetBidHistoryQuery, usePlaceBidMutation, type BidHistoryItem } from "../features/auth/bidAPI";
import type { AuctionSessionRealtimeEvent } from "../types/auctionRealtime";
import { useAuctionSessionStream } from "../hooks/useAuctionSessionStream";
import { useCallback, useEffect, useState } from "react";

const { Title, Text } = Typography;

function formatVnd(value?: number) {
    if (value == null) return "N/A";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
}

function parseBackendDateTime(value?: string) {
    if (!value) return undefined;

    const trimmedValue = value.trim();
    const hasTimezone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(trimmedValue);
    const dateValue = hasTimezone ? trimmedValue : `${trimmedValue}Z`;
    const timestamp = new Date(dateValue).getTime();

    return Number.isNaN(timestamp) ? undefined : timestamp;
}

function formatLocalDateTime(value?: string) {
    const timestamp = parseBackendDateTime(value);

    if (timestamp == null) {
        return value ?? "N/A";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "medium",
    }).format(timestamp);
}

function formatCountdown(endTime?: string, now = Date.now()) {
    if (!endTime) return "N/A";

    const endTimestamp = parseBackendDateTime(endTime);

    if (endTimestamp == null) {
        return endTime;
    }

    const remainingSeconds = Math.max(0, Math.floor((endTimestamp - now) / 1000));

    if (remainingSeconds === 0) {
        return "Ended";
    }

    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m remaining`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s remaining`;
    }

    return `${minutes}m ${seconds}s remaining`;
}

type ApiErrorData = {
    message?: string;
    error?: string;
};

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error !== null && "status" in error;
}

function getApiErrorMessage(error: unknown, fallback: string) {
    if (!isFetchBaseQueryError(error)) {
        return fallback;
    }

    const data = error.data as ApiErrorData | undefined;
    return data?.message ?? data?.error ?? fallback;
}

function isUnauthorizedError(error: unknown) {
    return isFetchBaseQueryError(error) && (error.status === 401 || error.status === 403);
}

const AuctionSessionDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const EMPTY_BIDS: BidHistoryItem[] = [];
    const {
        data: session,
        isLoading: isSessionLoading,
        error: sessionError,
        refetch: refetchSessionDetail,
    } = useGetSessionDetailQuery(id!, {
        skip: !id,
    });

    const {
        data: bidsData,
        isLoading: isBidsLoading,
        error: bidsError,
        refetch: refetchBidHistory,
    } = useGetBidHistoryQuery(id!, {
        skip: !id,
    });
    const bids = bidsData ?? EMPTY_BIDS;
    const [placeBid, { isLoading: isPlacingBid }] = usePlaceBidMutation();
    const [joinAuction, { isLoading: isJoiningAuction }] = useJoinAuctionMutation();
    const [now, setNow] = useState(() => Date.now());
    const [realtimeSession, setRealtimeSession] = useState(session);
    const [realtimeBids, setRealtimeBids] = useState(bids);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        setRealtimeSession(session);
    }, [session]);

    useEffect(() => {
        if (bidsData) {
            setRealtimeBids(bids);
        }
    }, [bidsData]);

    const handleBidAccepted = useCallback(
        (event: AuctionSessionRealtimeEvent) => {
            setRealtimeSession((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    currentPrice: event.currentPrice ?? prev.currentPrice,
                    currentLeaderName: event.currentLeaderNameSnapshot ?? prev.currentLeaderName,
                    endTime: event.endTime ?? prev.endTime,
                    status: event.status ?? prev.status,
                };
            });

            if (!event.bidId) {
                refetchBidHistory();
                return;
            }

            setRealtimeBids((prev) => {
                const exists = prev.some((bid) => bid.id === event.bidId);

                if (exists) {
                    return prev;
                }

                const newBid = {
                    id: event.bidId as string,
                    auctionSessionId: event.auctionSessionId,
                    amount: event.bidAmount ?? event.currentPrice ?? 0,
                    bidderName: event.bidderNameSnapshot ?? "Unknown",
                    createdAt: event.bidTime ?? event.occurredAt ?? new Date().toISOString(),
                };

                return [newBid, ...prev];
            });
        },
        [refetchBidHistory]
    );

    const handleSessionChanged = useCallback((event: AuctionSessionRealtimeEvent) => {
        setRealtimeSession((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                currentPrice: event.currentPrice ?? prev.currentPrice,
                currentLeaderName: event.currentLeaderNameSnapshot ?? prev.currentLeaderName,
                endTime: event.endTime ?? prev.endTime,
                status: event.status ?? prev.status,
            };
        });
    }, []);

    const handleReconnect = useCallback(() => {
        refetchSessionDetail();
        refetchBidHistory();
    }, [refetchSessionDetail, refetchBidHistory]);

    const { connected } = useAuctionSessionStream({
        sessionId: id,
        onBidAccepted: handleBidAccepted,
        onSessionChanged: handleSessionChanged,
        onReconnect: handleReconnect,
    });

    const handleJoinAuction = async () => {
        if (!id) return;

        try {
            const response = await joinAuction({
                auctionSessionId: id,
            }).unwrap();

            message.success(response.message ?? "Joined auction successfully.");
        } catch (error: unknown) {
            if (isUnauthorizedError(error)) {
                message.error("Please login before joining this auction.");
                navigate("/login");
                return;
            }

            message.error(getApiErrorMessage(error, "Failed to join auction."));
        }
    };

    const handlePlaceBid = async (values: { amount: number }) => {
        if (!id) return;

        try {
            const response = await placeBid({
                auctionSessionId: id,
                amount: values.amount,
            }).unwrap();

            message.success(response.message ?? "Đặt giá thành công");

            if (!connected) {
                refetchSessionDetail();
                refetchBidHistory();
            }

        } catch (error: unknown) {
            console.error(error);
            if (isUnauthorizedError(error)) {
                message.error("Please login before placing a bid.");
                navigate("/login");
                return;
            }

            message.error(getApiErrorMessage(error, "Đặt giá thất bại"));
        }
    };

    const displaySession = realtimeSession;
    const displayBids = realtimeBids;

    if (isSessionLoading) {
        return <Spin />;
    }

    if (sessionError) {
        return <Alert type="error" message="Failed to load session detail" />;
    }

    if (!displaySession) {
        return <Alert type="warning" message="Session not found" />;
    }

    const canBid = displaySession.status === "ACTIVE";
    const isScheduledSession = displaySession.status === "SCHEDULED";
    const endTimeCountdown = formatCountdown(displaySession.endTime, now);

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Card>
                    <Space direction="vertical" size={8}>
                        <Title level={3} style={{ margin: 0 }}>
                            {displaySession.licensePlateNumber}
                        </Title>

                        <Space>
                            <Text>Status:</Text>
                            <Tag color={canBid ? "green" : "default"}>{displaySession.status}</Tag>

                            <Tag color={connected ? "green" : "red"}>
                                SSE: {connected ? "Connected" : "Disconnected"}
                            </Tag>
                        </Space>

                        <Text>Current price: {formatVnd(displaySession.currentPrice)}</Text>
                        <Text>
                            Current leader: {displaySession.currentLeaderName ?? "No leader"}
                        </Text>
                        <Space direction="vertical" size={2}>
                            <Text>
                                Time remaining: <Text strong>{endTimeCountdown}</Text>
                            </Text>
                            <Text type="secondary">Ends at: {formatLocalDateTime(displaySession.endTime)}</Text>
                        </Space>
                    </Space>
                </Card>

                {isScheduledSession ? (
                    <Card title="Join Auction">
                        <Space direction="vertical" size={12} style={{ width: "100%" }}>
                            <Text>
                                Join this auction and complete the deposit step before it starts.
                            </Text>

                            <Button
                                type="primary"
                                loading={isJoiningAuction}
                                onClick={handleJoinAuction}
                            >
                                Join Auction / Place Deposit
                            </Button>
                        </Space>
                    </Card>
                ) : (
                    <Card title="Place Bid">
                        <Form layout="inline" onFinish={handlePlaceBid}>
                            <Form.Item
                                name="amount"
                                rules={[{ required: true, message: "Amount is required" }]}
                            >
                                <InputNumber
                                    min={0}
                                    step={1000000}
                                    placeholder="Bid amount"
                                    style={{ width: 220 }}
                                    disabled={!canBid}
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isPlacingBid}
                                disabled={!canBid}
                            >
                                Place Bid
                            </Button>
                        </Form>

                        {!canBid && (
                            <Alert
                                style={{ marginTop: 12 }}
                                type="info"
                                message="Session is not active. Bidding is disabled."
                            />
                        )}
                    </Card>
                )}

                <Card title="Bid History">
                    {bidsError && <Alert type="error" message="Failed to load bid history" />}

                    {isBidsLoading ? (
                        <Spin />
                    ) : (
                        <List
                            dataSource={displayBids}
                            locale={{ emptyText: "No bids yet" }}
                            renderItem={(bid) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={formatVnd(bid.amount)}
                                        description={
                                            <>
                                                <div>
                                                    Bidder: {bid.bidderName ?? "Unknown"}
                                                </div>
                                                <div>Time: {bid.createdAt}</div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Space>
        </div>
    );
};

export default AuctionSessionDetailPage;
