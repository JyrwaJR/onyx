import { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { MessageContentBlock } from '../../../shared/api/types';
import { useSubagentStore } from '../store/subagent-store';
import { resolveChildSessionID } from '../utils/subagent-events';

type ToolBlock = Extract<MessageContentBlock, { type: 'tool' }>;

interface SubagentToolCallButtonProps {
  /** The subagent tool part block from the assistant message. */
  block: ToolBlock;
  /** The current (parent) session ID. */
  sessionId: string;
  /** The current project ID — fallback when the child's project is unknown. */
  projectId: string;
}

/**
 * Inline button rendered at a subagent tool-call position in the assistant
 * message. Resolves the spawned child session (tool output → store claims →
 * agent match), then navigates to that child session on tap. Shows a
 * "resolving" state while the child session ID is not yet known.
 *
 * @param block - The `task`/`agent` tool part block.
 * @param sessionId - Parent (current) session ID.
 * @param projectId - Parent project ID used as a navigation fallback.
 */
export function SubagentToolCallButton({
  block,
  sessionId,
  projectId,
}: SubagentToolCallButtonProps) {
  const router = useRouter();
  const children = useSubagentStore((state) => state.childrenByParent[sessionId] ?? EMPTY_CHILDREN);
  const claimsByPartId = useSubagentStore((state) => state.claimsByPartId);
  const claimChild = useSubagentStore((state) => state.claimChild);

  const input = block.state.input as Record<string, unknown> | undefined;
  // E2E-verified (2026-09-06): the tool-input field for the agent name is
  // `subagent_type` (e.g. "explore"/"general"), not `subagent` (kept as a
  // fallback). The displayed label still prefers `SubagentSession.agent`
  // from `session.created` `info.agent` when available.
  const agent =
    typeof input?.subagent_type === 'string'
      ? input.subagent_type
      : typeof input?.subagent === 'string'
        ? input.subagent
        : block.tool;

  const resolvedSessionId = useMemo(
    () =>
      claimsByPartId[block.id] ??
      resolveChildSessionID(
        agent,
        block.state.output,
        children,
        sessionId,
        block.state.metadata?.sessionId
      ),
    [
      claimsByPartId,
      block.id,
      agent,
      block.state.output,
      children,
      sessionId,
      block.state.metadata?.sessionId,
    ]
  );

  // Persist the resolution so it is stable across re-renders and other
  // components. Idempotent — the store guards duplicate claims per part ID.
  useEffect(() => {
    if (resolvedSessionId) {
      claimChild(sessionId, block.id, resolvedSessionId);
    }
  }, [resolvedSessionId, claimChild, sessionId, block.id]);

  const child = children.find((c) => c.sessionID === resolvedSessionId);
  // Terminal states from the message block are authoritative; a store child
  // seeded after app restart defaults to 'running' (the endpoint has no
  // status field), so prefer the block's completed/error state to avoid a
  // finished subagent showing "Running" forever.
  const status =
    block.state.status === 'completed' || block.state.status === 'error'
      ? block.state.status
      : (child?.status ?? 'running');
  const label = child?.agent ?? agent;

  const handlePress = () => {
    if (!resolvedSessionId) return;
    const childProjectId = child?.projectID ?? projectId;
    router.push(`/chat?sessionId=${resolvedSessionId}&projectId=${childProjectId}` as never);
  };

  // Not resolved and still running — the child session is being created.
  if (
    !resolvedSessionId &&
    (block.state.status === 'pending' || block.state.status === 'running')
  ) {
    return (
      <View className="my-1 flex-row items-center gap-2 rounded-lg bg-[#f6f3f1] p-3">
        <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
        <Text className="text-xs font-medium text-[#5e5c54]">
          Subagent {label} — resolving session…
        </Text>
      </View>
    );
  }

  // Not resolved and not running — no link is available.
  if (!resolvedSessionId) {
    return (
      <View className="my-1 flex-row items-center gap-2 rounded-lg bg-[#f6f3f1] p-3">
        <MaterialIcons name="call-split" size={16} color="#8f482f" />
        <Text className="text-xs font-medium text-[#5e5c54]">
          Subagent {label} — session unavailable
        </Text>
      </View>
    );
  }

  const statusLabel =
    status === 'completed' ? 'Completed' : status === 'error' ? 'Failed' : 'Running';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="my-1 flex-row items-center justify-between rounded-lg bg-[#ffdbd0] p-3">
      <View className="flex-1 flex-row items-center gap-2 pr-2">
        <MaterialIcons name="call-split" size={18} color="#75331c" />
        <View className="flex-1">
          <Text className="text-xs font-semibold text-[#75331c]" numberOfLines={1}>
            Subagent: {label}
          </Text>
          <Text className="text-[11px] text-[#75331c]/80">{statusLabel}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
        <Text className="text-[11px] font-medium text-[#75331c]">View session</Text>
        <MaterialIcons name="open-in-new" size={12} color="#75331c" />
      </View>
    </TouchableOpacity>
  );
}

/** Stable empty array so store selectors keep reference equality. */
const EMPTY_CHILDREN: never[] = [];
