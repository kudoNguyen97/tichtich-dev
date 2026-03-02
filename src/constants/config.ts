export const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'SaaSApp',
  APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
