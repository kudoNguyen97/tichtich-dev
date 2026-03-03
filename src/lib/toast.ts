import i18n from '@/i18n';
import { toastQueue } from '@/components/common/Toast';
import { ApiError } from '@/types/api.type';
import { ERROR_CODE_I18N } from '@/constants/errorCodes';

const DEFAULT_TIMEOUT = 5000;

export function showError(error: unknown) {
    if (error instanceof ApiError) {
        const key = ERROR_CODE_I18N[error.resultCode];
        const message = key ? i18n.t(key) : error.message;
        toastQueue.add(
            { title: message, variant: 'error' },
            { timeout: DEFAULT_TIMEOUT }
        );
    } else if (error instanceof Error) {
        toastQueue.add(
            { title: error.message, variant: 'error' },
            { timeout: DEFAULT_TIMEOUT }
        );
    } else {
        toastQueue.add(
            { title: i18n.t('error.unknown'), variant: 'error' },
            { timeout: DEFAULT_TIMEOUT }
        );
    }
}

export function showSuccess(key: string, description?: string) {
    toastQueue.add(
        { title: i18n.t(key), description, variant: 'success' },
        { timeout: DEFAULT_TIMEOUT }
    );
}

export function showInfo(key: string, description?: string) {
    toastQueue.add(
        { title: i18n.t(key), description, variant: 'info' },
        { timeout: DEFAULT_TIMEOUT }
    );
}
