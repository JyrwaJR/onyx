# Navigation Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure Expo Router navigation with QueryClientProvider, tab-based navigation, and connection guard.

**Architecture:** Root layout wraps everything in QueryClientProvider + SafeAreaProvider. Connection flow is a separate route group. Main app uses bottom tabs (Projects, Settings) with stack navigation within each tab. Connection guard in tabs layout redirects unauthenticated users.

**Tech Stack:** Expo Router, React Query, Zustand, React Native

---

### Task 1: Create Root Layout with QueryClientProvider

**Files:**
- Modify: `src/app/_layout.tsx`

- [ ] **Step 1: Replace root layout**

Replace the entire content of `src/app/_layout.tsx` with:

```tsx
import '../../global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../shared/api/query-client';
import { useConnectionStore } from '../features/connection/store/connection-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = useConnectionStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync();
    }
  }, [hydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(connection)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/_layout.tsx
git commit -m "refactor(navigation): add QueryClientProvider and SafeAreaProvider to root layout"
```

---

### Task 2: Create Connection Flow Layout and Index

**Files:**
- Create: `src/app/(connection)/_layout.tsx`
- Create: `src/app/(connection)/index.tsx`

- [ ] **Step 1: Create connection layout**

```tsx
import { Stack } from 'expo-router';

export default function ConnectionLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Create connection index**

```tsx
import { Redirect, Stack } from 'expo-router';
import { useConnectionStore } from '../../features/connection/store/connection-store';
import ConnectionScreen from '../../features/connection/screens/ConnectionScreen';

export default function ConnectionIndex() {
  const { serverUrl, hydrated } = useConnectionStore();

  if (!hydrated) {
    return null;
  }

  if (serverUrl) {
    return <Redirect href="/(tabs)/projects" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ConnectionScreen />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(connection)/_layout.tsx src/app/(connection)/index.tsx
git commit -m "feat(navigation): add connection flow layout and index with redirect guard"
```

---

### Task 3: Create Tabs Layout with Connection Guard

**Files:**
- Create: `src/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Create tabs layout**

```tsx
import { Redirect, Tabs } from 'expo-router';
import { useConnectionStore } from '../../features/connection/store/connection-store';

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
          tabBarIcon: ({ color }) => <TabIcon label="P" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon label="S" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <TabBarIcon color={color} size={24} label={label} />
  );
}
```

- [ ] **Step 2: Create TabBarIcon component**

```tsx
// src/shared/components/TabBarIcon.tsx
import { Text } from 'react-native';

interface TabBarIconProps {
  color: string;
  size: number;
  label: string;
}

export function TabBarIcon({ color, size, label }: TabBarIconProps) {
  return (
    <Text style={{ color, fontSize: size, fontWeight: '600' }}>
      {label}
    </Text>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(tabs)/_layout.tsx src/shared/components/TabBarIcon.tsx
git commit -m "feat(navigation): add tabs layout with connection guard and tab icons"
```

---

### Task 4: Create Projects Tab Structure

**Files:**
- Create: `src/app/(tabs)/projects/_layout.tsx`
- Create: `src/app/(tabs)/projects/index.tsx`
- Create: `src/app/(tabs)/projects/[projectId]/sessions/_layout.tsx`
- Create: `src/app/(tabs)/projects/[projectId]/sessions/index.tsx`
- Create: `src/app/(tabs)/projects/[projectId]/sessions/[sessionId]/_layout.tsx`
- Create: `src/app/(tabs)/projects/[projectId]/sessions/[sessionId]/chat.tsx`

- [ ] **Step 1: Create projects layout**

```tsx
import { Stack } from 'expo-router';

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Projects' }} />
      <Stack.Screen name="[projectId]/sessions" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Create projects index**

```tsx
import ProjectsScreen from '../../../../features/projects/screens/ProjectsScreen';

export default function ProjectsIndex() {
  return <ProjectsScreen />;
}
```

- [ ] **Step 3: Create sessions layout**

```tsx
import { Stack } from 'expo-router';

export default function SessionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Sessions' }} />
      <Stack.Screen name="[sessionId]" options={{ headerShown: false }} />
    </Stack>
  );
}
```

- [ ] **Step 4: Create sessions index**

```tsx
import SessionsScreen from '../../../../../features/sessions/screens/SessionsScreen';

export default function SessionsIndex() {
  return <SessionsScreen />;
}
```

- [ ] **Step 5: Create chat layout**

```tsx
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="chat" options={{ title: 'Chat' }} />
    </Stack>
  );
}
```

- [ ] **Step 6: Create chat index**

```tsx
import ChatScreen from '../../../../../../features/chat/screens/ChatScreen';

export default function ChatIndex() {
  return <ChatScreen />;
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/(tabs)/projects/
git commit -m "feat(navigation): add projects tab with sessions and chat routes"
```

---

### Task 5: Create Settings Tab

**Files:**
- Create: `src/app/(tabs)/settings/_layout.tsx`
- Create: `src/app/(tabs)/settings/index.tsx`

- [ ] **Step 1: Create settings layout**

```tsx
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
    </Stack>
  );
}
```

- [ ] **Step 2: Create settings index**

```tsx
import { View, Text, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useConnectionStore } from '../../../../features/connection/store/connection-store';

export default function SettingsIndex() {
  const router = useRouter();
  const { serverUrl, disconnect } = useConnectionStore();

  const handleDisconnect = () => {
    disconnect();
    router.replace('/(connection)');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="flex-1 bg-white px-6 pt-6">
        <View className="mb-8">
          <Text className="text-sm font-medium text-gray-500">Server URL</Text>
          <Text className="mt-1 text-base text-gray-900">{serverUrl || 'Not connected'}</Text>
        </View>

        <Pressable
          onPress={handleDisconnect}
          className="items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <Text className="text-base font-medium text-red-600">Disconnect</Text>
        </Pressable>

        <View className="mt-auto items-center pb-6">
          <Text className="text-xs text-gray-400">Onyx v1.0.0</Text>
        </View>
      </View>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(tabs)/settings/
git commit -m "feat(navigation): add settings tab with disconnect and version info"
```

---

### Task 6: Clean Up Old Files

**Files:**
- Delete: `src/app/index.tsx`
- Delete: `src/app/modal.tsx`
- Delete: `src/app/+html.tsx`

- [ ] **Step 1: Remove old files**

```bash
rm src/app/index.tsx src/app/modal.tsx src/app/+html.tsx
```

- [ ] **Step 2: Verify +not-found.tsx exists**

```bash
ls src/app/+not-found.tsx
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(navigation): remove old root index, modal, and html files"
```

---

### Task 7: Final Commit

- [ ] **Step 1: Verify build**

```bash
npx expo export --platform ios
```

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "refactor(navigation): restructure routing with QueryClientProvider, tab layout, and connection guard"
```
