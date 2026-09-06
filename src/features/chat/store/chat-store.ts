import { create } from 'zustand';
import { type ContentBlock } from '../../../shared/api/types';
import { type PermissionRequest } from '../types';
import { type Agent } from '@/shared/types/agent';
import { type Model } from '@/shared/types/model';

interface ChatState {
  context: {
    projectId: string | null;
    activeSessionId: string | null;
  };
  chat: {
    isStreaming: boolean;
    streamingMessageId: string | null;
    streamingContent: ContentBlock[];
    pendingPermissionRequests: PermissionRequest[];
  };
  settings: {
    selectedAgent: Agent | null;
    selectedModel: Model | null;
  };

  // Actions
  setContext: (context: Partial<ChatState['context']>) => void;
  setSettings: (settings: Partial<ChatState['settings']>) => void;
  startStreaming: (sessionId: string, messageId: string) => void;
  appendContent: (block: ContentBlock) => void;
  addPermissionRequest: (request: PermissionRequest) => void;
  removePermissionRequest: (requestId: string) => void;
  finishStreaming: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  context: {
    projectId: null,
    activeSessionId: null,
  },
  chat: {
    isStreaming: false,
    streamingMessageId: null,
    streamingContent: [],
    pendingPermissionRequests: [],
  },
  settings: {
    selectedAgent: null,
    selectedModel: null,
  },

  setContext: (context) =>
    set((state) => ({ context: { ...state.context, ...context } })),

  setSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),

  startStreaming: (sessionId, messageId) =>
    set((state) => {
      if (
        state.chat.isStreaming &&
        state.chat.streamingMessageId === messageId &&
        state.context.activeSessionId === sessionId
      ) {
        return state;
      }
      return {
        context: { ...state.context, activeSessionId: sessionId },
        chat: {
          ...state.chat,
          streamingMessageId: messageId,
          isStreaming: true,
          streamingContent: [],
        },
      };
    }),

  appendContent: (block) =>
    set((state) => ({
      chat: {
        ...state.chat,
        streamingContent: [...state.chat.streamingContent, block],
      },
    })),

  addPermissionRequest: (request) =>
    set((state) => {
      if (state.chat.pendingPermissionRequests.some((r) => r.id === request.id)) {
        return state;
      }
      return {
        chat: {
          ...state.chat,
          pendingPermissionRequests: [...state.chat.pendingPermissionRequests, request],
        },
      };
    }),

  removePermissionRequest: (requestId) =>
    set((state) => ({
      chat: {
        ...state.chat,
        pendingPermissionRequests: state.chat.pendingPermissionRequests.filter(
          (r) => r.id !== requestId
        ),
      },
    })),

  finishStreaming: () =>
    set((state) => ({
      chat: {
        ...state.chat,
        isStreaming: false,
        streamingMessageId: null,
        streamingContent: [],
      },
    })),

  reset: () =>
    set({
      context: { projectId: null, activeSessionId: null },
      chat: {
        isStreaming: false,
        streamingMessageId: null,
        streamingContent: [],
        pendingPermissionRequests: [],
      },
      settings: { selectedAgent: null, selectedModel: null },
    }),
}));
