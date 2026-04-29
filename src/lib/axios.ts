import axios from 'axios';
import type { AxiosError } from 'axios';
import { config } from '@/constants/config';
import { getOrCreateDeviceId } from './deviceId';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { getAuthToken } from '@/hooks/useGetAuthToke';

export const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
        'x-app-version': config.APP_VERSION,
        'x-app-name': config.APP_NAME,
        'x-platform': 'web',
    },
});

axiosInstance.interceptors.request.use(async (requestConfig) => {
    const token = await getAuthToken();
    const deviceId = getOrCreateDeviceId();

    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
    } else {
        delete requestConfig.headers.Authorization;
    }
    if (deviceId) {
        requestConfig.headers['x-device-id'] = deviceId;
    }
    return requestConfig;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);
