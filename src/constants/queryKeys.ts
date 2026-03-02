export const queryKeys = {
  // Auth
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // Home
  home: {
    feed: () => ['home', 'feed'] as const,
    stats: () => ['home', 'stats'] as const,
  },
} as const
