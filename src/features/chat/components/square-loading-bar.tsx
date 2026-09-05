import { useEffect, useState, useMemo } from 'react';
import { View, Animated } from 'react-native';

type SquareLoadingBarProps = {
  isLoading?: boolean;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  duration?: number;
};

export function SquareLoadingBar({
  isLoading = true,
  size = 10,
  activeColor = '#8f482f',
  inactiveColor = '#dac1ba',
  duration = 900,
}: SquareLoadingBarProps) {
  // Lazy state initialization: creates Animated.Value ONLY ONCE on initial mount
  const [animValue] = useState(() => new Animated.Value(0));

  // Memoize interpolations using the stable animValue state
  const interpolations = useMemo(() => {
    return [0, 1, 2, 3].map((index) => ({
      opacity: animValue.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
          index === 0 ? 1 : 0.25,
          index === 1 ? 1 : 0.25,
          index === 2 ? 1 : 0.25,
          index === 3 ? 1 : 0.25,
        ],
      }),
      scale: animValue.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
          index === 0 ? 1.15 : 1,
          index === 1 ? 1.15 : 1,
          index === 2 ? 1.15 : 1,
          index === 3 ? 1.15 : 1,
        ],
      }),
    }));
  }, [animValue]);

  useEffect(() => {
    if (!isLoading) {
      animValue.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(animValue, {
        toValue: 3,
        duration,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [animValue, duration, isLoading]);

  return (
    <View className="flex-row items-center gap-1.5 px-2">
      {interpolations.map((anim, index) => (
        <Animated.View
          key={index}
          className="rounded-[2px]"
          style={{
            width: size,
            height: size,
            backgroundColor: isLoading ? activeColor : inactiveColor,
            opacity: isLoading ? anim.opacity : 0.25,
            transform: [{ scale: isLoading ? anim.scale : 1 }],
          }}
        />
      ))}
    </View>
  );
}
