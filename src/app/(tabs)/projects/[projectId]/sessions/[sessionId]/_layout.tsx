import { Stack } from 'expo-router';

/**
 * Chat layout with Claude design system styling.
 *
 * Provides styled header with back button for the chat screen.
 */
export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerStyle: {
            backgroundColor: '#faf9f5',
          },
          headerTintColor: '#141413',
          headerTitleStyle: {
            fontWeight: '500',
            fontSize: 18,
            fontFamily: 'Inter',
          },
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
