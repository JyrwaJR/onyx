/**
 * @file React Query client configuration.
 *
 * App-wide QueryClient instance with sensible defaults for a mobile app.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * App-wide QueryClient instance.
 * Configured with:
 * - 5 minute stale time (data considered fresh for 5 min)
 * - 3 retries with exponential backoff
 * - No refetch on window focus (not applicable to mobile)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
