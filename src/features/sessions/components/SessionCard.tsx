/**
 * @file Card component displaying a single session summary.
 *
 * Shows session title (or "Untitled"), relative timestamp.
 * Tapping navigates to the chat screen for that session.
 * Long-press triggers a delete confirmation.
 */

import { Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import type { Session } from '../../../shared/api/types';
import { useDeleteSession } from '../hooks/use-sessions';

interface SessionCardProps {
  session: Session;
  projectId: string;
}

function getRelativeTime(ms?: number): string {
  if (!ms) return '';
  const now = Date.now();
  const diffMs = now - ms;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(ms).toLocaleDateString();
}

/** Card for displaying a session with navigation and long-press delete. */
export function SessionCard({ session, projectId }: SessionCardProps) {
  const router = useRouter();
  const deleteSession = useDeleteSession(projectId);

  const handlePress = () => {
    router.push(`/(tabs)/projects/${projectId}/sessions/${session.id}/chat` as never);
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
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      activeOpacity={0.7}>
      <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
        {session.title || 'Untitled'}
      </Text>
      <Text className="mt-1 text-xs text-gray-400">{getRelativeTime(session.time.updated)}</Text>
    </TouchableOpacity>
  );
}
