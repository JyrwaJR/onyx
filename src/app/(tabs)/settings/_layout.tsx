import { Stack } from 'expo-router';

/**
 * Settings layout with Claude design system styling.
 *
 * Provides styled header for the settings screen.
 */
export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
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
