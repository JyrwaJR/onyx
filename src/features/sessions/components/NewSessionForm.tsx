import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { newSessionSchema, type NewSessionFormData } from '../validators/new-session';
import { useCreateSession } from '@/features/chat';

interface NewSessionFormProps {
  visible: boolean;
  onClose: () => void;
  dir: string;
}

export function NewSessionForm({ visible, dir, onClose }: NewSessionFormProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewSessionFormData>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: { title: '' },
  });

  const { mutate } = useCreateSession();

  const onSubmit = (data: NewSessionFormData) => {
    mutate(
      {
        title: data.title,
        dir,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <CustomBottomSheet ref={bottomSheetRef} onClose={onClose} enableDynamicSizing>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <View className="flex-1 justify-end">
          <View className="rounded-t-2xl bg-surface p-6 pb-8">
            <Text className="mb-4 text-headline-md font-semibold text-on-surface">New Session</Text>

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
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="secondary"
                className="flex-1"
              />

              <Button
                title="Start"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </CustomBottomSheet>
  );
}
