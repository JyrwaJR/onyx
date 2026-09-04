/**
 * @file ResourceNotFoundScreen — Displayed when a session, workspace node, or checkpoint
 * cannot be found (HTTP 404), providing local index search and alternative navigation routes.
 */

import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from 'react-native-svg';

interface QuickQueryTag {
  id: string;
  label: string;
  value: string;
}

interface ResourceNotFoundScreenProps {
  screenTitle?: string;
  nodeId?: string;
  modelIdentifier?: string;
  onReturnDashboard?: () => void;
  onNavigateDestination?: (route: string) => void;
  onSearchQuery?: (query: string) => void;
}

const QUICK_TAGS: QuickQueryTag[] = [
  { id: '1', label: '#fine-tune-eval', value: 'fine-tune-eval-v2' },
  { id: '2', label: '#research-07', value: 'research-notebook-07' },
  { id: '3', label: '#workspace-amber', value: 'amber-workspace' },
];

export function NotFound({
  screenTitle = 'Resource Not Found',
  nodeId = 'node-04a // detached',
  modelIdentifier = 'Llama-3-70B-q4',
  onReturnDashboard,
  onNavigateDestination,
  onSearchQuery,
}: ResourceNotFoundScreenProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as never);
    }
  }, [router]);

  const handleSelectTag = useCallback(
    (tagValue: string) => {
      setSearchQuery(tagValue);
      onSearchQuery?.(tagValue);
    },
    [onSearchQuery]
  );

  const handleClearQuery = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleDashboardPress = useCallback(() => {
    if (onReturnDashboard) {
      onReturnDashboard();
    } else {
      handleBack();
    }
  }, [onReturnDashboard, handleBack]);

  return (
    <View className="flex-1 bg-surface">
      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="max-w-mobile mx-auto w-full px-6 py-2">
        {/* Visual Emblem & Ambient Card */}
        <View className="relative mb-4 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low p-6 text-center shadow-sm">
          {/* Faint Atmospheric Glow */}
          <View className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary-fixed/20 blur-3xl" />
          <View className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-fixed/40 blur-2xl" />

          {/* Minimalist Compass Vector Emblem */}
          <View className="relative z-10 mb-4 h-24 w-24 items-center justify-center rounded-full bg-surface-container shadow-sm">
            <Svg width="56" height="56" viewBox="0 0 64 64" fill="none">
              {/* Outer Coordinate Dial Ring */}
              <Circle
                cx="32"
                cy="32"
                r="28"
                stroke="#8f482f"
                strokeDasharray="3 4"
                strokeOpacity={0.35}
                strokeWidth={1.5}
              />
              <Circle cx="32" cy="32" r="23" stroke="#8f482f" strokeOpacity={0.2} strokeWidth={1} />
              {/* Broken Needle pivots with editorial offset */}
              <Path d="M32 10L36 29L32 26L28 29L32 10Z" fill="#8f482f" fillOpacity={0.9} />
              <Path d="M32 54L28 35L32 38L36 35L32 54Z" fill="#8f482f" fillOpacity={0.25} />
              {/* Pivot Node */}
              <Circle cx="32" cy="32" r="3.5" fill="#f6f3f1" />
              <Circle cx="32" cy="32" r="2" fill="#8f482f" />
              {/* Fragmented Latitude Rays */}
              <Line
                x1="8"
                y1="32"
                x2="16"
                y2="32"
                stroke="#8f482f"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeOpacity={0.4}
              />
              <Line
                x1="48"
                y1="32"
                x2="56"
                y2="32"
                stroke="#8f482f"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeOpacity={0.4}
              />
            </Svg>
          </View>

          {/* Editorial Error Badge */}
          <View className="relative z-10 mb-2 rounded-full bg-surface-container-high px-3 py-1">
            <Text className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Err 404 • Node Partition Disconnected
            </Text>
          </View>

          {/* Serif Headline Display */}
          <Text className="relative z-10 mb-2 font-display text-2xl font-normal tracking-tight text-on-surface">
            Resource Not Found
          </Text>

          {/* Context Copy */}
          <Text className="relative z-10 max-w-xs text-center font-body text-sm leading-relaxed text-on-surface-variant">
            The session, workspace, or model checkpoint you are looking for has been moved or no
            longer exists on this node.
          </Text>

          {/* Node Context Pills */}
          <View className="relative z-10 mt-4 flex-row items-center justify-center gap-2">
            <View className="flex-row items-center gap-1.5 rounded-lg bg-surface-container px-2.5 py-1">
              <View className="h-1.5 w-1.5 rounded-full bg-error" />
              <Text className="text-[11px] font-semibold text-secondary">{nodeId}</Text>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-lg bg-surface-container px-2.5 py-1">
              <MaterialIcons name="memory" size={14} color="#605e58" />
              <Text className="text-[11px] font-semibold text-secondary">{modelIdentifier}</Text>
            </View>
          </View>
        </View>

        {/* Search Card Interaction Section */}
        <View className="mb-4 gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="auto-awesome" size={18} color="#8f482f" />
              <Text className="text-xs font-semibold text-on-surface">Locate Active Thread</Text>
            </View>
            <Text className="text-[11px] text-secondary">Local Index</Text>
          </View>

          {/* Search Input Field */}
          <View className="relative justify-center">
            <View className="absolute left-3.5 z-10">
              <MaterialIcons name="search" size={20} color="#87736d" />
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                onSearchQuery?.(text);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search sessions, artifacts, or checkpoints..."
              placeholderTextColor="#87736d"
              className={`h-11 w-full rounded-lg bg-surface-container-low pl-10 pr-10 text-sm text-on-surface ${
                isFocused ? 'bg-surface-container' : ''
              }`}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearQuery}
                className="absolute right-3 h-6 w-6 items-center justify-center rounded-full bg-surface-container-high"
                activeOpacity={0.7}>
                <MaterialIcons name="close" size={14} color="#54433e" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Query Suggestions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            className="pt-1">
            {QUICK_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => handleSelectTag(tag.value)}
                className="rounded-full bg-surface-container px-3 py-1 active:bg-primary-fixed"
                activeOpacity={0.8}>
                <Text className="text-xs font-semibold text-on-surface-variant">{tag.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Primary Call To Action */}
        <TouchableOpacity
          onPress={handleDashboardPress}
          className="mb-5 h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm active:scale-[0.99]"
          activeOpacity={0.9}>
          <MaterialIcons name="space-dashboard" size={18} color="#ffffff" />
          <Text className="text-xs font-semibold text-on-primary">Return to Dashboard</Text>
        </TouchableOpacity>

        {/* Secondary Quick Destinations */}
        <View className="mb-5 gap-2">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
              Alternative Destinations
            </Text>
            <Text className="font-mono text-[11px] text-outline">Onyx Core v2.4</Text>
          </View>

          <View className="flex-row gap-2.5">
            {/* Active Sessions Card */}
            <TouchableOpacity
              onPress={() => onNavigateDestination?.('active-sessions')}
              className="flex-1 justify-between gap-3 rounded-xl bg-surface-container-lowest p-3.5 shadow-sm active:bg-surface-container"
              activeOpacity={0.85}>
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high">
                <MaterialIcons name="forum" size={20} color="#54433e" />
              </View>
              <View>
                <Text className="font-display text-base font-medium text-on-surface">
                  Active Sessions
                </Text>
                <Text className="text-[11px] text-secondary">3 warm threads</Text>
              </View>
            </TouchableOpacity>

            {/* Server Config Card */}
            <TouchableOpacity
              onPress={() => onNavigateDestination?.('server-config')}
              className="flex-1 justify-between gap-3 rounded-xl bg-surface-container-lowest p-3.5 shadow-sm active:bg-surface-container"
              activeOpacity={0.85}>
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high">
                <MaterialIcons name="tune" size={20} color="#54433e" />
              </View>
              <View>
                <Text className="font-display text-base font-medium text-on-surface">
                  Server Config
                </Text>
                <Text className="text-[11px] text-secondary">Node orchestrator</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Health Micro-Footer */}
        <View className="mb-4 flex-row items-center justify-between rounded-lg bg-surface-container-low p-3">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="font-mono text-xs text-on-surface-variant">
              Host local daemon is nominal
            </Text>
          </View>
          <Text className="font-mono text-xs text-outline">HTTP 404</Text>
        </View>
      </ScrollView>

      {/* Safe Area Footer Indicator */}
      <View className="max-w-mobile mx-auto w-full items-center py-3">
        <View className="h-1 w-28 rounded-full bg-surface-variant" />
      </View>
    </View>
  );
}
