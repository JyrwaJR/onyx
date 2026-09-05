import { Tabs } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarActiveTintColor: '#1e1b18',
          tabBarStyle: {
            backgroundColor: '#fcf9f6',
          },
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="cloud-download" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
