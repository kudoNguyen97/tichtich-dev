export const profileKeys = {
    profile: ['profile'] as const,
    profileDetail: (id: string) => [...profileKeys.profile, id] as const,
};
