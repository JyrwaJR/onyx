/**
 * @file ConnectionErrorScreen — Shown when the app cannot communicate
 * with the local Onyx agent daemon runtime (ECONNREFUSED).
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ConnectionErrorScreenProps {
  targetUrl?: string;
  targetPort?: string;
  errorCode?: string;
  onRetry?: () => Promise<boolean>;
  onOpenTroubleshooting?: () => void;
  onOpenNetworkSettings?: () => void;
}

export default function ConnectionErrorScreen({
  targetUrl = 'http://localhost:4096',
  targetPort = '4096 (TCP)',
  errorCode = 'ECONNREFUSED',
  onRetry,
  onOpenTroubleshooting,
  onOpenNetworkSettings,
}: ConnectionErrorScreenProps) {
  // Interactive States
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('Just now');
  const [showLogs, setShowLogs] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleRetry = useCallback(async () => {
    if (isRetrying) return;

    setIsRetrying(true);
    setRetryFailed(false);

    // Simulated network ping
    setTimeout(async () => {
      let success = false;
      if (onRetry) {
        success = await onRetry();
      }

      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastPingTime(formattedTime);

      if (!success) {
        setIsRetrying(false);
        setRetryFailed(true);

        // Reset error state after brief flash
        setTimeout(() => {
          setRetryFailed(false);
        }, 2400);
      } else {
        setIsRetrying(false);
      }
    }, 1200);
  }, [isRetrying, onRetry]);

  const handleCopyLogs = useCallback(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }, []);

  return (
    <View className="flex-1 bg-surface">
      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="max-w-mobile mx-auto w-full px-6 py-4">
        {/* Status Badge & Editorial Illustration Banner */}
        <View className="my-6 items-center text-center">
          {/* Tactile Severed Connection Glyph Container */}
          <View className="relative mb-6 h-24 w-24 items-center justify-center rounded-full bg-error-container/30">
            {/* Pulsing ring visual */}
            <View className="absolute inset-0 rounded-full bg-error-container/20 opacity-60" />

            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-fixed shadow-sm">
              <MaterialIcons name="link-off" size={32} color="#8f482f" />
            </View>

            <View className="absolute -bottom-1 -right-1 h-7 w-7 items-center justify-center rounded-full bg-error shadow-sm">
              <MaterialIcons name="priority-high" size={16} color="#ffffff" />
            </View>
          </View>

          {/* Editorial Typography Block */}
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Local Daemon Unreachable
          </Text>
          <Text className="mb-2 text-center font-display text-[28px] font-normal tracking-tight text-on-surface">
            Unable to Connect to Agent Runtime
          </Text>
          <Text className="max-w-xs text-center font-body text-sm leading-relaxed text-on-surface-variant">
            Onyx could not reach the local server at{' '}
            <Text className="rounded bg-surface-container px-1 py-0.5 font-mono text-xs font-semibold text-on-surface">
              {targetUrl}
            </Text>
            . Check if your daemon is active and firewall permits loopback connections.
          </Text>
        </View>

        {/* Diagnostic Snapshot Bento Card */}
        <View className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="terminal" size={18} color="#54433e" />
              <Text className="text-xs font-semibold text-on-surface">Diagnostic Telemetry</Text>
            </View>
            <View className="rounded-full bg-error-container px-2 py-0.5">
              <Text className="text-on-error-container text-[11px] font-semibold">Failure</Text>
            </View>
          </View>

          {/* Telemetry Key-Value Matrix */}
          <View className="gap-1.5">
            <View className="flex-row items-center justify-between rounded bg-surface-container-lowest px-3 py-2">
              <Text className="font-mono text-xs text-secondary">Error Code</Text>
              <Text className="font-mono text-xs font-medium text-error">{errorCode}</Text>
            </View>

            <View className="flex-row items-center justify-between rounded bg-surface-container-lowest px-3 py-2">
              <Text className="font-mono text-xs text-secondary">Target Port</Text>
              <Text className="font-mono text-xs font-medium text-on-surface">{targetPort}</Text>
            </View>

            <View className="flex-row items-center justify-between rounded bg-surface-container-lowest px-3 py-2">
              <Text className="font-mono text-xs text-secondary">Process Status</Text>
              <Text className="font-mono text-xs text-on-surface-variant">
                Inactive / Terminated
              </Text>
            </View>

            <View className="flex-row items-center justify-between rounded bg-surface-container-lowest px-3 py-2">
              <Text className="font-mono text-xs text-secondary">Last Ping</Text>
              <Text className="font-mono text-xs text-on-surface">{lastPingTime}</Text>
            </View>
          </View>

          {/* Quick Terminal Assist Hint */}
          <View className="mt-3 flex-row items-start gap-2 rounded bg-surface-container p-2.5">
            <MaterialIcons name="tips-and-updates" size={18} color="#8f482f" className="mt-0.5" />
            <Text className="flex-1 font-mono text-[12px] leading-relaxed text-on-surface-variant">
              Run <Text className="font-semibold text-primary">onyx serve --verbose</Text> in your
              terminal to restart the agent daemon with tracing.
            </Text>
          </View>
        </View>

        {/* Primary & Secondary Action Zone */}
        <View className="mb-6 gap-2.5">
          {/* Retry Connection Button */}
          <TouchableOpacity
            onPress={handleRetry}
            disabled={isRetrying}
            className={`h-12 w-full flex-row items-center justify-center gap-2 rounded-xl shadow-md active:opacity-90 ${
              retryFailed ? 'bg-error' : 'bg-primary'
            }`}
            activeOpacity={0.9}>
            {isRetrying ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="text-sm font-semibold text-on-primary">Pinging Daemon...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="refresh" size={20} color="#ffffff" />
                <Text className="text-sm font-semibold text-on-primary">
                  {retryFailed ? 'Connection Failed (ECONNREFUSED)' : 'Retry Connection'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Toggle Diagnostic Logs */}
          <TouchableOpacity
            onPress={() => setShowLogs((prev) => !prev)}
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-surface-container active:bg-surface-container-high"
            activeOpacity={0.8}>
            <MaterialIcons name="assignment-late" size={20} color="#605e58" />
            <Text className="text-sm font-semibold text-on-surface">
              {showLogs ? 'Hide Diagnostic Logs' : 'View Diagnostic Logs'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Collapsible Log Drawer Preview */}
        {showLogs && (
          <View className="mb-6 rounded-xl bg-inverse-surface p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-error" />
                <Text className="font-mono text-xs font-semibold text-inverse-on-surface">
                  stderr.log — onyx-daemon
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleCopyLogs}
                className="flex-row items-center gap-1 active:opacity-70">
                <MaterialIcons name="content-copy" size={14} color="#ffb59d" />
                <Text className="font-mono text-[11px] font-medium text-inverse-primary">
                  {isCopied ? 'Copied!' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Log Output Code Block */}
            <View className="rounded bg-surface-variant/10 p-2">
              <Text className="font-mono text-[11px] leading-relaxed text-inverse-on-surface">
                [12:44:02.112] INF Starting Onyx runtime v0.9.4{'\n'}
                [12:44:02.115] DBG Attempting socket bind on 127.0.0.1:4096{'\n'}
                [12:44:02.188] ERR SocketException: OS Error 111 (Connection refused){'\n'}
                [12:44:02.190] FTL Host loopback unreachable. Terminating service host.
              </Text>
            </View>
          </View>
        )}

        {/* Warm Minimalist Helpful Guidance Links */}
        <View className="items-center justify-center gap-2 pt-2 text-center">
          <TouchableOpacity
            onPress={onOpenTroubleshooting}
            className="flex-row items-center gap-1.5 active:opacity-70">
            <MaterialIcons name="menu-book" size={18} color="#8f482f" />
            <Text className="text-sm font-semibold text-primary underline">
              Open Local Server Troubleshooting Guide
            </Text>
          </TouchableOpacity>

          <Text className="text-[13px] text-secondary">
            Need help? Verify configurations in{' '}
            <Text onPress={onOpenNetworkSettings} className="font-medium text-on-surface underline">
              Network Settings
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Safe Area Footer Handle */}
      <View className="max-w-mobile mx-auto w-full items-center py-3">
        <View className="h-1 w-28 rounded-full bg-surface-variant" />
      </View>
    </View>
  );
}
