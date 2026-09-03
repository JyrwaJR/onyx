/**
 * @file MMKV storage instance and Zustand persist adapter.
 *
 * Provides fast synchronous local storage backed by MMKV,
 * with a Zustand-compatible adapter for the `persist` middleware.
 */

import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/** MMKV storage instance for fast synchronous local storage. */
export const mmkvStorage = new MMKV({ id: 'onyx-storage' });

/**
 * Zustand StateStorage adapter backed by MMKV.
 * Use with `persist` middleware:
 * ```ts
 * storage: createJSONStorage(() => zustandMMKVStorage)
 * ```
 */
export const zustandMMKVStorage: StateStorage = {
  getItem: (name) => mmkvStorage.getString(name) ?? null,
  setItem: (name, value) => mmkvStorage.set(name, value),
  removeItem: (name) => mmkvStorage.delete(name),
};
