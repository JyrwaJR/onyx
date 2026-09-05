/**
 * @file Zustand store for server connection state.
 *
 * Manages the current server URL, connection status, and error state.
 * Persists the server URL to AsyncStorage manually (no persist middleware).
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setApiBaseUrl } from '@utils/http/constants';
import http from '@utils/http/client';
import { HEALTH_CHECK } from '@/shared/api/endpoints';
import { HealthResponse } from '../api';

const STORAGE_KEY = 'onyx-connection';

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

  /** Set the server URL and persist it to AsyncStorage. */
  setServerUrl: (url: string) => void;
  /** Attempt to connect to the server: set base URL, ping, update status. */
  connect: () => Promise<void>;
  /** Reset connection status to idle. */
  disconnect: () => void;
  /** Load persisted state from AsyncStorage and reconfigure the HTTP client base URL. */
  hydrate: () => Promise<void>;
}

export const useConnectionStore = create<ConnectionState>()((set, get) => ({
  serverUrl: 'https://192.168.1.18:4096',
  connectionStatus: 'idle',
  error: null,
  hydrated: false,

  setServerUrl: (url: string) => {
    set({ serverUrl: url, error: null });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ serverUrl: url })).catch(() => {});
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

      if (response.data && response.data.healthy) {
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
    set({ connectionStatus: 'idle', error: null, serverUrl: '' });
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.serverUrl) {
          set({ serverUrl: data.serverUrl, hydrated: true });
          setApiBaseUrl(data.serverUrl);
          return;
        }
      }
      set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));
