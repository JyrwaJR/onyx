/**
 * @file Sessions screen — displays the list of sessions for a project.
 *
 * Renders a header with "Sessions" title, a FAB for creating new sessions,
 * and the SessionList component. Receives projectId from route params.
 */

import { useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Fab } from '@/shared/components/ui/fab';
import { SessionList } from '../components/SessionList';
import { NewSessionForm } from '../components/NewSessionForm';

/**
 * Sessions screen showing the list of sessions for a project.
 *
 * Uses Claude design system with coral FAB and styled header.
 *
 * @param projectId - The project ID from route params.
 */
export default function SessionsScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const [formVisible, setFormVisible] = useState(false);

  return (
    <>
      <Stack.Screen
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
      <View className="flex-1 bg-canvas">
        <SessionList projectId={projectId} />

        <Fab onPress={() => setFormVisible(true)} />

        <NewSessionForm
          projectId={projectId}
          visible={formVisible}
          onClose={() => setFormVisible(false)}
        />
      </View>
    </>
  );
}
