export interface ApiResponse<T = unknown> {
    resultCode: number;
    message: string;
    success: boolean;
    data: T;
}

export interface PaginatedData<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export class ApiError extends Error {
    constructor(
        public readonly resultCode: number,
        public readonly statusCode: number,
        message: string,
        public readonly data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
