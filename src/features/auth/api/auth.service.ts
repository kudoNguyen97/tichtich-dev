import { apiClient } from '@/lib/apiClient';
import type {
    LoginPayload,
    LoginResponse,
    Profile,
    SignupPayload,
    User,
    UserSettings,
} from '@/features/auth/types/auth.type';

export const authService = {
    login: (payload: LoginPayload) =>
        apiClient.post<LoginResponse>('/auth/login', payload),

    me: () => apiClient.get<User>('/me'),

    meSettings: () => apiClient.get<UserSettings>('/me/settings'),

    updateMeSettings: (payload: Partial<UserSettings>) =>
        apiClient.post<UserSettings>('/me/settings', payload),

    meProfiles: () => apiClient.get<Profile[]>('/me/profiles'),

    logout: () => apiClient.post<void>('/auth/logout'),

    signUp: (payload: SignupPayload) =>
        apiClient.post<any>('/auth/signup', payload),
};
