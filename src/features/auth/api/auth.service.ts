import { apiClient } from '@/lib/apiClient';
import type {
    LoginPayload,
    LoginResponse,
    SignupPayload,
    User,
} from '../types/auth.type';

export const authService = {
    login: (payload: LoginPayload) =>
        apiClient.post<LoginResponse>('/auth/login', payload),

    me: () => apiClient.get<User>('/auth/me'),

    logout: () => apiClient.post<void>('/auth/logout'),

    signUp: (payload: SignupPayload) =>
        apiClient.post<any>('/auth/signup', payload),
};
