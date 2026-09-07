import { forwardRef, useMemo } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useModel } from '@/shared/hooks/use-model';
import { useChatStore } from '../../store/chat-store';
import { Model } from '@/shared/types/model';
import { cn } from '@/shared/lib/cn';
import { useChangeModel } from '../../hooks/use-change-model';

type ModelSheetProps = {};

/** Agenyx theme color tokens used by the model bottom sheet. */
const COLORS = {
  surface: '#fcf9f6',
  primary: '#cc785c',
  textPrimary: '#1a1918',
  textSecondary: '#6e6962',
  textMuted: '#9e9992',
  danger: '#d64545',
} as const;

export const ModelSheet = forwardRef<BottomSheetModal, ModelSheetProps>(
  function ModelSheet(_props, ref) {
    const { data: models, isLoading, isError } = useModel();
    const snapPoints = useMemo(() => ['22', '44', '88%'], []);
    const setSettings = useChatStore((state) => state.setSettings);
    const settings = useChatStore((state) => state.settings);
    const { mutate, isPending } = useChangeModel();

    const onModelPress = (model: Model) => {
      setSettings({ selectedModel: model });
      mutate();
    };

    return (
      <CustomBottomSheet ref={ref} snapPoints={snapPoints}>
        <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text className="mt-2 text-sm text-[#5e5c54]">Loading models…</Text>
            </View>
          ) : isError ? (
            <View className="items-center py-10">
              <MaterialIcons name="error-outline" size={32} color={COLORS.danger} />
              <Text className="mt-2 text-sm text-[#5e5c54]">Failed to load models</Text>
            </View>
          ) : (
            <BottomSheetScrollView
              className="flex-1 px-4 pt-3"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
              {models?.map((model) => (
                <TouchableOpacity
                  key={model.id}
                  onPress={() => onModelPress(model)}
                  disabled={isPending}
                  className={cn(
                    'flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5',
                    settings.selectedModel?.id === model.id && 'border-primary'
                  )}>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#1a1918]">{model.name}</Text>
                    <Text className="text-xs text-[#6e6962]">
                      {model.variants.join(', ') ?? 'No description'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </BottomSheetScrollView>
          )}
        </SafeAreaView>
      </CustomBottomSheet>
    );
  }
);
