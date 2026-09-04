/**
 * @file Shared HTTP client constants.
 *
 * Defines the API base URL (configurable at runtime), authentication path list,
 * and a helper to check whether a URL targets an auth endpoint.
 */

/** Static fallback from environment variable. */
const ENV_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4096';

/** Runtime-configurable base URL. Set by the connection flow. */
let _dynamicBaseUrl: string | null = null;

/**
 * Returns the active API base URL.
 * Priority: dynamic (set by user connection) > env var > localhost fallback.
 */
export function getApiBaseUrl(): string {
  const url = _dynamicBaseUrl ?? ENV_BASE_URL;
  return url;
}

/**
 * Sets the API base URL at runtime. Called when the user connects to a server.
 * @param url - The full base URL (e.g. "http://192.168.1.5:4096").
 */
export function setApiBaseUrl(url: string): void {
  const cleaned = url.replace(/\/$/, '');
  _dynamicBaseUrl = cleaned;
}

/** @deprecated Use getApiBaseUrl() instead. */
export const API_BASE_URL = ENV_BASE_URL;

/**
 * Paths that bypass the automatic token refresh logic.
 * Errors on these paths are returned directly to the caller.
 */
export const AUTH_PATHS = [''] as const;

/**
 * Checks if a given URL is one of the authentication-related paths.
 *
 * @param url - The URL to check.
 * @returns True if the URL is an auth path, false otherwise.
 */
export const isAuthPath = (url: string): boolean => {
  return AUTH_PATHS.some((path) => url.includes(path));
};
