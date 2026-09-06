import { useRef, useState, useCallback } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface UseScrollToBottomOptions {
  /** Threshold distance (in px) from bottom to toggle FAB visibility. Default: 60 */
  bottomThreshold?: number;
  /** Additional custom onScroll logic (e.g. infinite scrolling / fetchNextPage) */
  onScrollCallback?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useScrollToBottom({
  bottomThreshold = 60,
  onScrollCallback,
}: UseScrollToBottomOptions = {}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  /**
   * Scrolls the ScrollView smoothly to the bottom.
   */
  const scrollToBottom = useCallback((animated = true) => {
    scrollViewRef.current?.scrollToEnd({ animated });
  }, []);

  /**
   * Tracks scroll positions and toggles FAB state when user scrolls away from bottom.
   */
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - bottomThreshold;

      setShowScrollToBottom(!isNearBottom);

      // Trigger extra onScroll handlers if provided
      onScrollCallback?.(e);
    },
    [bottomThreshold, onScrollCallback]
  );

  return {
    scrollViewRef,
    showScrollToBottom,
    scrollToBottom,
    handleScroll,
  };
}
