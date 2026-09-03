import { Redirect, Tabs } from 'expo-router';
import { useConnectionStore } from '../../features/connection/store/connection-store';
import { TabBarIcon } from '../../shared/components/TabBarIcon';

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
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopColor: '#E5E7EB',
        },
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
