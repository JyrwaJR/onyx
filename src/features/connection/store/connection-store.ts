/**
 * @file Zustand store for server connection state.
 *
 * Manages the current server URL, connection status, and error state.
 * Persists the server URL to MMKV via the persist middleware.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { zustandMMKVStorage } from '@utils/storage';
import { setApiBaseUrl } from '@utils/http/constants';
import http from '@utils/http/client';
import { HEALTH_CHECK } from '../../../shared/api/endpoints';
import type { HealthResponse } from '../types/connection';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface ConnectionState {
  /** Current server URL. */
  serverUrl: string;
  /** Current connection status. */
  connectionStatus: ConnectionStatus;
  /** Error message from the last failed connection attempt. */
  error: string | null;
  /** Whether the store has been hydrated from MMKV. */
  hydrated: boolean;

  /** Set the server URL and persist it to MMKV. */
  setServerUrl: (url: string) => void;
  /** Attempt to connect to the server: set base URL, ping, update status. */
  connect: () => Promise<void>;
  /** Reset connection status to idle. */
  disconnect: () => void;
  /** Mark the store as hydrated after MMKV rehydration completes. */
  setHydrated: (hydrated: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      serverUrl: '',
      connectionStatus: 'idle',
      error: null,
      hydrated: false,

      setServerUrl: (url: string) => {
        set({ serverUrl: url, error: null });
      },

      connect: async () => {
        const { serverUrl } = get();

        if (!serverUrl) {
          set({ connectionStatus: 'error', error: 'Please enter a server URL.' });
          return;
        }

        set({ connectionStatus: 'connecting', error: null });

        try {
          setApiBaseUrl(serverUrl);

          const response = await http.get<HealthResponse>(HEALTH_CHECK);

          if (response.data && response.data.ok) {
            set({ connectionStatus: 'connected', error: null });
          } else {
            set({
              connectionStatus: 'error',
              error: 'Server responded but reported unhealthy status.',
            });
          }
        } catch (err) {
          const status = (err as { response?: { status?: number } }).response?.status;

          if (status === 401 || status === 403) {
            set({ connectionStatus: 'connected', error: null });
            return;
          }

          set({
            connectionStatus: 'error',
            error: 'Could not reach the server. Check the URL and try again.',
          });
        }
      },

      disconnect: () => {
        set({ connectionStatus: 'idle', error: null });
      },

      setHydrated: (hydrated: boolean) => {
        set({ hydrated });
      },
    }),
    {
      name: 'onyx-connection',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({ serverUrl: state.serverUrl }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
