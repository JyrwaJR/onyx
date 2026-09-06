import { forwardRef, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useModel } from '@/shared/hooks/use-model';

type ModelSheetProps = {
  // Add any props if needed, e.g., onSelectModel: (modelId: string) => void
};

/** Onyx theme color tokens used by the model bottom sheet. */
const COLORS = {
  surface: '#fcf9f6',
  primary: '#cc785c',
  textPrimary: '#1a1918',
  textSecondary: '#6e6962',
  textMuted: '#9e9992',
  danger: '#d64545',
} as const;

export const ModelSheet = forwardRef<BottomSheetModal, ModelSheetProps>(function ModelSheet(
  props,
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: models, isLoading, isError, refetch } = useModel();
  const snapPoints = useMemo(() => ['22', '44', '88%'], []);

  return (
    <CustomBottomSheet onClose={() => setIsOpen(false)} ref={ref} snapPoints={snapPoints}>
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-[#eae6e1]/80 px-5 pb-3 pt-1">
          <View className="flex-row items-center gap-2.5">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#faeae3]">
              <MaterialIcons name="auto-awesome" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text className="text-2xl font-medium text-[#1a1918]">Select Model</Text>
            </View>
          </View>
        </View>

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
              <View
                key={model.id}
                className="flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-[#1a1918]">{model.name}</Text>
                  <Text className="text-xs text-[#6e6962]">{model.description}</Text>
                </View>
              </View>
            ))}
          </BottomSheetScrollView>
        )}
      </SafeAreaView>
    </CustomBottomSheet>
  );
});
