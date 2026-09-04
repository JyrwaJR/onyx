import { View } from 'react-native';

interface ContainerProps {
  children: React.ReactNode;
}

/**
 * Safe-area flex container with cream canvas background.
 *
 * @param children - Child elements to render inside the container.
 */
export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <View className={'p-safe flex flex-1 bg-surface'}>{children}</View>;
};
