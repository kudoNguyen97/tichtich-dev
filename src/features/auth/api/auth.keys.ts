export const authKeys = {
    all: ['auth'] as const,
    me: () => [...authKeys.all, 'me'] as const,
    meWithProfile: (profileId: string) =>
        [...authKeys.all, 'me', profileId] as const,
    meSettings: () => [...authKeys.all, 'me', 'settings'] as const,
    updateMeSettings: () =>
        [...authKeys.all, 'me', 'settings', 'update'] as const,
};
