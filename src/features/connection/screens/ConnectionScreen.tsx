/**
 * @file Connection screen — initial screen for connecting to a local AI agent.
 *
 * Presents a form for the user to enter their server URL, validates it
 * in real-time, and attempts to establish a connection on submit.
 * On success, navigates to the projects dashboard.
 */

import { useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingScreen } from '@components/LoadingScreen';
import { useConnectionStore } from '../store/connection-store';
import { useHealthCheck } from '../hooks/use-health-check';
import { serverUrlSchema, type ServerUrlFormData } from '../validators/server-url';

const SUGGESTIONS = ['http://localhost:4096'] as const;

/**
 * Connection screen for connecting to an OpenCode server.
 *
 * Uses Claude design system with cream canvas background,
 * surface-card inputs, and coral primary button.
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
  } = useForm<ServerUrlFormData>({
    resolver: zodResolver(serverUrlSchema),
    defaultValues: { serverUrl: '' },
    mode: 'onChange',
  });

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

  if (!hydrated) {
    return <LoadingScreen message="Loading..." />;
  }

  const isSubmitting = connectionStatus === 'connecting';

  if (isSubmitting) {
    return <LoadingScreen message="Connecting to server..." />;
  }

  if (connectionStatus === 'error' && error) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <Text className="text-4xl">⚠️</Text>
        <Text className="mt-4 text-center text-base text-body">{error}</Text>
        <Pressable onPress={handleTryAgain} className="mt-6 rounded-lg bg-primary px-6 py-3">
          <Text className="text-base font-semibold text-on-primary">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-canvas px-6">
      <View className="w-full max-w-sm items-center">
        <Text className="font-display text-display-md text-ink">Onyx</Text>
        <Text className="mt-2 text-center text-base text-muted">
          Connect to your local AI agent
        </Text>

        <View className="mt-10 w-full">
          <Controller
            control={control}
            name="serverUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full rounded-lg border border-hairline bg-canvas px-4 py-3 text-base text-ink"
                placeholder="http://localhost:3000"
                placeholderTextColor="#8e8b82"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                textContentType="URL"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors.serverUrl && (
            <Text className="mt-2 text-sm text-error">{errors.serverUrl.message}</Text>
          )}

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className={`mt-4 w-full items-center rounded-lg px-6 py-3 ${
              isValid && !isSubmitting ? 'bg-primary' : 'bg-hairline'
            }`}>
            <Text className="text-base font-semibold text-on-primary">Connect</Text>
          </Pressable>
        </View>

        <View className="mt-8 w-full">
          <Text className="mb-2 text-center text-sm text-muted-soft">Quick connect</Text>
          {SUGGESTIONS.map((url) => (
            <Pressable
              key={url}
              onPress={() => handleSuggestionPress(url)}
              className="mt-2 w-full items-center rounded-lg border border-hairline bg-surface-soft px-4 py-3">
              <Text className="text-sm text-body">{url}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
