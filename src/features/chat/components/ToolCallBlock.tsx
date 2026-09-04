import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { MessagePart } from '../../../shared/api/types';

type ToolPart = Extract<MessagePart, { type: 'tool' }>;

interface ToolCallBlockProps {
  part: ToolPart;
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
 * @param part - The tool message part to display.
 */
export function ToolCallBlock({ part }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const hasResult = part.state.output != null;

  return (
    <View className="my-1 rounded-lg border border-hairline bg-surface-soft p-2">
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium text-body-strong">
            {part.state.title || part.tool}
          </Text>
          <Text className="text-xs text-muted-soft">{expanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2">
          {part.state.input != null && (
            <>
              <Text className="text-xs text-muted">Arguments:</Text>
              <Text className="mt-1 rounded bg-canvas p-2 text-xs text-body" selectable>
                {JSON.stringify(part.state.input, null, 2)}
              </Text>
            </>
          )}

          {hasResult && (
            <>
              <Text className="mt-2 text-xs text-muted">Result:</Text>
              <Text className="mt-1 rounded bg-canvas p-2 text-xs text-body" selectable>
                {formatResult(part.state.output)}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}
