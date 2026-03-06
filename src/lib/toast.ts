import i18n from '@/i18n';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { ApiError } from '@/types/api.type';
import { ERROR_CODE_I18N } from '@/constants/errorCodes';

export function showError(error: unknown) {
    const show = useNotificationStore.getState().show;
    if (error instanceof ApiError) {
        const key = ERROR_CODE_I18N[error.resultCode];
        const message = key ? i18n.t(key) : error.message;
        show({ title: message, variant: 'error' });
    } else if (error instanceof Error) {
        show({ title: error.message, variant: 'error' });
    } else {
        show({ title: i18n.t('error.unknown'), variant: 'error' });
    }
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
