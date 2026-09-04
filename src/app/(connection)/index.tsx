import { Redirect } from 'expo-router';
import ConnectionScreen from '@features/connection/screens/ConnectionScreen';
import { useConnectionStore } from '@/shared/stores';

export default function ConnectionIndex() {
  const { serverUrl, hydrated } = useConnectionStore();

  if (hydrated && serverUrl) {
    return <Redirect href="/projects" />;
  }

  return <ConnectionScreen />;
}
