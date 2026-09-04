import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { MessageContentBlock } from '../../../shared/api/types';

type ToolBlock = Extract<MessageContentBlock, { type: 'tool' }>;

interface ToolCallBlockProps {
  block: ToolBlock;
}

function formatResult(result: unknown): string {
  if (typeof result === 'string') return result;
  return JSON.stringify(result, null, 2);
}

/**
 * Collapsible display for a tool call with arguments and result.
 *
 * Uses Claude design system surface colors for backgrounds and borders.
 *
 * @param block - The tool content block to display.
 */
export function ToolCallBlock({ block }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const hasResult = block.state.output != null;

  return (
    <View className="my-1 rounded-lg border border-outline-variant bg-surface-container-low p-2">
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-on-surface">
            {block.state.title || block.tool}
          </Text>
          <Text className="text-xs text-outline-variant">{expanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2">
          {block.state.input != null && (
            <>
              <Text className="text-xs text-outline">Arguments:</Text>
              <Text
                className="mt-1 rounded bg-surface p-2 text-xs text-on-surface-variant"
                selectable>
                {JSON.stringify(block.state.input, null, 2)}
              </Text>
            </>
          )}

          {hasResult && (
            <>
              <Text className="mt-2 text-xs text-outline">Result:</Text>
              <Text
                className="mt-1 rounded bg-surface p-2 text-xs text-on-surface-variant"
                selectable>
                {formatResult(block.state.output)}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}
