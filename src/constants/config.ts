export const config = {
    API_BASE_URL:
        import.meta.env.VITE_BASE_URL ?? 'https://dev.api.tichtich.vn',
    APP_NAME: import.meta.env.VITE_APP_NAME ?? 'TichTichApp',
    APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
    IS_DEV: import.meta.env.MODE === 'development',
    IS_PROD: import.meta.env.MODE === 'production',
} as const;
