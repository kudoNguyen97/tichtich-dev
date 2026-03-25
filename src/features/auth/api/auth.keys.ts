export const authKeys = {
    all: ['auth'] as const,
    me: () => [...authKeys.all, 'me'] as const,
    meSettings: () => [...authKeys.all, 'me', 'settings'] as const,
    updateMeSettings: () =>
        [...authKeys.all, 'me', 'settings', 'update'] as const,
};
