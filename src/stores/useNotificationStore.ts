import { create } from 'zustand';
import { TOAST_VARIANT  } from '@/constants/toast';
import type {ToastVariant} from '@/constants/toast';

export type NotificationVariant = ToastVariant;

interface NotificationState {
    isOpen: boolean;
    title: string;
    description?: string;
    variant: NotificationVariant;
    show: (payload: {
        title: string;
        description?: string;
        variant?: NotificationVariant;
    }) => void;
    close: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    isOpen: false,
    title: '',
    description: undefined,
    variant: TOAST_VARIANT.INFO,
    show: ({ title, description, variant = TOAST_VARIANT.INFO }) =>
        set({ isOpen: true, title, description, variant }),
    close: () =>
        set({
            isOpen: false,
            title: '',
            description: undefined,
            variant: TOAST_VARIANT.INFO,
        }),
}));
