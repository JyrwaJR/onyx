/**
 * @file Shared HTTP client constants.
 *
 * Defines the API base URL (configurable at runtime), authentication path list,
 * and a helper to check whether a URL targets an auth endpoint.
 */

/** Static fallback from environment variable. */
const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4096';

/** @deprecated Use getApiBaseUrl() instead. */
export const API_BASE_URL = ENV_BASE_URL;

/**
 * Paths that bypass the automatic token refresh logic.
 * Errors on these paths are returned directly to the caller.
 * These are authentication-related endpoints that should not trigger
 * the token refresh flow (e.g., login, OAuth, auth set/remove).
 * Matches the v1 auth surface: `/auth/{providerID}` and `/provider/*`.
 */
export const AUTH_PATHS = ['/auth/', '/provider/'] as const;

/**
 * Checks if a given URL is one of the authentication-related paths.
 *
 * @param url - The URL to check.
 * @returns True if the URL is an auth path, false otherwise.
 */
export const isAuthPath = (url: string): boolean => {
  return AUTH_PATHS.some((path) => url.includes(path));
};
