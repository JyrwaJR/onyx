/**
 * @file Secure storage helpers for sensitive data.
 *
 * Wraps `expo-secure-store` for storing server URLs,
 * which are considered sensitive because they contain network topology info.
 */

import * as SecureStore from 'expo-secure-store';

const ACTIVE_SERVER_URL_KEY = 'onyx-active-server-url';

/**
 * Saves the active server URL to secure storage.
 * @param url - The server base URL (e.g. "http://192.168.1.5:4096").
 */
export async function saveServerUrl(url: string): Promise<void> {
  await SecureStore.setItemAsync(ACTIVE_SERVER_URL_KEY, url);
}

/**
 * Retrieves the saved server URL from secure storage.
 * @returns The saved URL, or null if none saved.
 */
export async function getServerUrl(): Promise<string | null> {
  return SecureStore.getItemAsync(ACTIVE_SERVER_URL_KEY);
}

/** Deletes the saved server URL from secure storage. */
export async function clearServerUrl(): Promise<void> {
  await SecureStore.deleteItemAsync(ACTIVE_SERVER_URL_KEY);
}
