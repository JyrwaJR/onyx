/**
 * @file Modal form for creating a new session.
 *
 * Uses React Hook Form with Zod validation. On submit, the title
 * is passed as a query param and the user navigates to the chat screen.
 * The actual session is created when the first message is sent.
 */

import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { newSessionSchema, type NewSessionFormData } from '../validators/new-session';

interface NewSessionFormProps {
  projectId: string;
  visible: boolean;
  onClose: () => void;
}

/** Modal form for creating a new session with title input. */
export function NewSessionForm({ projectId, visible, onClose }: NewSessionFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewSessionFormData>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = (data: NewSessionFormData) => {
    const title = data.title?.trim() || undefined;
    reset();
    onClose();
    router.push(
      `/(tabs)/projects/${projectId}/sessions/new${title ? `?title=${encodeURIComponent(title)}` : ''}` as never
    );
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-2xl bg-white p-6 pb-8">
          <Text className="mb-4 text-lg font-semibold text-gray-900">New Session</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="Session title (optional)"
                placeholderTextColor="#9CA3AF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoFocus
              />
            )}
          />

          {errors.title && (
            <Text className="mt-1 text-sm text-red-500">{errors.title.message}</Text>
          )}

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-1 rounded-lg border border-gray-300 py-3"
              activeOpacity={0.7}>
              <Text className="text-center text-base font-medium text-gray-700">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="flex-1 rounded-lg bg-indigo-600 py-3"
              activeOpacity={0.7}>
              <Text className="text-center text-base font-semibold text-white">Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
