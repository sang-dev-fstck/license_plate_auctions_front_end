import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Empty,
    Input,
    Pagination,
    Row,
    Select,
    Space,
    Spin,
    Tabs,
    Tag,
    Typography,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useGetCustomerAuctionSessionsQuery,
    type AuctionSessionStatus,
    type CustomerAuctionSession,
} from "../features/auth/auctionSessionAPI";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

type CustomerTabStatus = "ACTIVE" | "ENDING" | "SCHEDULED" | "PAUSED" | "ENDED";
type SortOption = {
    label: string;
    value: string;
    sortBy: string;
    sortDir: "ASC" | "DESC";
};

const STATUS_TABS: { label: string; value: CustomerTabStatus }[] = [
    { label: "Active", value: "ACTIVE" },
    { label: "Ending", value: "ENDING" },
    { label: "Upcoming", value: "SCHEDULED" },
    { label: "Paused", value: "PAUSED" },
    { label: "Ended", value: "ENDED" },
];

const SORT_OPTIONS: SortOption[] = [
    { label: "Newest first", value: "startTime_DESC", sortBy: "startTime", sortDir: "DESC" },
    { label: "Ending soon", value: "endTime_ASC", sortBy: "endTime", sortDir: "ASC" },
    { label: "Price high to low", value: "currentPrice_DESC", sortBy: "currentPrice", sortDir: "DESC" },
    { label: "Price low to high", value: "currentPrice_ASC", sortBy: "currentPrice", sortDir: "ASC" },
];

function formatVnd(value?: number) {
    if (value == null) return "N/A";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDateTime(value?: string) {
    if (!value) return "N/A";

    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : value;
}

function formatRemaining(seconds?: number) {
    if (seconds == null || seconds <= 0) return "Ending soon";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${Math.max(minutes, 1)}m left`;
}

function getStatusColor(status: AuctionSessionStatus) {
    switch (status) {
        case "ACTIVE":
            return "green";
        case "ENDING":
            return "volcano";
        case "SCHEDULED":
            return "blue";
        case "PAUSED":
            return "gold";
        case "ENDED":
            return "default";
        case "FAILED":
            return "red";
        case "DRAFT":
            return "purple";
        default:
            return "default";
    }
}

function getCtaLabel(status: AuctionSessionStatus) {
    switch (status) {
        case "ACTIVE":
        case "ENDING":
            return "Join auction";
        case "ENDED":
            return "View result";
        case "SCHEDULED":
        case "PAUSED":
        default:
            return "View detail";
    }
}

const AuctionSessionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState<CustomerTabStatus>("ACTIVE");
    const [plateNumber, setPlateNumber] = useState("");
    const [plateSearch, setPlateSearch] = useState("");
    const [dateRange, setDateRange] = useState<RangePickerProps["value"]>(null);
    const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const activeSort = SORT_OPTIONS.find((option) => option.value === sortValue) ?? SORT_OPTIONS[0];

    const queryParams = useMemo(
        () => ({
            status: activeStatus,
            plateNumber: plateSearch.trim() || undefined,
            fromDate: dateRange?.[0]?.startOf("day").toISOString(),
            toDate: dateRange?.[1]?.endOf("day").toISOString(),
            page,
            size,
            sortBy: activeSort.sortBy,
            sortDir: activeSort.sortDir,
        }),
        [activeSort.sortBy, activeSort.sortDir, activeStatus, dateRange, page, plateSearch, size]
    );

    const { data, isFetching, isLoading, error, refetch } = useGetCustomerAuctionSessionsQuery(queryParams);
    const sessions = data?.data ?? [];
    const pagination = data?.pagination;
    const totalItems = pagination?.totalItems ?? sessions.length;
    const currentPage = pagination?.currentPage ?? page;
    const pageSize = pagination?.pageSize ?? size;

    const handleStatusChange = (status: string) => {
        setActiveStatus(status as CustomerTabStatus);
        setPage(0);
    };

    const handleSearch = (value: string) => {
        setPlateSearch(value);
        setPage(0);
    };

    const handleDateRangeChange: RangePickerProps["onChange"] = (value) => {
        setDateRange(value);
        setPage(0);
    };

    const handleSortChange = (value: string) => {
        setSortValue(value);
        setPage(0);
    };

    const handlePaginationChange = (nextPage: number, nextSize: number) => {
        setPage(nextPage);
        setSize(nextSize);
    };

    const renderSessionCard = (session: CustomerAuctionSession) => (
        <Col xs={24} md={12} xl={8} key={session.id}>
            <Card
                hoverable
                style={{ height: "100%", borderRadius: 8 }}
                styles={{ body: { height: "100%", display: "flex", flexDirection: "column", gap: 16 } }}
            >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                    <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                        <div>
                            <Title level={3} style={{ margin: 0, letterSpacing: 0 }}>
                                {session.licensePlateNumber}
                            </Title>
                            <Text type="secondary">{session.categoryName}</Text>
                        </div>

                        <Tag color={getStatusColor(session.status)}>{session.status}</Tag>
                    </Space>

                    {(session.status === "ACTIVE" || session.status === "ENDING") && (
                        <Tag color={session.status === "ENDING" ? "volcano" : "green"}>
                            {formatRemaining(session.remainingSeconds)}
                        </Tag>
                    )}
                </Space>

                <Row gutter={[12, 12]}>
                    <Col span={12}>
                        <Text type="secondary">Current price</Text>
                        <div>
                            <Text strong>{formatVnd(session.currentPrice)}</Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Starting price</Text>
                        <div>
                            <Text strong>{formatVnd(session.startingPrice)}</Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Bid step</Text>
                        <div>
                            <Text>{formatVnd(session.bidStepAmountSnapshot)}</Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Ends</Text>
                        <div>
                            <Text>{formatDateTime(session.endTime)}</Text>
                        </div>
                    </Col>
                </Row>

                {session.tags.length > 0 && (
                    <Space size={[4, 4]} wrap>
                        {session.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </Space>
                )}

                <Button
                    type={session.status === "ACTIVE" || session.status === "ENDING" ? "primary" : "default"}
                    block
                    style={{ marginTop: "auto" }}
                    onClick={() => navigate(`/auction-session/${session.id}`)}
                >
                    {getCtaLabel(session.status)}
                </Button>
            </Card>
        </Col>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fb", padding: 24 }}>
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Space direction="vertical" size={4}>
                    <Title level={2} style={{ margin: 0, letterSpacing: 0 }}>
                        Auction Sessions
                    </Title>
                    <Text type="secondary">Find and join license plate auctions.</Text>
                </Space>

                <Card style={{ borderRadius: 8 }}>
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        <Tabs
                            activeKey={activeStatus}
                            items={STATUS_TABS.map((tab) => ({ key: tab.value, label: tab.label }))}
                            onChange={handleStatusChange}
                        />

                        <Row gutter={[12, 12]} align="middle">
                            <Col xs={24} md={10} lg={9}>
                                <Input.Search
                                    allowClear
                                    placeholder="Search license plate"
                                    value={plateNumber}
                                    onChange={(event) => setPlateNumber(event.target.value)}
                                    onSearch={handleSearch}
                                />
                            </Col>
                            <Col xs={24} md={8} lg={7}>
                                <RangePicker
                                    style={{ width: "100%" }}
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                />
                            </Col>
                            <Col xs={24} md={6} lg={5}>
                                <Select
                                    style={{ width: "100%" }}
                                    value={sortValue}
                                    options={SORT_OPTIONS.map(({ label, value }) => ({ label, value }))}
                                    onChange={handleSortChange}
                                />
                            </Col>
                            <Col xs={24} lg={3}>
                                <Button block onClick={() => refetch()}>
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    </Space>
                </Card>

                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message="Failed to load auction sessions"
                        action={<Button onClick={() => refetch()}>Try again</Button>}
                    />
                )}

                <Spin spinning={isLoading || isFetching}>
                    {!error && sessions.length === 0 ? (
                        <Card style={{ borderRadius: 8 }}>
                            <Empty description="No auction sessions found" />
                        </Card>
                    ) : (
                        <Row gutter={[16, 16]}>{sessions.map(renderSessionCard)}</Row>
                    )}
                </Spin>

                {!error && totalItems > 0 && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalItems}
                            showSizeChanger
                            pageSizeOptions={[9, 18, 27]}
                            onChange={handlePaginationChange}
                        />
                    </div>
                )}
            </Space>
        </div>
    );
};

export default AuctionSessionsPage;
