import { Stack } from 'expo-router';

/**
 * Projects layout with Claude design system styling.
 *
 * Provides styled headers for project and session screens.
 */
export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Projects',
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
      <Stack.Screen name="[projectId]/sessions" options={{ headerShown: false }} />
    </Stack>
  );
}
