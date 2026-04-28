import { useMutation, useQuery } from '@tanstack/react-query';
import { financeReportService } from '@/features/finance-reports/api/financeReport.service';
import { financeReportKeys } from '@/features/finance-reports/api/financeReport.keys';
import type { FinanceReportCheckParams } from '@/features/finance-reports/types/financeReport.type';

export function useExportWeeklyReport() {
    return useMutation({
        mutationFn: (profileId: string) =>
            financeReportService.exportWeeklyReport(profileId),
    });
}

export function useCheckFinanceReport(
    params: FinanceReportCheckParams,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: financeReportKeys.check(params),
        queryFn: () => financeReportService.checkReport(params),
        enabled: options?.enabled ?? Boolean(params.profileId),
    });
}
