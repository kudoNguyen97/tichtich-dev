import type { FinanceReportCheckParams } from '@/features/finance-reports/types/financeReport.type';

export const financeReportKeys = {
    all: ['finance-reports'] as const,
    check: (params: FinanceReportCheckParams) =>
        [...financeReportKeys.all, 'check', params] as const,
};
