import axios from 'axios';
import type { AxiosError } from 'axios';
import { config } from '@/constants/config';
import { getOrCreateDeviceId } from './deviceId';

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

axiosInstance.interceptors.request.use((requestConfig) => {
    const token = localStorage.getItem('access_token');
    const deviceId = getOrCreateDeviceId();
    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
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
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
