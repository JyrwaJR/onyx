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

const SUGGESTIONS = ['http://localhost:3000', 'http://localhost:3001'] as const;

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
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-4xl">⚠️</Text>
        <Text className="mt-4 text-center text-base text-gray-700">{error}</Text>
        <Pressable onPress={handleTryAgain} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3">
          <Text className="text-base font-semibold text-white">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-full max-w-sm items-center">
        <Text className="text-3xl font-bold text-gray-900">Onyx</Text>
        <Text className="mt-2 text-center text-base text-gray-500">
          Connect to your local AI agent
        </Text>

        <View className="mt-10 w-full">
          <Controller
            control={control}
            name="serverUrl"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="http://localhost:3000"
                placeholderTextColor="#9CA3AF"
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
            <Text className="mt-2 text-sm text-red-500">{errors.serverUrl.message}</Text>
          )}

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            className={`mt-4 w-full items-center rounded-lg px-6 py-3 ${
              isValid && !isSubmitting ? 'bg-indigo-600' : 'bg-gray-300'
            }`}>
            <Text className="text-base font-semibold text-white">Connect</Text>
          </Pressable>
        </View>

        <View className="mt-8 w-full">
          <Text className="mb-2 text-center text-sm text-gray-400">Quick connect</Text>
          {SUGGESTIONS.map((url) => (
            <Pressable
              key={url}
              onPress={() => handleSuggestionPress(url)}
              className="mt-2 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <Text className="text-sm text-gray-600">{url}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
