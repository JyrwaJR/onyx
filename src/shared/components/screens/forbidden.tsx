/**
 * @file AccessRestrictedScreen — 403 Forbidden screen shown when client credentials
 * or tokens lack clearance to interact with a specific agent daemon.
 */

import { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AccessRestrictedScreenProps {
  serverName?: string;
  daemonEndpoint?: string;
  currentScope?: string;
  requiredScope?: string;
  onRequestAccess?: () => void;
  onSwitchServer?: () => void;
}

export function ForbiddenScreen({
  serverName = 'Studio Rig (LAN)',
  daemonEndpoint = 'unix:///var/run/onyx-agent.sock',
  currentScope = 'Read-Only Client',
  requiredScope = 'Admin / Agent Execution',
  onRequestAccess,
  onSwitchServer,
}: AccessRestrictedScreenProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(connection)');
    }
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="absolute left-1/2 top-0 h-[280px] w-[340px] -translate-x-1/2 rounded-full bg-primary-fixed/35" />
      <View className="absolute bottom-10 right-0 h-[240px] w-[240px] rounded-full bg-secondary-fixed/50" />

      {/* Main Content Scroll Container */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        className="max-w-mobile mx-auto w-full px-6 py-4">
        {/* Shield / Lock Emblem */}
        <View className="mb-6 items-center justify-center self-center">
          {/* Blur Glow Effect */}
          <View className="absolute -inset-4 rounded-full bg-primary-fixed/40" />

          <View className="h-24 w-24 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container-high shadow-sm">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
              <MaterialIcons name="enhanced-encryption" size={36} color="#8f482f" />
            </View>
          </View>

          {/* Priority Alert Badge */}
          <View className="absolute -bottom-1 -right-1 h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary shadow">
            <MaterialIcons name="priority-high" size={14} color="#ffffff" />
          </View>
        </View>

        {/* Error Typography */}
        <View className="mb-6 items-center text-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-primary">
            Security Clearance Required
          </Text>
          <Text className="mt-1 text-center font-display text-[28px] font-normal tracking-tight text-on-surface">
            Access Restricted (403)
          </Text>
          <Text className="mt-2 px-2 text-center font-body text-sm leading-relaxed text-on-surface-variant">
            Your client credentials or authentication token lack permissions to interact with this
            agent daemon or restricted directory.
          </Text>
        </View>

        {/* Scope & Permissions Card */}
        <View className="mb-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-sm">
          <View className="mb-3 flex-row items-center justify-between border-b border-surface-container pb-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="badge" size={18} color="#605e58" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Session Scope
              </Text>
            </View>
            <View className="rounded bg-error-container px-2 py-0.5">
              <Text className="text-on-error-container text-xs font-medium">Unprivileged</Text>
            </View>
          </View>

          <View className="gap-2.5">
            {/* Current Scope */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-on-surface-variant">Current Scope</Text>
              <View className="flex-row items-center gap-1">
                <View className="h-1.5 w-1.5 rounded-full bg-outline" />
                <Text className="text-xs font-medium text-on-surface">{currentScope}</Text>
              </View>
            </View>

            {/* Required Scope */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-on-surface-variant">Required Scope</Text>
              <View className="flex-row items-center gap-1">
                <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                <Text className="text-xs font-semibold text-primary">{requiredScope}</Text>
              </View>
            </View>

            {/* Server */}
            <View className="flex-row items-center justify-between border-t border-surface-container/60 pt-2">
              <Text className="text-xs text-on-surface-variant">Server</Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="dns" size={12} color="#605e58" />
                <Text className="text-xs font-medium text-on-surface">{serverName}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Context Preview / Diagnostic Node Info */}
        <View className="mb-6 flex-row items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container-high">
            <MaterialIcons name="folder-special" size={20} color="#54433e" />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-xs font-medium text-on-surface">Daemon Endpoint</Text>
            <Text
              className="text-[11px] text-on-surface-variant"
              numberOfLines={1}
              ellipsizeMode="middle">
              {daemonEndpoint}
            </Text>
          </View>
          <MaterialIcons name="lock" size={16} color="#87736d" />
        </View>

        {/* Actions Section */}
        <View className="gap-2.5">
          {/* Request Access / Re-authenticate */}
          <TouchableOpacity
            onPress={onRequestAccess}
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-sm active:bg-primary-container"
            activeOpacity={0.98}>
            <MaterialIcons name="vpn-key" size={18} color="#ffffff" />
            <Text className="text-sm font-semibold text-on-primary">
              Request Access / Re-authenticate
            </Text>
          </TouchableOpacity>

          {/* Switch Server Node */}
          <TouchableOpacity
            onPress={onSwitchServer ?? handleBack}
            className="h-12 w-full flex-row items-center justify-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container active:bg-surface-container-high"
            activeOpacity={0.98}>
            <MaterialIcons name="swap-horiz" size={18} color="#605e58" />
            <Text className="text-sm font-medium text-on-surface">Switch Server Node</Text>
          </TouchableOpacity>
        </View>

        {/* Micro Diagnostic Note */}
        <View className="mt-6 items-center">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons name="info" size={12} color="#87736d" />
            <Text className="text-[11px] text-on-surface-variant">
              Contact your workspace administrator or update
            </Text>
          </View>
          <View className="mt-1 rounded border border-primary-fixed-dim/40 bg-primary-fixed/30 px-2 py-0.5">
            <Text className="text-[11px] text-primary">~/.onyx/auth.json</Text>
          </View>
        </View>
      </ScrollView>

      {/* Safe Area Footer Handle */}
      <View className="max-w-mobile mx-auto w-full items-center py-3">
        <View className="h-1 w-28 rounded-full bg-surface-variant" />
      </View>
    </SafeAreaView>
  );
}
