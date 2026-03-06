import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'auth.emailRequired').email('auth.emailInvalid'),
    password: z.string().min(8, 'auth.passwordMin'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
