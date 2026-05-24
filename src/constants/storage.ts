export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    APP_SPLASH_SHOWN: 'app_splash_shown',
    DEVICE_ID: 'device_id',
    I18N_LANG: 'i18nextLng',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
