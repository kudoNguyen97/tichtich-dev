export type Granularity = 'weekly' | 'monthly';

export interface FinanceReportCheckParams {
    profileId: string;
    fromDate: string;
    toDate: string;
    granularity?: Granularity;
}

export type MetricUnit = 'currency' | 'percent' | 'times' | 'weeks' | 'days' | 'goals' | string;
export type MetricType = 'amount' | 'count' | 'percentage' | 'wallet' | 'goal' | string;

export interface MetricItem {
    label: string;
    value: number;
    unit: MetricUnit;
    type: MetricType;
    tag: string;
}

export interface SectionMetrics {
    primaryValue: number;
    primaryLabel: string;
    secondaryValue: number;
    secondaryLabel: string;
    items: MetricItem[];
}

export interface ReportSection {
    title: string;
    narrative: string;
    metrics: SectionMetrics;
}

export interface ReportSections {
    self_finance_management: ReportSection;
    spending_trend: ReportSection;
    goal_persistence: ReportSection;
    charity_sharing: ReportSection;
    progress_improvement: ReportSection;
    parental_engagement: ReportSection;
}

export interface ReportPayload {
    summary: string;
    sections: ReportSections;
    style_version: string;
}

export interface DataReport {
    id: string;
    profileId: string;
    periodStart: string;
    periodEnd: string;
    granularity: Granularity;
    status: string;
    payload: ReportPayload;
    rawMetrics: Record<string, unknown>;
    modelUsed: string;
    retryCount: number;
    generationMeta: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface FinanceReportCheckData {
    exists: boolean;
    profileId: string;
    fromDate: string;
    toDate: string;
    granularity: Granularity;
    dataReport: DataReport | null;
}
