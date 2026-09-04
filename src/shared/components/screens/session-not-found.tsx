/**
 * @file NoActiveSessionsScreen — Shown when the workspace or notebook has no active
 * agent sessions, offering quick-start blueprints and repository import triggers.
 */

import { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface Blueprint {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
}

interface NoActiveSessionsScreenProps {
  screenTitle?: string;
  onCreateSession?: () => void;
  onImportRepository?: () => void;
  onSelectBlueprint?: (prompt: string) => void;
}

const STARTER_BLUEPRINTS: Blueprint[] = [
  {
    id: '1',
    icon: 'terminal',
    text: 'Audit repo architecture and suggest modular components',
  },
  {
    id: '2',
    icon: 'edit',
    text: 'Draft technical design spec from messy feature notes',
  },
  {
    id: '3',
    icon: 'psychology',
    text: 'Synthesize interview transcripts into design insights',
  },
];

export function NotFoundSessionsScreen({
  screenTitle = 'Notebook Sessions',
  onCreateSession,
  onImportRepository,
  onSelectBlueprint,
}: NoActiveSessionsScreenProps) {
  const router = useRouter();

  // Toast Notification State & Animation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(10)).current;

  const showToast = useCallback(
    (msg: string) => {
      setToastMessage(msg);

      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(toastTranslateY, {
            toValue: 10,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setToastMessage(null));
      }, 2400);
    },
    [toastOpacity, toastTranslateY]
  );

  const handleCreateSession = useCallback(() => {
    showToast('Opening a fresh notebook session...');
    onCreateSession?.();
  }, [onCreateSession, showToast]);

  const handleImportRepo = useCallback(() => {
    showToast('Selecting local directory...');
    onImportRepository?.();
  }, [onImportRepository, showToast]);

  const handleApplyBlueprint = useCallback(
    (promptText: string) => {
      showToast(`Applied: "${promptText.substring(0, 22)}..."`);
      onSelectBlueprint?.(promptText);
    },
    [onSelectBlueprint, showToast]
  );

  return (
    <View className="flex-1 bg-surface">
      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="max-w-mobile mx-auto w-full px-6 py-2">
        {/* Visual Ambient Scene / Editorial Canvas Banner */}
        <View className="relative mb-6 overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
          {/* Ambient Glow Accents */}
          <View className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-fixed/30" />
          <View className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-secondary-fixed/50" />

          <View className="relative z-10 items-center justify-center px-4 py-8 text-center">
            {/* Tactile Notebook / Quirk Glyph Illustration */}
            <View className="relative mb-4 h-28 w-28 items-center justify-center">
              {/* Backing paper sheets */}
              <View
                className="absolute h-24 w-20 rounded-lg bg-surface-container-highest shadow-sm"
                style={{ transform: [{ rotate: '-8deg' }] }}
              />
              <View
                className="absolute h-24 w-20 rounded-lg bg-surface-container-high shadow-sm"
                style={{ transform: [{ rotate: '4deg' }] }}
              />

              {/* Foreground Notebook Canvas */}
              <View className="relative h-24 w-20 justify-between rounded-lg bg-surface-container-lowest p-2.5 shadow-md">
                <View className="flex-row items-center justify-between">
                  <View className="h-2 w-2 rounded-full bg-primary/40" />
                  <View className="flex-row gap-0.5">
                    <View className="h-1 w-1 rounded-full bg-outline-variant" />
                    <View className="h-1 w-1 rounded-full bg-outline-variant" />
                  </View>
                </View>

                <View className="my-auto items-center gap-1.5">
                  <View className="h-1 w-8 rounded-full bg-surface-container-high" />
                  <View className="h-1 w-12 rounded-full bg-surface-container-high" />
                  <View className="h-1 w-6 rounded-full bg-primary/30" />
                </View>

                <View className="items-end">
                  <MaterialIcons name="auto-awesome" size={14} color="#8f482f" />
                </View>
              </View>

              {/* Ambient Status Sparkle Badge */}
              <View className="absolute -bottom-2 -right-1 flex-row items-center gap-1 rounded-full bg-surface-container-lowest px-2 py-0.5 shadow-sm">
                <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                <Text className="text-[10px] font-medium text-on-surface-variant">Onyx v2.4</Text>
              </View>
            </View>

            {/* Editorial Status Badge */}
            <View className="mb-2 flex-row items-center gap-1.5 rounded-full bg-surface-container px-3 py-1">
              <MaterialIcons name="edit-note" size={16} color="#605e58" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Pristine Canvas
              </Text>
            </View>

            {/* Headings */}
            <Text className="mb-1 text-center font-display text-2xl font-normal tracking-tight text-on-surface">
              No Active Sessions Yet
            </Text>
            <Text className="max-w-xs text-center font-body text-sm leading-relaxed text-on-surface-variant">
              Connect your local repository or start an agent prompt session to begin collaborating
              with Onyx.
            </Text>
          </View>
        </View>

        {/* Primary Action Group */}
        <View className="mb-6 gap-3">
          {/* Terracotta Primary Action */}
          <TouchableOpacity
            onPress={handleCreateSession}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-md active:bg-primary-container"
            activeOpacity={0.9}>
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text className="text-sm font-semibold text-on-primary">+ Create New Session</Text>
          </TouchableOpacity>

          {/* Secondary Dashed Repository Card */}
          <TouchableOpacity
            onPress={handleImportRepo}
            style={{ borderStyle: 'dashed' }}
            className="flex-row items-center justify-between rounded-xl border-2 border-outline-variant/60 bg-surface-container-lowest p-4 shadow-sm active:bg-surface-container-low"
            activeOpacity={0.8}>
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                <MaterialIcons name="folder-open" size={20} color="#8f482f" />
              </View>
              <View className="min-w-0">
                <Text className="text-sm font-medium text-on-surface">Import Local Repository</Text>
                <Text className="text-[13px] text-on-surface-variant">
                  Link local Git path or Markdown vault
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#dac1ba" />
          </TouchableOpacity>
        </View>

        {/* Curated Starters / Help Box */}
        <View className="mb-6 rounded-xl bg-surface-container p-4 shadow-sm">
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="lightbulb" size={18} color="#8f482f" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-on-surface">
                Curated Starters
              </Text>
            </View>
            <Text className="text-[11px] text-on-surface-variant">Click to adopt</Text>
          </View>

          <Text className="mb-3 text-[13px] leading-relaxed text-on-surface-variant">
            Jumpstart your workflow with these contextual prompt blueprints crafted for Onyx:
          </Text>

          {/* Prompt Blueprints List */}
          <View className="gap-2">
            {STARTER_BLUEPRINTS.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleApplyBlueprint(item.text)}
                className="flex-row items-start justify-between gap-2 rounded-lg bg-surface-container-lowest p-3 shadow-sm active:bg-surface-container-high"
                activeOpacity={0.85}>
                <View className="min-w-0 flex-1 flex-row items-start gap-2.5">
                  <MaterialIcons name={item.icon} size={16} color="#8f482f" className="mt-0.5" />
                  <Text
                    className="flex-1 text-[13px] font-medium text-on-surface"
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    "{item.text}"
                  </Text>
                </View>
                <MaterialIcons name="north-east" size={16} color="#dac1ba" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Indicator Footer */}
          <View className="mt-4 flex-row items-center justify-between border-t border-surface-container-high pt-3 text-[11px]">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="bolt" size={14} color="#54433e" />
              <Text className="text-[11px] text-on-surface-variant">
                Local models loaded in background
              </Text>
            </View>
            <Text className="text-[11px] font-semibold text-primary">Ready</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Micro Toast Notification */}
      {toastMessage && (
        <Animated.View
          style={{
            opacity: toastOpacity,
            transform: [{ translateY: toastTranslateY }],
          }}
          className="absolute bottom-8 left-1/2 z-50 -translate-x-1/2 flex-row items-center gap-2 rounded-full bg-inverse-surface px-4 py-2.5 shadow-xl">
          <MaterialIcons name="check-circle" size={16} color="#ffb59d" />
          <Text className="text-xs font-semibold text-inverse-on-surface">{toastMessage}</Text>
        </Animated.View>
      )}

      {/* Safe Area Footer Handle */}
      <View className="max-w-mobile mx-auto w-full items-center py-3">
        <View className="h-1 w-28 rounded-full bg-surface-variant" />
      </View>
    </View>
  );
}
