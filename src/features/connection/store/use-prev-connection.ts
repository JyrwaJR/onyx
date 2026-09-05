import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ServerStore {
  serverUrls: string[];
  onAddNewServer: (url: string) => void;
}

export const usePrevConnectionStore = create<ServerStore>()(
  persist(
    (set) => ({
      serverUrls: [],
      onAddNewServer: (url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return;
        set((state) => ({
          // Unshift the new URL to the top and remove duplicates
          serverUrls: [trimmed, ...state.serverUrls.filter((item) => item !== trimmed)],
        }));
      },
    }),
    {
      name: 'onyx-prev-connection',
      storage: createJSONStorage(() => AsyncStorage),
      // Removing `partialize` allows Zustand to automatically persist all state properties.
      // Functions are automatically ignored during JSON serialization.
    }
  )
);
