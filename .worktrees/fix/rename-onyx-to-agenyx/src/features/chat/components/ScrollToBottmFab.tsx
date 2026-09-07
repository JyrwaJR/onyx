import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ScrollToBottomFABProps {
  /** Controls visibility of the floating button */
  visible: boolean;
  /** Callback triggered when the button is pressed */
  onPress: () => void;
  /** Optional custom position or styling overrides using Tailwind */
  className?: string;
}

/**
 * Floating action button that appears when the user scrolls up,
 * allowing them to jump back to the bottom of the chat stream.
 */
export function ScrollToBottomFAB({ visible, onPress, className = '' }: ScrollToBottomFABProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`absolute bottom-48 right-4 z-50 h-10 w-10 items-center justify-center rounded-full border border-[#dac1ba] bg-[#efe7e1] shadow-md active:bg-[#f0edeb] ${className}`}>
      <MaterialIcons name="keyboard-arrow-down" size={24} color="#8f482f" />
    </TouchableOpacity>
  );
}
