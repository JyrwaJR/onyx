import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import { ScrollToBottomFAB } from '../ScrollToBottmFab';

interface ChatScrollContextType<T = any> {
  listRef: React.RefObject<FlashListRef<T> | null>;
  isAtBottom: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollToBottom: (animated?: boolean) => void;
  notifyContentChanged: (animated?: boolean) => void;
}

const ChatScrollContext = createContext<ChatScrollContextType<any> | null>(null);

interface ChatScrollProviderProps {
  children: React.ReactNode;
  bottomThreshold?: number;
}

export function ChatScrollProvider({ children, bottomThreshold = 80 }: ChatScrollProviderProps) {
  const listRef = useRef<FlashListRef<any> | null>(null);
  const isAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Measure distance from bottom on every scroll event
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

      const nearBottom = distanceFromBottom <= bottomThreshold;
      isAtBottomRef.current = nearBottom;

      // Only trigger re-renders when the threshold boolean toggles
      setIsAtBottom((prev) => (prev !== nearBottom ? nearBottom : prev));
    },
    [bottomThreshold]
  );

  const scrollToBottom = useCallback((animated = true) => {
    listRef.current?.scrollToEnd({ animated });
    isAtBottomRef.current = true;
    setIsAtBottom(true);
  }, []);

  // Default animated to false to prevent animation frame queueing during fast SSE token bursts
  const notifyContentChanged = useCallback((animated = false) => {
    if (isAtBottomRef.current) {
      listRef.current?.scrollToEnd({ animated });
    }
  }, []);

  return (
    <ChatScrollContext.Provider
      value={{
        listRef,
        isAtBottom,
        handleScroll,
        scrollToBottom,
        notifyContentChanged,
      }}>
      {children}
      <ScrollToBottomFAB visible={!isAtBottom} onPress={() => scrollToBottom(true)} />
    </ChatScrollContext.Provider>
  );
}

export function useChatScroll<T = any>() {
  const context = useContext(ChatScrollContext);
  if (!context) {
    throw new Error('useChatScroll must be used within a ChatScrollProvider');
  }
  return context as ChatScrollContextType<T>;
}
