/**
 * @file Connection screen — initial screen for connecting to a local AI agent.
 *
 * Presents a form for the user to enter their server URL, validates it
 * in real-time, and attempts to establish a connection on submit.
 * On success, navigates to the projects dashboard.
 */

import { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';

import { LoadingScreen } from '@components/LoadingScreen';
import { useConnectionStore } from '../store/connection-store';
import { useHealthCheck } from '../hooks/use-health-check';
import { serverUrlSchema, type ServerUrlFormData } from '../validators/server-url';

/** Quick connect suggestion items. */
interface SuggestionItem {
  name: string;
  url: string;
  displayUrl?: string;
  icon: 'terminal' | 'router';
  status?: string;
  latency?: string;
}

const SUGGESTIONS: SuggestionItem[] = [
  {
    name: 'Localhost Default',
    url: 'http://localhost:4096',
    displayUrl: 'http://localhost:4096',
    icon: 'terminal',
    status: 'Ready',
  },
  {
    name: 'Studio Rig (LAN)',
    url: 'http://192.168.1.50:4096',
    displayUrl: '192.168.1.50:4096',
    icon: 'router',
    latency: '4ms',
  },
];

/**
 * Connection screen for connecting to an OpenCode server.
 */
export default function ConnectionScreen() {
  const router = useRouter();

  const { serverUrl, connectionStatus, error, hydrated, setServerUrl, connect, disconnect } =
    useConnectionStore();

  const { isHealthy } = useHealthCheck(connectionStatus === 'connected' ? serverUrl : '');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<ServerUrlFormData>({
    resolver: zodResolver(serverUrlSchema),
    defaultValues: { serverUrl: '' },
    mode: 'onChange',
  });

  const currentUrl = watch('serverUrl');

  useEffect(() => {
    if (hydrated && serverUrl) {
      setValue('serverUrl', serverUrl, { shouldValidate: true });
    }
  }, [hydrated, serverUrl, setValue]);

  useEffect(() => {
    if (connectionStatus === 'connected' && isHealthy) {
      router.replace('/(tabs)/projects' as never);
    }
  }, [connectionStatus, isHealthy, router]);

  const onSubmit = useCallback(
    async (data: ServerUrlFormData) => {
      setServerUrl(data.serverUrl);
      await connect();
    },
    [setServerUrl, connect]
  );

  const handleTryAgain = useCallback(() => {
    disconnect();
    reset({ serverUrl });
  }, [disconnect, reset, serverUrl]);

  const handleSuggestionPress = useCallback(
    (url: string) => {
      setValue('serverUrl', url, { shouldValidate: true });
      setServerUrl(url);
    },
    [setValue, setServerUrl]
  );

  const handleClearInput = useCallback(() => {
    setValue('serverUrl', '', { shouldValidate: true });
  }, [setValue]);

  if (!hydrated) {
    return <LoadingScreen message="Loading..." />;
  }

  const isSubmitting = connectionStatus === 'connecting';

  if (isSubmitting) {
    return <LoadingScreen message="Connecting to server..." />;
  }

  if (connectionStatus === 'error' && error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-6">
        <Text className="text-4xl">⚠️</Text>
        <Text className="mt-4 text-center text-base text-on-surface">{error}</Text>
        <TouchableOpacity
          onPress={handleTryAgain}
          className="mt-6 rounded-xl bg-primary px-6 py-3"
          activeOpacity={0.7}>
          <Text className="text-base font-semibold text-on-primary">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Ambient background glow accents */}
      <View className="absolute left-1/2 top-0 h-[280px] w-[340px] -translate-x-1/2 rounded-full bg-primary-fixed/35" />
      <View className="absolute bottom-10 right-0 h-[240px] w-[240px] rounded-full bg-secondary-fixed/50" />

      <View className="max-w-mobile mx-auto w-full flex-1 justify-between px-6 pb-8 pt-12">
        {/* Header & Hero Section */}
        <View className="mt-6 w-full items-center text-center">
          {/* Status / Brand Badge */}
          <View className="mb-6 flex-row items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1">
            <View className="relative flex h-2 w-2 items-center justify-center">
              <View className="absolute h-2 w-2 rounded-full bg-primary opacity-75" />
              <View className="h-2 w-2 rounded-full bg-primary" />
            </View>
            <Text className="text-[11px] font-medium uppercase tracking-wider text-secondary">
              Local Agent Runtime
            </Text>
          </View>

          {/* Brand Wordmark & Tagline */}
          <Text className="font-display text-[44px] font-normal leading-tight tracking-[-0.03em] text-on-surface">
            Onyx
          </Text>
          <Text className="mt-2 max-w-[280px] text-center font-body text-[15px] leading-relaxed text-secondary">
            Connect to your local AI workspace & intelligent agents
          </Text>
        </View>

        {/* Form Section */}
        <View className="my-auto gap-6 py-6">
          {/* Input Group */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between px-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Agent Server URL
              </Text>
              <Text className="text-[11px] lowercase text-outline">ws/http</Text>
            </View>

            <Controller
              control={control}
              name="serverUrl"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="relative flex-row items-center">
                  <View className="pointer-events-none absolute left-3.5 z-10 items-center text-outline">
                    <MaterialIcons name="dns" size={20} color="#87736d" />
                  </View>
                  <TextInput
                    className="h-[52px] w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-3 pl-11 pr-10 text-sm tracking-tight text-on-surface"
                    placeholder="http://localhost:4096"
                    placeholderTextColor="#87736d99"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    textContentType="URL"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {currentUrl ? (
                    <TouchableOpacity
                      onPress={handleClearInput}
                      className="absolute right-3 z-10 p-1"
                      activeOpacity={0.7}>
                      <MaterialIcons name="cancel" size={18} color="#87736d" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            />

            {errors.serverUrl && (
              <Text className="px-1 text-xs text-error">{errors.serverUrl.message}</Text>
            )}
          </View>

          {/* Primary CTA */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className={`h-12 w-full flex-row items-center justify-center gap-2 rounded-xl  ${
              isValid && !isSubmitting ? 'bg-primary' : 'bg-hairline'
            }`}
            activeOpacity={0.98}>
            <Text
              className={`text-[16px] font-semibold tracking-wide ${
                isValid && !isSubmitting ? 'text-on-primary' : 'text-on-primary/50'
              }`}>
              Connect
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={isValid && !isSubmitting ? '#ffffff' : '#ffffff80'}
            />
          </TouchableOpacity>

          {/* Quick Connect Section */}
          <View className="gap-2.5 pt-2">
            <View className="flex-row items-center justify-between px-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Quick Connect
              </Text>
              <Text className="text-[11px] text-outline">Saved Nodes</Text>
            </View>

            <View className="gap-2">
              {SUGGESTIONS.map((item) => (
                <TouchableOpacity
                  key={item.url}
                  onPress={() => handleSuggestionPress(item.url)}
                  className="w-full flex-row items-center justify-between rounded-xl border border-outline-variant/60 bg-surface-container-low/70 px-3.5 py-2.5"
                  activeOpacity={0.7}>
                  <View className="flex-row items-center gap-3">
                    <View className="h-8 w-8 items-center justify-center rounded-lg bg-surface-container-highest">
                      <MaterialIcons
                        name={item.icon}
                        size={18}
                        color={item.status ? '#8f482f' : '#605e58'}
                      />
                    </View>
                    <View>
                      <Text className="text-sm font-medium leading-snug text-on-surface">
                        {item.name}
                      </Text>
                      <Text className="text-xs text-secondary">{item.displayUrl || item.url}</Text>
                    </View>
                  </View>

                  {item.status ? (
                    <View className="flex-row items-center gap-1 rounded-full bg-primary-fixed/40 px-2 py-0.5">
                      <View className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <Text className="text-on-primary-fixed text-[11px] font-medium">
                        {item.status}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-xs text-outline">{item.latency}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Footer & Helper Links */}
        <View className="items-center gap-3 pb-2 pt-4">
          <View className="flex-row items-center justify-center gap-5">
            <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
              <MaterialIcons name="menu-book" size={15} color="#605e58" />
              <Text className="text-xs font-medium text-secondary">Setup Guide</Text>
            </TouchableOpacity>
            <Text className="text-outline-variant">•</Text>
            <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
              <MaterialIcons name="support" size={15} color="#605e58" />
              <Text className="text-xs font-medium text-secondary">Troubleshoot</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-center text-[11px] text-outline">
            Onyx Mobile v1.4.0 • Standalone Client
          </Text>
        </View>
      </View>
    </View>
  );
}
