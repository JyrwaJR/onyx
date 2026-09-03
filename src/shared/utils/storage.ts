/**
 * @file AsyncStorage instance and Zustand persist adapter.
 *
 * Provides async local storage backed by @react-native-async-storage/async-storage,
 * with a Zustand-compatible adapter for the `persist` middleware.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * Zustand StateStorage adapter backed by AsyncStorage.
 * Use with `persist` middleware:
 * ```ts
 * storage: createJSONStorage(() => zustandAsyncStorage)
 * ```
 */
export const zustandAsyncStorage: StateStorage = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};
