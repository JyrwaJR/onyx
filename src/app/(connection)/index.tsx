import { Redirect, Stack } from 'expo-router';
import { useConnectionStore } from '../../features/connection/store/connection-store';
import ConnectionScreen from '../../features/connection/screens/ConnectionScreen';

export default function ConnectionIndex() {
  const { serverUrl, hydrated } = useConnectionStore();

  if (hydrated && serverUrl) {
    return <Redirect href="/(tabs)/projects" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ConnectionScreen />
    </>
  );
}
