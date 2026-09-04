import { Stack } from 'expo-router';

/**
 * Sessions layout with Claude design system styling.
 *
 * Provides styled headers for session and chat screens.
 */
export default function SessionsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Sessions',
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
      <Stack.Screen name="[sessionId]" options={{ headerShown: false }} />
    </Stack>
  );
}
