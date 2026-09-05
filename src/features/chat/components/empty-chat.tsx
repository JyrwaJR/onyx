import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmptyChat() {
  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerStyle={{ paddingTop: 24, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}>
      <View className="items-center text-center">
        {/* Tactile Spark Badge */}
        <View className="relative mb-4 h-20 w-20 items-center justify-center">
          <View className="absolute inset-0 rounded-full bg-[#ffdbd0] opacity-60" />
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <MaterialIcons name="auto-awesome" size={36} color="#8f482f" />
          </View>
        </View>

        {/* Editorial Headings */}
        <Text className="max-w-[280px] text-center font-serif text-2xl font-medium tracking-tight text-[#1c1c1a]">
          How can Onyx help you today?
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-sm leading-5 text-[#605e58]">
          Your local AI pair programmer with direct workspace access, syntax diffing, and terminal
          execution.
        </Text>

        {/* Prompt Cards */}
        <View className="mt-6 w-full gap-2.5">
          {/* Prompt 1 */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-xl bg-[#f6f3f1] p-3.5 shadow-sm">
            <View className="mr-2 flex-1 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-white">
                <MaterialIcons name="account-tree" size={20} color="#8f482f" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-[#1c1c1a]" numberOfLines={1}>
                  Explain this codebase
                </Text>
                <Text className="mt-0.5 text-xs text-[#605e58]" numberOfLines={1}>
                  Synthesize modules, entry points & flow
                </Text>
              </View>
            </View>
            <MaterialIcons name="north-east" size={18} color="#87736d" />
          </TouchableOpacity>

          {/* Prompt 2 */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-xl bg-[#f6f3f1] p-3.5 shadow-sm">
            <View className="mr-2 flex-1 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-white">
                <MaterialIcons name="memory" size={20} color="#8f482f" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-[#1c1c1a]" numberOfLines={1}>
                  Find memory leaks & optimize
                </Text>
                <Text className="mt-0.5 text-xs text-[#605e58]" numberOfLines={1}>
                  Profile allocations, cache hits & latency
                </Text>
              </View>
            </View>
            <MaterialIcons name="north-east" size={18} color="#87736d" />
          </TouchableOpacity>

          {/* Prompt 3 */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-xl bg-[#f6f3f1] p-3.5 shadow-sm">
            <View className="mr-2 flex-1 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-white">
                <MaterialIcons name="verified" size={20} color="#8f482f" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-[#1c1c1a]" numberOfLines={1}>
                  Write test suite for auth module
                </Text>
                <Text className="mt-0.5 text-xs text-[#605e58]" numberOfLines={1}>
                  Generate mock fixtures & edge cases
                </Text>
              </View>
            </View>
            <MaterialIcons name="north-east" size={18} color="#87736d" />
          </TouchableOpacity>

          {/* Prompt 4 */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between rounded-xl bg-[#f6f3f1] p-3.5 shadow-sm">
            <View className="mr-2 flex-1 flex-row items-center gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-white">
                <MaterialIcons name="api" size={20} color="#8f482f" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-[#1c1c1a]" numberOfLines={1}>
                  Generate REST API swagger spec
                </Text>
                <Text className="mt-0.5 text-xs text-[#605e58]" numberOfLines={1}>
                  Produce schema schemas & response codes
                </Text>
              </View>
            </View>
            <MaterialIcons name="north-east" size={18} color="#87736d" />
          </TouchableOpacity>
        </View>

        {/* Security Pill */}
        <View className="mt-6 flex-row items-center gap-1.5 rounded-full bg-[#f0edeb] px-4 py-2">
          <MaterialIcons name="verified-user" size={16} color="#8f482f" />
          <Text className="text-xs font-medium text-[#66645e]">
            100% Offline • Local Weights • No Telemetry
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
