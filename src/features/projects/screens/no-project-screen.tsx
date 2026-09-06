import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  refresh?: () => void;
  refreshing?: boolean;
};

export default function EmptyProjectsScreen({ refresh, refreshing }: Props) {
  const handleImport = () => {
    Alert.alert('Import Repository', 'Opening native folder selector...');
  };

  const handleClone = () => {
    Alert.alert('Clone Repository', 'Opening Git URL clone dialog...');
  };

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-[#fcf9f6]">
      {/* Main Scrollable Content Area */}
      <View className="relative flex-1">
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing || false} onRefresh={refresh} />}
          className="flex-1 px-4 pt-3"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          {/* Daemon Status Ribbon */}
          <View className="mb-4 flex-row items-center justify-between py-1">
            <View className="flex-row items-center gap-2 rounded-full bg-[#f0edeb] px-3 py-1">
              <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#54433e]">
                Local Daemon Nominal
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="device-hub" size={16} color="#54433e" />
              <Text className="text-xs font-semibold text-[#54433e]">0 Detectable</Text>
            </View>
          </View>

          {/* Hero Empty State Visual Badge */}
          <View className="items-center justify-center pb-4 pt-2">
            <View className="relative h-36 w-36 items-center justify-center">
              {/* Concentric orbit rings */}
              <View className="absolute inset-0 rounded-full bg-[#f6f3f1]" />
              <View className="absolute inset-2 rounded-full bg-[#f0edeb]" />
              <View className="absolute inset-6 items-center justify-center rounded-full bg-[#ebe8e5] shadow-sm">
                <MaterialIcons name="create-new-folder" size={44} color="#8f482f" />
              </View>

              {/* Accent orbit badge (Top Right) */}
              <View className="absolute -top-1 right-2 h-8 w-8 items-center justify-center rounded-full bg-[#8f482f] shadow-md">
                <MaterialIcons name="add" size={18} color="#ffffff" />
              </View>

              {/* Secondary ambient badge (Bottom Left) */}
              <View className="absolute bottom-2 left-1 h-6 w-6 items-center justify-center rounded-full bg-[#e6e2da]">
                <MaterialIcons name="terminal" size={14} color="#66645e" />
              </View>
            </View>

            {/* Editorial Typography Stack */}
            <View className="mt-4 max-w-[320px] items-center">
              <Text className="text-center font-serif text-2xl font-medium tracking-tight text-[#1c1c1a]">
                No Projects Added Yet
              </Text>
              <Text className="mt-2 text-center text-sm leading-5 text-[#54433e]">
                Link local Git repositories or workspace directories to start semantic indexing and
                autonomous coding tasks.
              </Text>
            </View>

            {/* Direct CTA Stack */}
            <View className="mt-6 w-full gap-2">
              <TouchableOpacity
                onPress={handleImport}
                activeOpacity={0.8}
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#8f482f] shadow-sm">
                <MaterialIcons name="folder-open" size={20} color="#ffffff" />
                <Text className="text-sm font-medium text-white">+ Import Local Repository</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClone}
                activeOpacity={0.8}
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#f0edeb]">
                <MaterialIcons name="alt-route" size={18} color="#605e58" />
                <Text className="text-sm font-medium text-[#1c1c1a]">Clone from Remote (Git)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visual Starter Showcase */}
          <View className="my-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#54433e]">
                Suggested Sources
              </Text>
              <TouchableOpacity>
                <Text className="text-xs font-semibold text-[#8f482f]">Explore presets</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {/* Scan Directory Card */}
              <View className="flex-row items-center justify-between gap-3 rounded-xl bg-[#f6f3f1] p-4">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#f0edeb]">
                  <MaterialIcons name="manage-search" size={22} color="#8f482f" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-[#1c1c1a]">Scan ~/projects</Text>
                  <Text className="font-mono text-xs text-[#54433e]">
                    Auto-discovers Git checkouts
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="rounded-lg bg-[#8f482f] px-3 py-1.5">
                  <Text className="text-xs font-medium text-white">Auto-detect</Text>
                </TouchableOpacity>
              </View>

              {/* Starter Template Card */}
              <View className="flex-row items-center justify-between gap-3 rounded-xl bg-[#f6f3f1] p-4">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#e6e2da]">
                  <MaterialIcons name="widgets" size={22} color="#605e58" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-sm font-medium text-[#1c1c1a]">Onyx Template</Text>
                    <View className="rounded bg-[#f0edeb] px-1.5 py-0.5">
                      <Text className="text-[10px] font-semibold text-[#54433e]">TS</Text>
                    </View>
                  </View>
                  <Text className="font-mono text-xs text-[#54433e]">
                    Fullstack Next.js agent sandbox
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="h-8 w-8 items-center justify-center rounded-lg bg-[#f0edeb]">
                  <MaterialIcons name="file-download" size={18} color="#1c1c1a" />
                </TouchableOpacity>
              </View>

              {/* Headless Host Card */}
              <View className="flex-row items-center justify-between gap-3 rounded-xl bg-[#f6f3f1] p-4">
                <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#f0edeb]">
                  <MaterialIcons name="dns" size={22} color="#5e5c54" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-[#1c1c1a]">SSH Remote Daemon</Text>
                  <Text className="font-mono text-xs text-[#54433e]">
                    Mount headless rigs & servers
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="h-8 w-8 items-center justify-center rounded-lg bg-[#f0edeb]">
                  <MaterialIcons name="arrow-forward" size={18} color="#1c1c1a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Minimal Knowledge Tip Card */}
          <View className="mt-1 flex-row items-start gap-3 rounded-xl bg-[#ebe8e5] p-4">
            <MaterialIcons name="verified-user" size={20} color="#8f482f" />
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#1c1c1a]">
                Local Vector Isolation
              </Text>
              <Text className="mt-1 text-xs leading-5 text-[#54433e]">
                Repositories never leave your device. Embeddings and symbol maps are stored inside
                SQLite locally.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
