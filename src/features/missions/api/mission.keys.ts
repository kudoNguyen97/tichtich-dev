export const missionKeys = {
    all: ['missions'] as const,
    create: () => [...missionKeys.all, 'create'] as const,
    listsByProfileIdKid: () =>
        [...missionKeys.all, 'listByProfileIdKid'] as const,
    listByProfileIdKid: (profileId: string, statuses?: string[]) =>
        [...missionKeys.listsByProfileIdKid(), profileId, statuses ?? []] as const,
};
