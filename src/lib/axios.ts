import axios from 'axios';
import type { AxiosError } from 'axios';
import { config } from '@/constants/config';
import { getOrCreateDeviceId } from './deviceId';
import dayjs from 'dayjs';
import { showError } from './toast';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

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

    const timeExpiredStr = localStorage.getItem('time_expired');

    if (timeExpiredStr) {
        // Nếu lưu dạng số ms thì parseInt, nếu lưu dạng string thì dùng dayjs
        let timeExpired: number;
        if (/^\d+$/.test(timeExpiredStr)) {
            // dạng số ms
            timeExpired = parseInt(timeExpiredStr, 10);
        } else {
            // dạng text date (vì ví dụ là "Sat, 14 Mar 2026 10:52:57 GMT")
            timeExpired = dayjs(timeExpiredStr).valueOf();
        }
        if (!isNaN(timeExpired) && dayjs().valueOf() > timeExpired) {
            useAuthStore.getState().logout();
            localStorage.removeItem('time_expired');
            showError('Hết hạn đăng nhập. Vui lòng đăng nhập lại.');
            window.location.replace('/login');
        }
    }
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
            useAuthStore.getState().logout();
            localStorage.removeItem('time_expired');
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);
