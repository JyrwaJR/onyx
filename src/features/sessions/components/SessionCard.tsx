/**
 * @file Card component displaying a single session summary.
 *
 * Shows session title (or "Untitled"), relative timestamp.
 * Tapping navigates to the chat screen for that session.
 * Long-press triggers a delete confirmation.
 */

import { Text, TouchableOpacity, Alert, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { SessionT } from '../../../shared/api/types';
import { useDeleteSession } from '../hooks/use-sessions';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '@/shared/utils/helpers/format';

interface SessionCardProps {
  session: SessionT;
  projectId: string;
}

/**
 * Card for displaying a session with navigation to chat.
 *
 * Uses Claude design system surface-card background with hairline border.
 *
 * @param session - The session data to display.
 * @param projectId - The parent project ID for navigation.
 */
export function SessionCard({ session, projectId }: SessionCardProps) {
  const router = useRouter();
  const deleteSession = useDeleteSession(projectId);

  const handlePress = () => {
    router.push(`/chat?sessionId=${session.id}&projectId=${projectId}` as never);
  };

  const handleLongPress = () => {
    Alert.alert('Delete Session', `Delete "${session.title || 'Untitled'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSession.mutate(session.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      key={session.id}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between rounded-md border border-[#dac1ba] bg-[#efe7e1] p-5 active:border-[#87736d]">
      <View className="flex-1 flex-row items-center gap-4 pr-2">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-white">
          <MaterialIcons name={'terminal'} size={20} color="#8f482f" />
        </View>

        <View className="flex-1 justify-center">
          <Text className="text-base font-medium text-[#1e1b18]" numberOfLines={1}>
            {session.title}
          </Text>
          <Text className="mt-0.5 text-xs font-normal text-[#615e56]">
            {formatDate(session.time.updated)}
          </Text>
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={20} color="#54433e" />
    </TouchableOpacity>
  );
}
