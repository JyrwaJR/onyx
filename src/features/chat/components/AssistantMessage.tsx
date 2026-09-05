import { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { V2Message } from '../../../shared/api/types';

interface AssistantMessageProps {
  message: V2Message;
  isStreaming: boolean;
  isReasoningOpen: boolean;
  onToggleReasoning: () => void;
}

/**
 * Assistant message card with agent metadata, reasoning tray, body text,
 * tool badges, and action pills.
 *
 * @param message - The assistant message to render.
 * @param isStreaming - Whether this message is still being streamed via SSE.
 * @param isReasoningOpen - Whether the reasoning tray is expanded.
 * @param onToggleReasoning - Callback to toggle reasoning visibility.
 */
export const AssistantMessage = memo(function AssistantMessage({
  message,
  isStreaming,
  isReasoningOpen,
  onToggleReasoning,
}: AssistantMessageProps) {
  const reasoningBlocks = message.content?.filter((b) => b.type === 'reasoning') ?? [];
  const textBlocks = message.content?.filter((b) => b.type === 'text') ?? [];
  const toolBlocks = message.content?.filter((b) => b.type === 'tool') ?? [];
  const [expandedIds, setExpandedIds] = useState(new Set<string>());
  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  return (
    <View className="mb-4 mr-2">
      {/* Agent Metadata Header */}
      <View className="mb-1.5 flex-row items-center gap-1.5">
        <View className="h-6 w-6 items-center justify-center rounded-md bg-[#f0edeb]">
          <MaterialIcons name="auto-awesome" size={15} color="#8f482f" />
        </View>
        <Text className="text-base font-medium text-[#1c1c1a]">{message.agent ?? 'Onyx'}</Text>
        {isStreaming ? (
          <View className="flex-row items-center gap-1">
            <View className="h-1.5 w-1.5 rounded-full bg-[#8f482f]" />
            <Text className="text-[11px] font-medium text-[#8f482f]">Streaming</Text>
          </View>
        ) : (
          <View className="rounded bg-[#f0edeb] px-1.5 py-0.5">
            <Text className="text-[11px] text-[#5e5c54]">
              {message.tokens?.output
                ? `${(message.tokens.output / 1000).toFixed(1)}k tok`
                : 'Done'}
            </Text>
          </View>
        )}
      </View>

      {/* Agent Card */}
      <View className="gap-3 rounded-xl bg-[#f0edeb] p-4">
        {/* Collapsible Reasoning Tray */}
        {reasoningBlocks.length > 0 && (
          <View className="rounded-lg bg-[#ebe8e5] p-2.5">
            <TouchableOpacity
              onPress={onToggleReasoning}
              activeOpacity={0.7}
              className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="psychology" size={16} color="#8f482f" />
                <Text className="text-xs font-semibold text-[#54433e]">
                  Reasoning ({reasoningBlocks.length} steps)
                </Text>
              </View>
              <MaterialIcons
                name={isReasoningOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={18}
                color="#5e5c54"
              />
            </TouchableOpacity>

            {isReasoningOpen && (
              <View className="mt-2 gap-1.5 border-t border-[#dac1ba]/30 pl-6 pt-2">
                {reasoningBlocks.map((block, idx) => (
                  <View key={idx} className="flex-row items-center gap-2">
                    <View className="h-1.5 w-1.5 rounded-full bg-[#8f482f]" />
                    <Text className="text-xs text-[#5e5c54]" numberOfLines={2}>
                      {block.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Body Text */}
        {textBlocks.map((block, idx) => (
          <Text key={idx} className="text-sm leading-relaxed text-[#1c1c1a]">
            {block.text}
          </Text>
        ))}

        {/* Tool Execution Badges */}
        {toolBlocks.map((block, idx) => {
          const isExpanded = expandedIds.has(block.id);
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => toggleExpanded(block.id)}
              activeOpacity={0.8}
              className="rounded-lg bg-[#e6e2da] p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-1.5 pr-2">
                  <MaterialIcons name="task-alt" size={18} color="#8f482f" />
                  <Text className="text-xs font-semibold text-[#1c1c1a]" numberOfLines={1}>
                    Running <Text className="font-mono text-[#8f482f]">{block.tool}</Text>
                  </Text>
                </View>
                <View className="self-start rounded bg-[#ffffff] px-1.5 py-0.5">
                  <Text className="text-[11px] text-[#1c1c1a]">
                    {block.state.status === 'completed' ? 'Done' : 'Running'}
                  </Text>
                </View>
              </View>
              {block.state.input && (
                <View className="mt-2 border-t border-[#dac1ba]/30 pt-2">
                  <Text
                    className="font-mono text-[10px] text-[#5e5c54]"
                    numberOfLines={isExpanded ? undefined : 2}>
                    {JSON.stringify(block.state.input, null, 2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Action Pills 
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          className="pt-1">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center gap-1 rounded-xl bg-[#8f482f] px-3 py-2">
            <MaterialIcons name="check" size={16} color="#ffffff" />
            <Text className="text-xs font-semibold text-white">Accept Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center gap-1 rounded-xl bg-[#e6e2da] px-3 py-2">
            <MaterialIcons name="play-arrow" size={16} color="#1c1c17" />
            <Text className="text-xs font-semibold text-[#1c1c17]">Run Tests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center gap-1 rounded-xl bg-[#ebe8e5] px-3 py-2">
            <MaterialIcons name="help-outline" size={16} color="#1c1c1a" />
            <Text className="text-xs font-semibold text-[#1c1c1a]">Explain logic</Text>
          </TouchableOpacity>
        </ScrollView>
        */}
      </View>
      <Text className="ml-1 mt-1 text-[11px] text-[#5e5c54]">
        {new Date(message.time.created).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
});
