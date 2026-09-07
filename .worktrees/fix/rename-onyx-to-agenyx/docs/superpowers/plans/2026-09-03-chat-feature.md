# Chat Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time AI chat with SSE streaming, markdown rendering, tool call display, and message management.

**Architecture:** Feature module at `src/features/chat/` following existing patterns. API layer → React Query hooks → Zustand store → UI components → Chat screen with SSE integration.

**Tech Stack:** Expo Router, React Query, Zustand, React Hook Form + Zod, NativeWind, Axios, react-native-sse, react-native-markdown-display

---

## File Structure

| File                                                | Responsibility                    |
| --------------------------------------------------- | --------------------------------- |
| `src/features/chat/api/chat-api.ts`                 | API client functions for chat     |
| `src/features/chat/validators/message.ts`           | Zod schema for message form       |
| `src/features/chat/hooks/use-chat.ts`               | React Query hooks                 |
| `src/features/chat/store/chat-store.ts`             | Zustand store for streaming state |
| `src/features/chat/components/MessageBubble.tsx`    | Individual message display        |
| `src/features/chat/components/MessageInput.tsx`     | Text input with send button       |
| `src/features/chat/components/MessageList.tsx`      | FlatList of messages              |
| `src/features/chat/components/ToolCallBlock.tsx`    | Collapsible tool call display     |
| `src/features/chat/components/MarkdownRenderer.tsx` | Markdown text rendering           |
| `src/features/chat/screens/ChatScreen.tsx`          | Main chat screen with SSE         |
| `src/features/chat/index.ts`                        | Public exports                    |

---

### Task 11: Chat Infrastructure

**Files:**

- Create: `src/features/chat/api/chat-api.ts`
- Create: `src/features/chat/validators/message.ts`
- Create: `src/features/chat/hooks/use-chat.ts`
- Create: `src/features/chat/store/chat-store.ts`

- [ ] Step 1: Create chat API layer

```typescript
// src/features/chat/api/chat-api.ts
import http from '@utils/http/client';
import { CREATE_SESSION, GET_SESSION_MESSAGES } from '../../../shared/api/endpoints';
import type { Message, Session } from '../../../shared/api/types';

/** Creates a new session for a project. */
export async function createSession(projectId: string, title?: string): Promise<Session> {
  const response = await http.post<Session>(CREATE_SESSION, {
    projectID: projectId,
    title: title || undefined,
  });
  return response.data;
}

/** Fetches all messages for a session. */
export async function fetchMessages(projectId: string, sessionId: string): Promise<Message[]> {
  const response = await http.get<Message[]>(GET_SESSION_MESSAGES(sessionId), {
    params: { projectID: projectId },
  });
  return response.data;
}

/** Deletes a specific message from a session. */
export async function deleteMessage(
  projectId: string,
  sessionId: string,
  messageId: string
): Promise<void> {
  await http.delete(`${GET_SESSION_MESSAGES(sessionId)}/${messageId}`, {
    params: { projectID: projectId },
  });
}

/** Sends a message to a session. */
export async function sendMessage(sessionId: string, content: string): Promise<Message> {
  const response = await http.post<Message>(`/api/session/${sessionId}/prompt`, { content });
  return response.data;
}
```

- [ ] Step 2: Create Zod validator

```typescript
// src/features/chat/validators/message.ts
import { z } from 'zod';

/** Schema for validating message form data. */
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be 10000 characters or fewer'),
});

/** Inferred form data type from the message schema. */
export type MessageFormData = z.infer<typeof messageSchema>;
```

- [ ] Step 3: Create Zustand store

```typescript
// src/features/chat/store/chat-store.ts
import { create } from 'zustand';
import type { ContentBlock } from '../../../shared/api/types';

interface ChatState {
  activeSessionId: string | null;
  streamingMessageId: string | null;
  isStreaming: boolean;
  streamingContent: ContentBlock[];
  startStreaming: (sessionId: string, messageId: string) => void;
  appendContent: (block: ContentBlock) => void;
  finishStreaming: () => void;
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
```

- [ ] Step 4: Create React Query hooks

```typescript
// src/features/chat/hooks/use-chat.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { queryKeys } from '../../../shared/api/query-keys';
import { createSession, fetchMessages, deleteMessage, sendMessage } from '../api/chat-api';
import type { Message } from '../../../shared/api/types';

/** Fetches messages for a session. */
export function useMessages(projectId: string, sessionId: string) {
  return useQuery<Message[]>({
    queryKey: queryKeys.messages.bySession(sessionId),
    queryFn: () => fetchMessages(projectId, sessionId),
    enabled: !!projectId && !!sessionId,
  });
}

/** Creates a new session and navigates to chat. */
export function useCreateSession(projectId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title?: string }) => createSession(projectId, title),
    onSuccess: (session) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.byProject(projectId),
      });
      router.push(`/(tabs)/projects/${projectId}/sessions/${session.id}/chat` as never);
    },
  });
}

/** Deletes a message with cache invalidation. */
export function useDeleteMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(projectId, sessionId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}

/** Sends a message to a session. */
export function useSendMessage(projectId: string, sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.bySession(sessionId),
      });
    },
  });
}
```

- [ ] Step 5: Update index.ts with public exports

```typescript
// src/features/chat/index.ts
export { useMessages, useCreateSession, useDeleteMessage, useSendMessage } from './hooks/use-chat';
export { useChatStore } from './store/chat-store';
export { messageSchema } from './validators/message';
export type { MessageFormData } from './validators/message';
```

---

### Task 12: Chat UI Components

**Files:**

- Create: `src/features/chat/components/MarkdownRenderer.tsx`
- Create: `src/features/chat/components/ToolCallBlock.tsx`
- Create: `src/features/chat/components/MessageBubble.tsx`
- Create: `src/features/chat/components/MessageInput.tsx`
- Create: `src/features/chat/components/MessageList.tsx`

- [ ] Step 1: Create MarkdownRenderer

```typescript
// src/features/chat/components/MarkdownRenderer.tsx
import Markdown from 'react-native-markdown-display';

const markdownStyles = {
  body: { fontSize: 15, lineHeight: 22, color: '#1F2937' },
  code_block: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  code_inline: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  link: { color: '#4F46E5' },
  heading1: { fontSize: 22, fontWeight: 'bold' as const, marginTop: 12, marginBottom: 8 },
  heading2: { fontSize: 18, fontWeight: 'bold' as const, marginTop: 10, marginBottom: 6 },
  heading3: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 8, marginBottom: 4 },
  paragraph: { marginTop: 0, marginBottom: 8 },
  bullet_list: { marginTop: 4, marginBottom: 4 },
  ordered_list: { marginTop: 4, marginBottom: 4 },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
    paddingLeft: 12,
    marginLeft: 0,
    marginTop: 4,
    marginBottom: 4,
  },
};

interface MarkdownRendererProps {
  content: string;
}

/** Renders markdown content with styled code blocks and paragraphs. */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
}
```

- [ ] Step 2: Create ToolCallBlock

```typescript
// src/features/chat/components/ToolCallBlock.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { ContentBlock } from '../../../shared/api/types';

interface ToolCallBlockProps {
  block: Extract<ContentBlock, { type: 'tool-invocation' }>;
}

function truncateJson(obj: unknown, maxLength = 80): string {
  const str = JSON.stringify(obj);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/** Collapsible display for a tool call with arguments and result. */
export function ToolCallBlock({ block }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="my-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-gray-700">
            {block.toolName}
          </Text>
          <Text className="text-xs text-gray-400">
            {expanded ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2">
          <Text className="text-xs text-gray-500">Arguments:</Text>
          <Text
            className="mt-1 rounded bg-white p-2 text-xs text-gray-600"
            selectable>
            {JSON.stringify(block.args, null, 2)}
          </Text>

          {block.result && (
            <>
              <Text className="mt-2 text-xs text-gray-500">Result:</Text>
              <Text
                className="mt-1 rounded bg-white p-2 text-xs text-gray-600"
                selectable>
                {typeof block.result === 'string'
                  ? block.result
                  : JSON.stringify(block.result, null, 2)}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}
```

- [ ] Step 3: Create MessageBubble

```typescript
// src/features/chat/components/MessageBubble.tsx
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { Message, ContentBlock } from '../../../shared/api/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ToolCallBlock } from './ToolCallBlock';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (messageId: string) => void;
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString();
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'text':
      return <MarkdownRenderer key={index} content={block.text} />;
    case 'tool-invocation':
      return <ToolCallBlock key={index} block={block} />;
    case 'tool-result':
      return (
        <View key={index} className="my-1 rounded bg-gray-100 p-2">
          <Text className="text-xs text-gray-500">Tool Result</Text>
          <Text className="mt-1 text-xs text-gray-600" selectable>
            {typeof block.result === 'string'
              ? block.result
              : JSON.stringify(block.result)}
          </Text>
        </View>
      );
    default:
      return null;
  }
}

/** Message bubble with user/AI alignment and long-press delete. */
export function MessageBubble({ message, onDelete }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const handleLongPress = () => {
    if (!isUser || !onDelete) return;
    Alert.alert('Delete Message', 'Delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(message.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={isUser ? 0.7 : 1}
      className={`mb-3 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600'
            : 'bg-gray-100'
        }`}>
        {message.content.map((block, index) => (
          <View
            key={index}
            className={isUser ? 'text-white' : 'text-gray-900'}>
            {renderContentBlock(block, index)}
          </View>
        ))}
      </View>
      <Text
        className={`mt-1 text-xs text-gray-400 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
        {getRelativeTime(message.createdAt)}
      </Text>
    </TouchableOpacity>
  );
}
```

- [ ] Step 4: Create MessageInput

```typescript
// src/features/chat/components/MessageInput.tsx
import { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  sending?: boolean;
}

/** Text input with auto-grow and send button. */
export function MessageInput({ onSend, disabled, sending }: MessageInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View className="border-t border-gray-200 bg-white px-4 py-3">
      <View className="flex-row items-end gap-2">
        <TextInput
          ref={inputRef}
          className="min-h-[44px] max-h-[132px] flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900"
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={1}
          maxLength={10000}
          value={text}
          onChangeText={setText}
          editable={!sending}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          className={`h-11 w-11 items-center justify-center rounded-full ${
            canSend ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
          activeOpacity={0.7}>
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View className="h-0 w-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

- [ ] Step 5: Create MessageList

```typescript
// src/features/chat/components/MessageList.tsx
import { useRef, useEffect } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import type { Message } from '../../../shared/api/types';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from '../../../shared/components/EmptyState';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onDelete?: (messageId: string) => void;
}

/** Inverted FlatList displaying messages with auto-scroll. */
export function MessageList({ messages, isLoading, onDelete }: MessageListProps) {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="No messages yet"
        subtitle="Send a message to start chatting"
      />
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageBubble message={item} onDelete={onDelete} />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: false })
      }
    />
  );
}
```

---

### Task 13: Chat Screen

**Files:**

- Create: `src/features/chat/screens/ChatScreen.tsx`

- [ ] Step 1: Create ChatScreen with SSE integration

```typescript
// src/features/chat/screens/ChatScreen.tsx
import { useEffect, useRef, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { useMessages, useSendMessage, useDeleteMessage } from '../hooks/use-chat';
import { useChatStore } from '../store/chat-store';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { LoadingScreen } from '../../../shared/components/LoadingScreen';
import { ErrorView } from '../../../shared/components/ErrorView';
import { createSessionSSE, type SSEConnection } from '../../../shared/api/sse';
import { queryKeys } from '../../../shared/api/query-keys';
import type { ContentBlock, Message } from '../../../shared/api/types';

/** Main chat screen with SSE streaming and message management. */
export default function ChatScreen() {
  const { sessionId, projectId } = useLocalSearchParams<{
    sessionId: string;
    projectId: string;
  }>();
  const queryClient = useQueryClient();
  const sseRef = useRef<SSEConnection | null>(null);
  const [streamingMessages, setStreamingMessages] = useState<Map<string, ContentBlock[]>>(new Map());

  const { data: messages, isLoading, isError, error } = useMessages(projectId, sessionId);
  const sendMessage = useSendMessage(projectId, sessionId);
  const deleteMessage = useDeleteMessage(projectId, sessionId);
  const chatStore = useChatStore();

  // Merge streaming messages with fetched messages
  const allMessages: Message[] = [];
  if (messages) {
    allMessages.push(...messages);
  }

  // Add any in-progress streaming messages
  streamingMessages.forEach((contentBlocks, msgId) => {
    const existingIndex = allMessages.findIndex((m) => m.id === msgId);
    if (existingIndex >= 0) {
      allMessages[existingIndex] = {
        ...allMessages[existingIndex],
        content: contentBlocks,
      };
    } else {
      allMessages.push({
        id: msgId,
        sessionId,
        role: 'assistant',
        content: contentBlocks,
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Sort by creation time
  allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSend = useCallback(
    (content: string) => {
      sendMessage.mutate(content);
    },
    [sendMessage]
  );

  const handleDelete = useCallback(
    (messageId: string) => {
      deleteMessage.mutate(messageId);
    },
    [deleteMessage]
  );

  // SSE connection
  useEffect(() => {
    if (!sessionId) return;

    const handleEvent = (event: { type: string; data: string }) => {
      try {
        const data = JSON.parse(event.data);

        if (event.type === 'message.updated' || event.type === 'message.created') {
          const msgId = data.id;
          if (msgId) {
            setStreamingMessages((prev) => {
              const next = new Map(prev);
              if (data.content) {
                next.set(msgId, data.content);
              }
              return next;
            });
          }
        }

        if (event.type === 'message.completed') {
          const msgId = data.id;
          if (msgId) {
            setStreamingMessages((prev) => {
              const next = new Map(prev);
              next.delete(msgId);
              return next;
            });
            queryClient.invalidateQueries({
              queryKey: queryKeys.messages.bySession(sessionId),
            });
          }
        }
      } catch {
        // Ignore parse errors for non-JSON events
      }
    };

    const handleError = (error: Error) => {
      console.warn('SSE error:', error.message);
    };

    sseRef.current = createSessionSSE(sessionId, handleEvent, handleError);

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [sessionId, queryClient]);

  if (isLoading) {
    return <LoadingScreen message="Loading messages..." />;
  }

  if (isError) {
    return (
      <ErrorView
        message={error instanceof Error ? error.message : 'Failed to load messages.'}
      />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chat' }} />
      <View className="flex-1 bg-white">
        <MessageList
          messages={allMessages}
          onDelete={handleDelete}
        />
        <MessageInput
          onSend={handleSend}
          sending={sendMessage.isPending}
        />
      </View>
    </>
  );
}
```

---

### Task 14: Final Verification

- [ ] Step 1: Update public exports

```typescript
// src/features/chat/index.ts
export { useMessages, useCreateSession, useDeleteMessage, useSendMessage } from './hooks/use-chat';
export { useChatStore } from './store/chat-store';
export { messageSchema } from './validators/message';
export type { MessageFormData } from './validators/message';
export { MessageBubble } from './components/MessageBubble';
export { MessageInput } from './components/MessageInput';
export { MessageList } from './components/MessageList';
export { ToolCallBlock } from './components/ToolCallBlock';
export { MarkdownRenderer } from './components/MarkdownRenderer';
```

- [ ] Step 2: Run lint to verify no errors

```bash
cd /Users/harrison/Downloads/remote-code && npx eslint src/features/chat/ --ext .ts,.tsx
```

- [ ] Step 3: Run TypeScript check

```bash
cd /Users/harrison/Downloads/remote-code && npx tsc --noEmit
```

---

## Commit

```bash
git add src/features/chat/
git commit -m "feat(chat): real-time chat with SSE streaming, markdown, tool calls, and message management"
```
