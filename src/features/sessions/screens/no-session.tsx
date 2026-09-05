import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export function EmptySessionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartSession = () => {
    Alert.alert('Initializing Session', 'Starting local Onyx runtime...');
  };

  const handleBlueprint = (title: string) => {
    Alert.alert('Loading Blueprint', `Initializing "${title}"...`);
  };

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-[#fcf9f6]">
      {/* Content Container */}
      <View className="relative flex-1">
        <ScrollView
          className="flex-1 px-4 pt-2"
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}>
          {/* Runtime Status Ribbon & Search Surface */}
          <View className="gap-3 pb-2 pt-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 rounded-full bg-[#f0edeb] px-3 py-1 shadow-sm">
                <View className="h-2 w-2 rounded-full bg-[#8f482f]" />
                <Text className="text-[11px] font-semibold uppercase tracking-wider text-[#54433e]">
                  RUNTIME: ONYX-7B-Q4 • READY
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="memory" size={18} color="#605e58" />
                <Text className="text-xs text-[#54433e]">0.4 GB / 8 GB</Text>
              </View>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center gap-2 rounded-xl bg-[#ebe8e5] px-3 py-2 opacity-90">
              <MaterialIcons name="search" size={20} color="#54433e" />
              <TextInput
                className="flex-1 p-0 text-sm text-[#1c1c1a]"
                placeholder="Search threads, repos, or tags..."
                placeholderTextColor="#54433e"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <MaterialIcons name="tune" size={18} color="#87736d" />
            </View>
          </View>

          {/* Hero Empty State Canvas */}
          <View className="relative my-3 items-center overflow-hidden rounded-xl bg-[#f6f3f1] p-5 text-center shadow-sm">
            {/* Ambient halo background blurs */}
            <View className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#ffdbd0] opacity-40" />
            <View className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#e6e2da] opacity-60" />

            {/* Iconographic Badge */}
            <View className="relative mb-3 mt-1">
              <View className="h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md">
                <MaterialIcons name="terminal" size={32} color="#8f482f" />
              </View>
              <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full bg-[#ad5f45] shadow-sm">
                <MaterialIcons name="auto-awesome" size={14} color="#fffbff" />
              </View>
            </View>

            {/* Headline and description */}
            <Text className="mb-1 text-center font-serif text-2xl font-medium tracking-tight text-[#1c1c1a]">
              No Active Sessions
            </Text>
            <Text className="mb-4 max-w-[280px] text-center text-sm leading-5 text-[#54433e]">
              You don&apos;t have any agent execution threads running or saved. Start a new session
              to review code, generate specs, or debug.
            </Text>

            {/* Primary Action Button */}
            <TouchableOpacity
              onPress={handleStartSession}
              activeOpacity={0.8}
              className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#8f482f] px-4 py-3 shadow-md">
              <MaterialIcons name="add" size={20} color="#ffffff" />
              <Text className="text-sm font-medium text-white">Start New Session</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Blueprint Starters Section */}
          <View className="my-2 gap-2">
            <View className="flex-row items-center justify-between px-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-[#605e58]">
                Or Start With a Blueprint
              </Text>
              <View className="flex-row items-center gap-0.5">
                <Text className="text-xs font-semibold text-[#8f482f]">Curated</Text>
                <MaterialIcons name="bolt" size={14} color="#8f482f" />
              </View>
            </View>

            {/* Blueprint Cards */}
            <View className="gap-2">
              {/* Card 1 */}
              <TouchableOpacity
                onPress={() => handleBlueprint('Audit repo architecture')}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 rounded-xl bg-[#f0edeb] p-4 shadow-sm">
                <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <MaterialIcons name="account-tree" size={22} color="#8f482f" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="flex-1 font-serif text-base font-medium text-[#1c1c1a]"
                      numberOfLines={1}>
                      Audit repo architecture
                    </Text>
                    <View className="rounded bg-[#e5e2e0] px-1.5 py-0.5">
                      <Text className="text-[10px] font-semibold uppercase text-[#54433e]">
                        Sec
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-0.5 text-xs text-[#54433e]" numberOfLines={1}>
                    Generates security and layout analysis
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color="#605e58"
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>

              {/* Card 2 */}
              <TouchableOpacity
                onPress={() => handleBlueprint('Refactor authentication flow')}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 rounded-xl bg-[#f0edeb] p-4 shadow-sm">
                <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <MaterialIcons name="lock-reset" size={22} color="#8f482f" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="flex-1 font-serif text-base font-medium text-[#1c1c1a]"
                      numberOfLines={1}>
                      Refactor authentication flow
                    </Text>
                    <View className="rounded bg-[#ffdbd0] px-1.5 py-0.5">
                      <Text className="text-[10px] font-semibold uppercase text-[#75331c]">
                        Auth
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-0.5 text-xs text-[#54433e]" numberOfLines={1}>
                    Interactive code diff & test suites
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color="#605e58"
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>

              {/* Card 3 */}
              <TouchableOpacity
                onPress={() => handleBlueprint('Draft technical RFC')}
                activeOpacity={0.7}
                className="flex-row items-start gap-3 rounded-xl bg-[#f0edeb] p-4 shadow-sm">
                <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <MaterialIcons name="article" size={22} color="#8f482f" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="flex-1 font-serif text-base font-medium text-[#1c1c1a]"
                      numberOfLines={1}>
                      Draft technical RFC
                    </Text>
                    <View className="rounded bg-[#e5e2e0] px-1.5 py-0.5">
                      <Text className="text-[10px] font-semibold uppercase text-[#54433e]">
                        Doc
                      </Text>
                    </View>
                  </View>
                  <Text className="mt-0.5 text-xs text-[#54433e]" numberOfLines={1}>
                    Extracts architecture specs & tasks
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color="#605e58"
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy Footnote */}
          <View className="mt-3 flex-row items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <MaterialIcons name="shield-lock" size={20} color="#8f482f" />
            <Text className="flex-1 text-xs leading-4 text-[#54433e]">
              Onyx processes prompts on local silicon. No telemetry or code fragments leave this
              device.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
