import { create } from 'zustand';
import { type ContentBlock } from '../../../shared/api/types';
import { type PermissionRequest } from '../types';

interface ChatState {
  /** The currently active session being chatted in. */
  activeSessionId: string | null;
  /** ID of the message currently being streamed from the AI. */
  streamingMessageId: string | null;
  /** Whether an AI response is currently streaming. */
  isStreaming: boolean;
  /** Accumulating content blocks during streaming. */
  streamingContent: ContentBlock[];
  /** Pending permission requests. */
  pendingPermissionRequests: PermissionRequest[];
  /** Start streaming a new AI response. */
  startStreaming: (sessionId: string, messageId: string) => void;
  /** Append a content block to the current stream. */
  appendContent: (block: ContentBlock) => void;
  /** Add a permission request. */
  addPermissionRequest: (request: PermissionRequest) => void;
  /** Remove a permission request. */
  removePermissionRequest: (requestId: string) => void;
  /** Finish the current streaming session. */
  finishStreaming: () => void;
  /** Reset all streaming state. */
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeSessionId: null,
  streamingMessageId: null,
  isStreaming: false,
  streamingContent: [],
  pendingPermissionRequests: [],

  startStreaming: (sessionId, messageId) =>
    // No-op when already streaming the same message so the per-delta SSE
    // notifications don't re-render every store subscriber on each token.
    set((state) => {
      if (
        state.isStreaming &&
        state.streamingMessageId === messageId &&
        state.activeSessionId === sessionId
      ) {
        return state;
      }
      return {
        activeSessionId: sessionId,
        streamingMessageId: messageId,
        isStreaming: true,
        streamingContent: [],
      };
    }),

  appendContent: (block) =>
    set((state) => ({
      streamingContent: [...state.streamingContent, block],
    })),

  addPermissionRequest: (request) =>
    set((state) => ({
      pendingPermissionRequests: [...state.pendingPermissionRequests, request],
    })),

  removePermissionRequest: (requestId) =>
    set((state) => ({
      pendingPermissionRequests: state.pendingPermissionRequests.filter((r) => r.id !== requestId),
    })),

  finishStreaming: () =>
    set({
      isStreaming: false,
      streamingMessageId: null,
      streamingContent: [],
    }),

  reset: () =>
    set({
      activeSessionId: null,
      streamingMessageId: null,
      isStreaming: false,
      streamingContent: [],
      pendingPermissionRequests: [],
    }),
}));
