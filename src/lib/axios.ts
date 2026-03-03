import axios from 'axios';
import type { AxiosError } from 'axios';
import { config } from '@/constants/config';

export const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((requestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
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
