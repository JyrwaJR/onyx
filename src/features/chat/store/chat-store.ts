import { create } from 'zustand';
import type { ContentBlock } from '../../../shared/api/types';

interface ChatState {
  /** The currently active session being chatted in. */
  activeSessionId: string | null;
  /** ID of the message currently being streamed from the AI. */
  streamingMessageId: string | null;
  /** Whether an AI response is currently streaming. */
  isStreaming: boolean;
  /** Accumulating content blocks during streaming. */
  streamingContent: ContentBlock[];
  /** Start streaming a new AI response. */
  startStreaming: (sessionId: string, messageId: string) => void;
  /** Append a content block to the current stream. */
  appendContent: (block: ContentBlock) => void;
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

  startStreaming: (sessionId, messageId) =>
    set({
      activeSessionId: sessionId,
      streamingMessageId: messageId,
      isStreaming: true,
      streamingContent: [],
    }),

  appendContent: (block) =>
    set((state) => ({
      streamingContent: [...state.streamingContent, block],
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
    }),
}));
