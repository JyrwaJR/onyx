import { Redirect, Tabs } from 'expo-router';
import { useConnectionStore } from '../../features/connection/store/connection-store';
import { TabBarIcon } from '../../shared/components/TabBarIcon';

/**
 * Tab layout with Claude design system styling.
 *
 * Uses coral primary for active tab, muted for inactive,
 * and hairline border at the top.
 */
export default function TabsLayout() {
  const { serverUrl, hydrated } = useConnectionStore();

  if (!hydrated) {
    return null;
  }

  if (!serverUrl) {
    return <Redirect href="/(connection)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#cc785c',
        tabBarInactiveTintColor: '#6c6a64',
        tabBarStyle: {
          backgroundColor: '#faf9f5',
          borderTopColor: '#e6dfd8',
        },
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
      }}>
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} size={24} label="P" />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon color={color} size={24} label="S" />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
