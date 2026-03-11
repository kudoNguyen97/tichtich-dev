import type { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axios';
import { ApiError } from '@/types/api.type';
import type { ApiResponse } from '@/types/api.type';

async function request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const res = await axiosInstance.request<ApiResponse<T>>(config);
        const body = res.data;

        if (!body.success) {
            throw new ApiError(
                body.resultCode,
                res.status,
                body.message,
                body.data
            );
        }

        return body.data;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        const axiosError = error as AxiosError<ApiResponse>;
        const response = axiosError.response;

        // Trường hợp lỗi mạng / không có response từ server
        if (!response) {
            throw new ApiError(0, 0, axiosError.message || 'Network error');
        }

        const body = response.data;
        throw new ApiError(
            body.resultCode,
            response.status,
            body.message,
            body.data
        );
    }
}

export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'PUT', url, data }),

    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'PATCH', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'DELETE', url }),
};
