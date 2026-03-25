export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
    APP_NAME: import.meta.env.VITE_APP_NAME ?? 'TichTichApp',
    APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
    IS_DEV: import.meta.env.MODE === 'development',
    IS_PROD: import.meta.env.MODE === 'production',
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
} as const;
