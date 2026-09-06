import { forwardRef, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useAgent } from '@/shared/hooks/use-agent';

type AgentSheetProps = Record<string, never>;

export const AgentSheet = forwardRef<BottomSheetModal, AgentSheetProps>(
  function AgentSheet(_props, ref) {
    const { data: agents, isLoading, isError } = useAgent();
    const snapPoints = useMemo(() => ['22', '44', '88%'], []);

    return (
      <CustomBottomSheet ref={ref} snapPoints={snapPoints}>
        <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
          {isLoading ? (
            <View className="items-center py-10">
              <ActivityIndicator size="small" className="text-primary" />
              <Text className="mt-2 text-sm text-[#5e5c54]">Loading agents…</Text>
            </View>
          ) : isError ? (
            <View className="items-center py-10">
              <MaterialIcons name="error-outline" size={32} className="text-primary" />
              <Text className="mt-2 text-sm text-[#5e5c54]">Failed to load agents</Text>
            </View>
          ) : (
            <BottomSheetScrollView
              className="flex-1 px-4 pt-3"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
              {agents?.map((agent) => (
                <View
                  key={agent.id} // Using description as key, adjust if Agent has an ID
                  className="flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                  <View className="flex-1 gap-2">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="text-sm font-semibold capitalize text-[#1a1918]">
                        {agent.id || 'Unnamed Agent'}
                      </Text>

                      <View className="rounded-md bg-primary px-1.5 py-1">
                        <Text className="text-xs font-bold capitalize text-white">
                          {agent.mode || 'Primary'}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs  text-[#6e6962]" numberOfLines={2}>
                      {agent.description || agent.system || 'No description'}
                    </Text>
                  </View>
                </View>
              ))}
            </BottomSheetScrollView>
          )}
        </SafeAreaView>
      </CustomBottomSheet>
    );
  }
);
