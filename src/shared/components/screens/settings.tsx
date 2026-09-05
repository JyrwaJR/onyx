import { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConnectionStore } from '@/shared/stores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackHeader } from '../ui/header';
import { Button } from '../ui';

export default function SettingsScreen() {
  const { serverUrl, disconnect } = useConnectionStore();
  const [localLogging, setLocalLogging] = useState(false);
  const [telemetry, setTelemetry] = useState(false);

  const handleDisconnect = () => {
    Alert.alert('Disconnect', 'Are you sure you want to disconnect from the local server?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disconnect', style: 'destructive', onPress: () => disconnect() },
    ]);
  };

  return (
    <>
      <StackHeader title="Settings" />
      <SafeAreaView edges={['left', 'right']} className="flex-1 bg-[#fcf9f6]">
        {/* Main Content Area */}
        <ScrollView
          className="flex-1 px-4 py-6"
          contentContainerStyle={{ gap: 32, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {/* Connection Section */}
          <View className="gap-3">
            <Text className=" text-2xl font-medium text-[#1c1c1a]">Connection</Text>

            <View className="gap-4 rounded-md border border-[#e5e2e0] bg-[#fcf9f6] p-4">
              <View className="gap-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-[#54433e]">
                  Server URL
                </Text>
                <View className="mt-0.5 flex-row items-center gap-2">
                  <MaterialIcons name="link" size={18} color="#605e58" />
                  <Text className="font-mono text-sm text-[#1c1c1a]">{serverUrl}</Text>
                </View>
              </View>

              <Button activeOpacity={0.7} variant={'secondary'}>
                <Text className="text-sm font-medium text-[#605e58]">Edit</Text>
              </Button>
            </View>
          </View>

          {/* Preferences Section */}
          <View className="gap-3">
            <Text className=" text-2xl font-medium text-[#1c1c1a]">Preferences</Text>

            <View className="overflow-hidden rounded-md border border-[#e5e2e0] bg-[#fcf9f6]">
              {/* Setting Item 1 */}
              <View className="flex-row items-center justify-between border-b border-[#e5e2e0] p-4">
                <View className="mr-3 flex-1">
                  <Text className="text-base font-medium text-[#1c1c1a]">Local Logging</Text>
                  <Text className="mt-0.5 text-xs text-[#54433e]">
                    Save interaction history locally
                  </Text>
                </View>
                <Switch
                  value={localLogging}
                  onValueChange={setLocalLogging}
                  trackColor={{ false: '#e5e2e0', true: '#8f482f' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Setting Item 2 */}
              <View className="flex-row items-center justify-between p-4">
                <View className="mr-3 flex-1">
                  <Text className="text-base font-medium text-[#1c1c1a]">Telemetry</Text>
                  <Text className="mt-0.5 text-xs text-[#54433e]">Send anonymous usage data</Text>
                </View>
                <Switch
                  value={telemetry}
                  onValueChange={setTelemetry}
                  trackColor={{ false: '#e5e2e0', true: '#8f482f' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="mt-auto gap-4 rounded-md border border-[#ffdad6] bg-[#ffdad6]/20 p-4">
            <View className="gap-1">
              <Text className="text-lg font-medium text-[#ba1a1a]">Danger Zone</Text>
              <Text className="text-sm leading-5 text-[#54433e]">
                Disconnecting will end the current session and require reconnection to the local
                server.
              </Text>
            </View>

            <Button
              onPress={handleDisconnect}
              activeOpacity={0.8}
              variant={'destructive'}
              size={'lg'}
              className="gap-x-2">
              <MaterialIcons name="power-settings-new" size={18} color="#ffffff" />
              <Text className="text-sm font-medium text-white">Disconnect</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
