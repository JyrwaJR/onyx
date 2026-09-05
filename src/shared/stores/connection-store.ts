/**
 * @file Zustand store for server connection state.
 *
 * Manages server URL, connection status, and error state using Zustand's persist middleware.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import http from '@utils/http/client';
import { HEALTH_CHECK } from '@/shared/api/endpoints';
import { HealthResponse } from '../api';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface ConnectionState {
  /** Current server URL. */
  serverUrl: string;
  /** Current connection status. */
  connectionStatus: ConnectionStatus;
  /** Error message from the last failed connection attempt. */
  error: string | null;
  /** Whether the store has been hydrated from AsyncStorage. */
  hydrated: boolean;

  /** Set the server URL. */
  setServerUrl: (url: string) => void;
  /** Attempt to connect to the server: ping and update status. */
  connect: () => Promise<void>;
  /** Reset connection status to idle. */
  disconnect: () => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      serverUrl: '',
      connectionStatus: 'idle',
      error: null,
      hydrated: false,

      setServerUrl: (url: string) => {
        set({ serverUrl: url.trim(), error: null });
      },

      connect: async () => {
        const { serverUrl } = get();

        if (!serverUrl) {
          set({ connectionStatus: 'error', error: 'Please enter a server URL.' });
          return;
        }

        set({ connectionStatus: 'connecting', error: null });

        try {
          const response = await http.get<HealthResponse>(HEALTH_CHECK);

          if (response.data?.healthy) {
            set({ connectionStatus: 'connected', error: null });
          } else {
            set({
              connectionStatus: 'error',
              error: 'Server responded but reported unhealthy status.',
            });
          }
        } catch (err: any) {
          const status = err?.response?.status;

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
        set({ connectionStatus: 'idle', error: null, serverUrl: '' });
        router.replace('/');
      },
    }),
    {
      name: 'onyx-connection',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ serverUrl: state.serverUrl }),
    }
  )
);
