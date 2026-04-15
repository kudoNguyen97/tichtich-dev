import { z } from 'zod';
import { collectGoalDateIssues } from '@/utils/targetGoalDates';

export const goalSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Vui lòng nhập tên mục tiêu')
            .max(100, 'Tối đa 100 ký tự'),
        message: z
            .string()
            .min(1, 'Vui lòng nhập lời nhắn')
            .max(150, 'Tối đa 150 ký tự'),
        amount: z
            .number({ error: 'Vui lòng nhập số tiền' })
            .min(1, 'Số tiền phải lớn hơn 0'),
        wallet: z.string().min(1, 'Vui lòng chọn ví'),
        startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
        endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    })
    .superRefine((data, ctx) => {
        for (const issue of collectGoalDateIssues(
            data.startDate,
            data.endDate
        )) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: issue.message,
                path: [issue.path],
            });
        }
    });

export type GoalFormData = z.infer<typeof goalSchema>;
