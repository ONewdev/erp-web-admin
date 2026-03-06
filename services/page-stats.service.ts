import { API_BASE } from '@/utils/config';

export interface StatsSummary {
    total_views: number;
    total_unique_users: number;
}

export interface TodayStats {
    today_views: number;
    today_unique: number;
}

export interface DailyTrend {
    stat_date: string;
    views: number;
    unique_users: number;
}

export interface PageBreakdown {
    page: string;
    total_views: number;
    total_unique_users: number;
}

export interface DeviceBreakdown {
    device_type: string;
    total_views: number;
    total_unique_users: number;
}

export interface StatsData {
    summary: StatsSummary;
    today: TodayStats;
    daily_trend: DailyTrend[];
    page_breakdown: PageBreakdown[];
    device_breakdown: DeviceBreakdown[];
}

export interface GetStatsResponse {
    status: string;
    message?: string;
    data: StatsData;
}

export interface CleanupStatsResponse {
    status: string;
    message?: string;
    data?: {
        deleted_count: number;
        days: number;
    };
}

/**
 * Fetches page statistics based on the requested date range
 * @param range The date range (e.g., '7', '30', '90', 'all')
 */
export const getPageStats = async (range: string): Promise<GetStatsResponse> => {
    const res = await fetch(`${API_BASE}/stats/index.php?range=${range}`, {
        credentials: 'include',
    });
    return await res.json();
};

/**
 * Cleans up old page stats
 * @param days Delete stats older than this many days
 */
export const cleanupPageStats = async (days: number): Promise<CleanupStatsResponse> => {
    const res = await fetch(`${API_BASE}/stats/cleanup.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days }),
        credentials: 'include',
    });
    return await res.json();
};
