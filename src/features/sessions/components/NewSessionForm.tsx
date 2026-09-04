/**
 * @file Modal form for creating a new session.
 *
 * Uses React Hook Form with Zod validation. On submit, the title
 * is passed as a query param and the user navigates to the chat screen.
 * The actual session is created when the first message is sent.
 */

import { View, Text, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { newSessionSchema, type NewSessionFormData } from '../validators/new-session';

interface NewSessionFormProps {
  projectId: string;
  visible: boolean;
  onClose: () => void;
}

/**
 * Modal form for creating a new session with title input.
 *
 * Uses Claude design system styling with canvas background
 * and primary coral for the submit button.
 *
 * @param projectId - The project ID to create the session in.
 * @param visible - Whether the modal is visible.
 * @param onClose - Callback to close the modal.
 */
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
        <View className="rounded-t-2xl bg-canvas p-6 pb-8">
          <Text className="mb-4 text-lg font-semibold text-ink">New Session</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Session title"
                placeholder="Optional"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
                error={errors.title?.message}
              />
            )}
          />

          <View className="mt-6 flex-row gap-3">
            <Button title="Cancel" onPress={handleCancel} variant="secondary" className="flex-1" />
            <Button
              title="Start"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
