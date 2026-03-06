import { create } from 'zustand';

export type NotificationVariant = 'success' | 'error' | 'info';

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
    variant: 'info',
    show: ({ title, description, variant = 'info' }) =>
        set({ isOpen: true, title, description, variant }),
    close: () =>
        set({
            isOpen: false,
            title: '',
            description: undefined,
            variant: 'info',
        }),
}));
