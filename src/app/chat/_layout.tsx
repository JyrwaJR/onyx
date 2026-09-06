import { ChatScrollProvider } from '@/features/chat/components/providers/chat-scroll';
import { Stack } from 'expo-router';

export default function layout() {
  return (
    <ChatScrollProvider bottomThreshold={60}>
      <Stack screenOptions={{ headerShown: false }} />
    </ChatScrollProvider>
  );
}
