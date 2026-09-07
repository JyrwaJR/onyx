/**
 * @file Token refresh logic and failed-request queue.
 *
 * Manages the state of in-flight token refresh attempts and queues
 * requests that arrive while a refresh is in progress so they can be
 * retried once the new token is available.
 *
 * The v1 OpenCode API has no token-refresh endpoint, so refreshToken
 * always throws and the failure propagates through the queue.
 */

import type { QueueItem } from '@/shared/types/api';

/** Flag indicating if a token refresh request is currently in flight. */
export let isRefreshing = false;

/** List of requests waiting for the token refresh to complete. */
export const failedQueue: QueueItem[] = [];

/** @internal */
export const setRefreshing = (value: boolean) => {
  isRefreshing = value;
};

/**
 * Processes the failed request queue after a refresh attempt.
 *
 * @param error - If provided, all queued requests are rejected with this error.
 * @param token - If provided, all queued requests are resolved with this new token.
 */
export const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue.length = 0;
};

/**
 * Performs a token refresh request using the stored refresh token.
 *
 * The v1 OpenCode API does not expose a token-refresh endpoint, so this
 * always fails. The interceptor treats the failure as a terminal auth
 * error and rejects the queued requests.
 *
 * @throws {Error} Always — no refresh endpoint available on the v1 API.
 * @returns Never resolves; rejects with an error.
 */
export const refreshToken = async (): Promise<string> => {
  throw new Error('Token refresh is not supported by the OpenCode v1 API');
};
