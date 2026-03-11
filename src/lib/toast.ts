import i18n from '@/i18n';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { ApiError } from '@/types/api.type';
import { ERROR_CODE_I18N } from '@/constants/errorCodes';
import { FIREBASE_AUTH_ERROR_I18N } from '@/constants/firebaseAuthErrorI18n';

type FirebaseLikeError = {
    code: string;
    message?: string;
};

function isFirebaseAuthError(error: unknown): error is FirebaseLikeError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code: unknown }).code === 'string' &&
        (error as { code: string }).code.startsWith('auth/')
    );
}

export function showError(error: unknown) {
    const show = useNotificationStore.getState().show;

    if (typeof error === 'string') {
        show({
            title: 'Có lỗi xảy ra',
            description: error,
            variant: 'error',
        });
        return;
    }

    if (error instanceof ApiError) {
        const key = ERROR_CODE_I18N[error.resultCode];
        const message = key ? i18n.t(key) : error.message;
        show({
            title: 'Có lỗi xảy ra',
            description: message,
            variant: 'error',
        });
        return;
    }

    if (isFirebaseAuthError(error)) {
        const key = FIREBASE_AUTH_ERROR_I18N[error.code];
        const message = key
            ? i18n.t(key)
            : (error.message ?? i18n.t('error.unknown'));
        show({
            title: 'Có lỗi xảy ra',
            description: message,
            variant: 'error',
        });
        return;
    }

    if (error instanceof Error) {
        show({
            title: 'Có lỗi xảy ra',
            description: error.message,
            variant: 'error',
        });
        return;
    }

    show({
        title: 'Có lỗi xảy ra',
        description: i18n.t('error.unknown'),
        variant: 'error',
    });
}

export function showSuccess(key: string, description?: string) {
    useNotificationStore.getState().show({
        title: i18n.t(key),
        description,
        variant: 'success',
    });
}

export function showInfo(key: string, description?: string) {
    useNotificationStore.getState().show({
        title: i18n.t(key),
        description,
        variant: 'info',
    });
}
