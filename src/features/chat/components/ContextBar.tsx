import { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from '../hooks/use-context';

interface ContextBarProps {
  /** Session ID to fetch context files for. */
  sessionId: string;
}

/**
 * Horizontal scrollable bar of context file chips above the input.
 *
 * Fetches attached files from the session context API and displays
 * each as a pill. Shows "Context" and "Repo file" action buttons.
 *
 * @param sessionId - The session to fetch context files for.
 */
export const ContextBar = memo(function ContextBar({ sessionId }: ContextBarProps) {
  const { data } = useContext(sessionId);

  // Extract unique file names from all snapshot.files across messages.
  // data is SessionContextI with a .data array of messages.
  const files = data?.data
    ? [...new Set(data.data.flatMap((msg) => msg.snapshot?.files ?? []))]
    : [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
      className="pb-1 pt-2">
      {files.map((file) => (
        <View
          key={file}
          className="flex-row items-center gap-1 rounded-full bg-[#f0edeb] px-2.5 py-1">
          <MaterialIcons name="description" size={14} color="#8f482f" />
          <Text className="text-xs text-[#1c1c1a]">{file}</Text>
        </View>
      ))}

      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="add" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Context</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="alternate-email" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Repo file</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});
