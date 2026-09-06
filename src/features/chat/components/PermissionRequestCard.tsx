import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { PermissionRequest, PermissionReply } from '../types';
import { replyToPermission } from '../api/chat-api';

type PermissionRequestCardProps = {
  /** The permission request to render. */
  request: PermissionRequest;
  /** Called with the request ID after a reply succeeds so the parent can drop it from the store. */
  onResolved: (requestId: string) => void;
};

/**
 * Renders an interactive permission request from the assistant.
 *
 * Displays the permission name, the patterns it would operate on, the
 * "always allow" patterns (when offered), and any metadata context. The
 * user may allow the request once, allow it forever (`always`), or deny it.
 * While a reply is in flight the buttons are disabled to prevent double
 * submissions; on success `onResolved` fires with the request ID so the
 * parent can remove it from the pending store. On failure the card stays
 * visible and the buttons re-enable (the reply API throws).
 */
export function PermissionRequestCard({ request, onResolved }: PermissionRequestCardProps) {
  const [submitting, setSubmitting] = useState<PermissionReply | null>(null);

  const submit = (reply: PermissionReply) => {
    if (submitting) return;
    setSubmitting(reply);
    replyToPermission(request.id, reply)
      .then(() => onResolved(request.id))
      .catch((err) => {
        console.warn('Failed to reply to permission:', err);
        setSubmitting(null);
      });
  };

  const patterns = request.patterns ?? [];
  const alwaysPatterns = request.always ?? [];
  const hasMetadata = Object.keys(request.metadata ?? {}).length > 0;

  return (
    <View className="gap-3 rounded-md border border-[#dac1ba]/30 bg-[#fcf9f6] p-4">
      <Text className="text-xs font-semibold uppercase tracking-wide text-[#8f482f]">
        Permission request
      </Text>
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <MaterialIcons name="shield" size={20} color="#8f482f" />
          <Text className="flex-1 text-base font-semibold text-[#54433e]">
            {request.permission}
          </Text>
        </View>
      </View>

      {patterns.length > 0 && (
        <View className="gap-1">
          <Text className="text-xs font-medium text-[#5e5c54]">Applies to</Text>
          {patterns.map((pattern) => (
            <Text key={pattern} className="font-mono text-xs text-[#54433e]">
              {pattern}
            </Text>
          ))}
        </View>
      )}

      {alwaysPatterns.length > 0 && (
        <View className="gap-1">
          <Text className="text-xs font-medium text-[#5e5c54]">Always allow</Text>
          {alwaysPatterns.map((pattern) => (
            <Text key={pattern} className="font-mono text-xs text-[#54433e]">
              {pattern}
            </Text>
          ))}
        </View>
      )}

      {hasMetadata && (
        <View className="rounded-md bg-[#f3efe9] p-2">
          <Text className="font-mono text-xs text-[#5e5c54]">
            {JSON.stringify(request.metadata, null, 2)}
          </Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => submit('once')}
          disabled={submitting != null}
          accessibilityLabel="Allow once"
          className={`flex-1 rounded-md p-3 ${submitting == null ? 'bg-[#8f482f]' : 'bg-[#d6d3d0]'}`}>
          <Text className="text-center text-sm font-semibold text-[#fff]">Allow once</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => submit('always')}
          disabled={submitting != null}
          accessibilityLabel="Always allow"
          className={`flex-1 rounded-md border border-[#8f482f] p-3 ${
            submitting == null ? 'bg-[#f6f3f1]' : 'bg-[#edeae8]'
          }`}>
          <Text className="text-center text-sm font-semibold text-[#8f482f]">Always allow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => submit('reject')}
          disabled={submitting != null}
          accessibilityLabel="Deny"
          className={`flex-1 rounded-md p-3 ${submitting == null ? 'bg-[#54433e]' : 'bg-[#d6d3d0]'}`}>
          <Text className="text-center text-sm font-semibold text-[#fff]">Deny</Text>
        </TouchableOpacity>
      </View>

      {submitting != null && (
        <View className="flex-row items-center justify-center gap-2">
          <ActivityIndicator size="small" color="#8f482f" />
          <Text className="text-xs text-[#5e5c54]">Sending…</Text>
        </View>
      )}
    </View>
  );
}
