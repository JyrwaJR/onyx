import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { newSessionSchema, type NewSessionFormData } from '../validators/new-session';
import { useCreateSession } from '@/features/chat';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface NewSessionFormProps {
  onClose: () => void;
  dir: string;
}

export const NewSessionForm = forwardRef<BottomSheetModal, NewSessionFormProps>(
  function NewSessionForm({ dir, onClose }, ref) {
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

    return (
      <CustomBottomSheet ref={ref} onClose={onClose} enableDynamicSizing>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <View className="flex-1 justify-end">
            <View className="gap-4 p-6 pb-8">
              <Text className="mb-4 text-headline-md font-semibold text-on-surface">
                New Session
              </Text>

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

              <Button
                title="Continue"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                size="lg"
                className="w-full flex-1"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
    );
  }
);
