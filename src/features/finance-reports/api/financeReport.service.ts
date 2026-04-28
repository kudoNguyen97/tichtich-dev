import { apiClient } from '@/lib/apiClient';
import type {
    FinanceReportCheckData,
    FinanceReportCheckParams,
} from '@/features/finance-reports/types/financeReport.type';

export const financeReportService = {
    exportWeeklyReport: (profileId: string) =>
        apiClient.post<void>('/finance-reports', { profileId }),

    checkReport: (params: FinanceReportCheckParams) =>
        apiClient.get<FinanceReportCheckData>('/finance-reports/check', {
            params,
        }),
};
