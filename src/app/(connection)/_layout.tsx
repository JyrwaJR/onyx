import { Stack } from 'expo-router';

/**
 * Connection layout with Claude design system styling.
 *
 * Hides header for the connection screen.
 */
export default function ConnectionLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
