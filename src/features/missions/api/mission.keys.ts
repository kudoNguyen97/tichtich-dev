export const missionKeys = {
    all: ['missions'] as const,
    create: () => [...missionKeys.all, 'create'] as const,
    listsByProfileIdKid: () =>
        [...missionKeys.all, 'listByProfileIdKid'] as const,
    listByProfileIdKid: (profileId: string) =>
        [...missionKeys.listsByProfileIdKid(), profileId] as const,
};
