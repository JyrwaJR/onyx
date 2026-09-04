/**
 * @file RuntimeConnectingScreen — Displayed while connecting to the local Onyx model runtime,
 * showing live handshake status, VRAM telemetry, loading progress, and action controls.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface RuntimeConnectingScreenProps {
  screenTitle?: string;
  modelName?: string;
  hostUrl?: string;
  allocatedVram?: string;
  maxVram?: string;
  initialProgress?: number;
  onCancelConnection?: () => void;
  onConnectionSuccess?: () => void;
}

export function Loading({
  screenTitle = 'Connection Error State',
  modelName = 'Onyx 7B Q4_K_M',
  hostUrl = 'http://localhost:4096',
  allocatedVram = '4.8',
  maxVram = '8.0 GB',
  initialProgress = 68,
  onCancelConnection,
  onConnectionSuccess,
}: RuntimeConnectingScreenProps) {
  const router = useRouter();

  // Dynamic progress simulation
  const [progress, setProgress] = useState(initialProgress);
  const [isAborting, setIsAborting] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(initialProgress)).current;

  // Pulse effect for central core
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  // Spin rotation effect for orbital rings
  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [spinAnim]);

  // Simulate progress step increase
  useEffect(() => {
    if (isAborting || isCancelled) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) {
          clearInterval(interval);
          return 94;
        }
        const next = Math.min(94, prev + Math.floor(Math.random() * 4) + 1);

        Animated.timing(progressAnim, {
          toValue: next,
          duration: 300,
          useNativeDriver: false,
        }).start();

        if (next >= 100) {
          onConnectionSuccess?.();
        }
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isAborting, isCancelled, progressAnim, onConnectionSuccess]);

  const handleCancel = useCallback(() => {
    if (isAborting || isCancelled) return;

    setIsAborting(true);

    setTimeout(() => {
      setIsAborting(false);
      setIsCancelled(true);
      onCancelConnection?.();
    }, 600);
  }, [isAborting, isCancelled, onCancelConnection]);

  const interpolatedSpin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const interpolatedReverseSpin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const remainingSeconds = Math.max(0.2, (1.4 * (100 - progress)) / 32).toFixed(1);

  return (
    <View className="flex-1 bg-surface">
      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="max-w-mobile mx-auto w-full px-6 py-2">
        {/* Ambient Orbit Graphic Section */}
        <View className="relative w-full items-center justify-center py-6">
          <View className="relative h-48 w-48 items-center justify-center">
            {/* Outer Pulsing Wave Circle */}
            <Animated.View
              style={{ transform: [{ scale: pulseAnim }] }}
              className="absolute inset-0 rounded-full bg-primary/10"
            />
            <View className="absolute inset-4 rounded-full bg-primary/15" />

            {/* Orbital Outer Ring */}
            <Animated.View
              style={{ transform: [{ rotate: interpolatedSpin }] }}
              className="absolute inset-0 items-center justify-center">
              <View className="h-44 w-44 rounded-full border border-dashed border-outline-variant/60" />
              <View className="absolute top-2 h-3.5 w-3.5 rounded-full bg-primary" />
              <View className="absolute bottom-6 right-6 h-2.5 w-2.5 rounded-full bg-primary-container" />
              <View className="absolute bottom-8 left-6 h-3 w-3 rounded-full bg-secondary" />
            </Animated.View>

            {/* Inner Reverse Ring */}
            <Animated.View
              style={{ transform: [{ rotate: interpolatedReverseSpin }] }}
              className="absolute inset-6 items-center justify-center">
              <View className="h-32 w-32 rounded-full border border-dashed border-outline-variant/80" />
              <View className="absolute top-1 h-3 w-3 rounded-full bg-primary" />
            </Animated.View>

            {/* Core Glowing Node Hub */}
            <View className="relative z-10 h-24 w-24 items-center justify-center rounded-full bg-surface-container shadow-md">
              <Animated.View
                style={{ transform: [{ scale: pulseAnim }] }}
                className="h-16 w-16 items-center justify-center rounded-full bg-primary">
                <MaterialIcons name="memory" size={30} color="#ffffff" />
              </Animated.View>
            </View>
          </View>

          {/* Status Headline & Description */}
          <View className="mt-4 max-w-xs items-center text-center">
            <Text className="text-center font-display text-xl font-normal text-on-surface">
              Connecting to Local Runtime...
            </Text>
            <Text className="mt-1 text-center font-body text-xs leading-relaxed text-on-surface-variant">
              Initializing model weights and syncing active workspace environment...
            </Text>
          </View>
        </View>

        {/* Warm Minimalist Status Card */}
        <View className="mb-4 w-full gap-4 rounded-xl bg-surface-container p-4 shadow-sm">
          {/* Latency & Model Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-primary" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                {modelName}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1">
              <MaterialIcons name="timer" size={14} color="#8f482f" />
              <Text className="text-xs font-medium text-on-surface">
                ~{remainingSeconds}s remaining
              </Text>
            </View>
          </View>

          {/* Handshake Checklist */}
          <View className="gap-2">
            {/* Step 1: Handshake Completed */}
            <View className="flex-row items-start gap-3 rounded-lg bg-surface-container-lowest p-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-surface-container">
                <MaterialIcons name="check" size={16} color="#8f482f" />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-xs font-medium text-on-surface">Handshake established</Text>
                <Text className="font-mono text-xs text-on-surface-variant" numberOfLines={1}>
                  {hostUrl}
                </Text>
              </View>
            </View>

            {/* Step 2: In Progress */}
            <View className="gap-1.5 rounded-lg bg-surface-container-lowest p-3">
              <View className="flex-row items-center justify-between">
                <View className="min-w-0 flex-1 flex-row items-center gap-2">
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-primary-fixed">
                    <View className="h-2 w-2 rounded-full bg-primary" />
                  </View>
                  <Text className="text-xs font-medium text-on-surface" numberOfLines={1}>
                    Loading Onyx agent context
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-primary">{progress}%</Text>
              </View>

              {/* Dynamic Progress Bar Track */}
              <View className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                <View
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-primary"
                />
              </View>
            </View>

            {/* Step 3: Pending */}
            <View className="flex-row items-start gap-3 rounded-lg bg-surface-container-lowest/60 p-3 opacity-70">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-surface-container">
                <View className="h-2 w-2 rounded-full bg-secondary-fixed-dim" />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-xs font-medium text-secondary">Mounting file watcher</Text>
                <Text className="font-mono text-xs text-secondary" numberOfLines={1}>
                  Syncing changes on ./workspace
                </Text>
              </View>
            </View>
          </View>

          {/* Hardware Telemetry Grid */}
          <View className="flex-row gap-2 pt-1">
            <View className="flex-1 rounded-lg bg-surface-container-lowest p-3">
              <Text className="text-[11px] text-on-surface-variant">Allocated VRAM</Text>
              <View className="mt-1 flex-row items-baseline gap-1">
                <Text className="font-display text-lg font-medium text-on-surface">
                  {allocatedVram}
                </Text>
                <Text className="text-xs text-secondary">/ {maxVram}</Text>
              </View>
            </View>

            <View className="flex-1 rounded-lg bg-surface-container-lowest p-3">
              <Text className="text-[11px] text-on-surface-variant">Socket State</Text>
              <View className="mt-1 flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-primary" />
                <Text className="text-xs font-medium text-on-surface">Listening</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Editorial Lightbulb Box */}
        <View className="mb-6 flex-row items-center gap-3 rounded-xl bg-secondary-container/40 p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
            <MaterialIcons name="lightbulb" size={20} color="#66645e" />
          </View>
          <Text className="text-on-secondary-container flex-1 text-xs leading-relaxed">
            Local models run 100% offline. Ensure Ollama or llama.cpp backend stays awake in your
            background shell.
          </Text>
        </View>

        {/* Action Button Strip */}
        <View className="items-center gap-2 pb-4">
          <TouchableOpacity
            onPress={handleCancel}
            disabled={isAborting || isCancelled}
            className={`h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-surface-container active:bg-surface-container-high ${
              isAborting ? 'opacity-80' : ''
            }`}
            activeOpacity={0.8}>
            <MaterialIcons
              name={isAborting ? 'sync' : isCancelled ? 'check' : 'close'}
              size={18}
              color="#1c1c1a"
            />
            <Text className="text-xs font-semibold text-on-surface">
              {isAborting ? 'Aborting...' : isCancelled ? 'Cancelled' : 'Cancel Connection'}
            </Text>
          </TouchableOpacity>
          <Text className="text-[11px] text-secondary">
            Pressing cancel reverts runtime state safely
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
