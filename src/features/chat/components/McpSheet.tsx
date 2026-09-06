import { forwardRef, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useMcpStatus } from '@/shared/hooks/use-mcp-status';
import { cn } from '@/shared/lib/cn';

type McpSheetProps = Record<string, never>;

const COLORS = {
  surface: '#fcf9f6',
  primary: '#cc785c',
  textPrimary: '#1a1918',
  textSecondary: '#6e6962',
  textMuted: '#9e9992',
  danger: '#d64545',
} as const;

export const McpSheet = forwardRef<BottomSheetModal, McpSheetProps>(function McpSheet(_props, ref) {
  const { data: mcps, isLoading, isError } = useMcpStatus();
  const snapPoints = useMemo(() => ['22', '44', '88%'], []);

  return (
    <CustomBottomSheet ref={ref} snapPoints={snapPoints}>
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text className="mt-2 text-sm text-[#5e5c54]">Loading MCPs…</Text>
          </View>
        ) : isError ? (
          <View className="items-center py-10">
            <MaterialIcons name="error-outline" size={32} color={COLORS.danger} />
            <Text className="mt-2 text-sm text-[#5e5c54]">Failed to load MCPs</Text>
          </View>
        ) : (
          <BottomSheetScrollView
            className="flex-1 px-4 pt-3"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
            {mcps?.map((mcp) => (
              <View
                key={mcp.name}
                className="flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                <View className="flex-1">
                  <Text className="text-sm font-semibold capitalize text-[#1a1918]">
                    {mcp.name}
                  </Text>
                  <Text
                    className={cn(
                      mcp.status === 'connected' ? 'text-xs text-primary' : 'text-xs text-red-500'
                    )}>
                    {mcp.status}
                  </Text>
                </View>
              </View>
            ))}
          </BottomSheetScrollView>
        )}
      </SafeAreaView>
    </CustomBottomSheet>
  );
});
