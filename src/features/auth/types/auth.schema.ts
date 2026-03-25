import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { error: 'auth.emailRequired' })
        .pipe(z.email({ error: 'auth.emailInvalid' })),
    password: z.string().min(6, { error: 'auth.passwordMin' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        fullName: z.string().min(1, { error: 'auth.fullNameRequired' }),
        phone: z.string().optional(),
        email: z
            .string()
            .min(1, { error: 'auth.emailRequired' })
            .pipe(z.email({ error: 'auth.emailInvalid' })),
        password: z.string().min(6, { error: 'auth.passwordMin' }),
        confirmPassword: z
            .string()
            .min(1, { error: 'auth.confirmPasswordRequired' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'auth.passwordMismatch',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, 'Vui lòng nhập mật khẩu hiện tại'),
        newPassword: z
            .string()
            .min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
        confirmNewPassword: z
            .string()
            .min(1, 'Vui lòng xác nhận mật khẩu mới'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['confirmNewPassword'],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
