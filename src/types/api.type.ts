export interface ApiResponse<T> {
    resultCode: number;
    message: string;
    success: boolean;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    code: string;
    statusCode: number;
}
