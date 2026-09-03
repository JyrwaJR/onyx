import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { ContentBlock } from '../../../shared/api/types';

interface ToolCallBlockProps {
  block: Extract<ContentBlock, { type: 'tool-invocation' }>;
}

function formatResult(result: unknown): string {
  if (typeof result === 'string') return result;
  return JSON.stringify(result, null, 2);
}

/**
 * Collapsible display for a tool call with arguments and result.
 *
 * @param block - The tool invocation content block to display.
 */
export function ToolCallBlock({ block }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const hasResult = block.result != null;

  return (
    <View className="my-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-gray-700">{block.toolName}</Text>
          <Text className="text-xs text-gray-400">{expanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2">
          <Text className="text-xs text-gray-500">Arguments:</Text>
          <Text className="mt-1 rounded bg-white p-2 text-xs text-gray-600" selectable>
            {JSON.stringify(block.args, null, 2)}
          </Text>

          {hasResult && (
            <>
              <Text className="mt-2 text-xs text-gray-500">Result:</Text>
              <Text className="mt-1 rounded bg-white p-2 text-xs text-gray-600" selectable>
                {formatResult(block.result)}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}
