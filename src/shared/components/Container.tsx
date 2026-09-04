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
  return <View className={styles.container}>{children}</View>;
};

const styles = {
  container: 'flex flex-1 p-safe bg-canvas',
};
