# Chat Store Design Spec

## Goal
Centralize all chat-related state—including session context, ephemeral streaming state, and persistent settings—into a single, structured Zustand store. This eliminates prop drilling and provides a unified interface for chat state management.

## Architecture

We will restructure `ChatStore` to use a nested state object approach to ensure modularity within a single centralized store.

```typescript
interface ChatState {
  // Context: projectId, sessionId
  context: {
    projectId: string | null;
    activeSessionId: string | null;
  };

  // Chat State (Ephemeral): streaming status, messages, etc.
  chat: {
    isStreaming: boolean;
    streamingMessageId: string | null;
    streamingContent: ContentBlock[];
    pendingPermissionRequests: PermissionRequest[];
  };

  // Settings (Persistent): agent, model selection, UI prefs
  settings: {
    selectedAgent: string | null;
    selectedModel: string | null;
  };

  // Actions
  setContext: (context: Partial<ChatState['context']>) => void;
  setSettings: (settings: Partial<ChatState['settings']>) => void;
  // ... ephemeral chat actions
}
```

## Data Flow
- Components subscribe only to the slice they need using Zustand selectors: `useChatStore(state => state.settings)`.
- Global chat functionality uses the unified hook.

## Benefits
- Centralized state management.
- Eliminates prop drilling.
- Performance optimized via granular selectors.
- Structured, maintainable state layout.
