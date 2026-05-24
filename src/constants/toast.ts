export const TOAST_VARIANT = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
} as const;

export type ToastVariant = (typeof TOAST_VARIANT)[keyof typeof TOAST_VARIANT];
