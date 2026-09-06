import { forwardRef, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomBottomSheet } from '@/shared/components/ui/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useRunShellCommand } from '@/features/chat/hooks/use-run-shell-command';

type ShellCommandSheetProps = {
  sessionId: string;
};

const COLORS = {
  surface: '#fcf9f6',
  primary: '#cc785c',
  textPrimary: '#1a1918',
  textSecondary: '#6e6962',
  textMuted: '#9e9992',
  danger: '#d64545',
} as const;

export const ShellCommandSheet = forwardRef<BottomSheetModal, ShellCommandSheetProps>(function ShellCommandSheet(
  { sessionId },
  ref
) {
  const [command, setCommand] = useState('');
  const { mutate: runShell, isPending } = useRunShellCommand(sessionId);
  const snapPoints = useMemo(() => ['22', '44', '88%'], []);

  const handleRun = () => {
    if (command.trim()) {
      runShell({ command, agent: 'default' });
      setCommand('');
    }
  };

  return (
    <CustomBottomSheet ref={ref} snapPoints={snapPoints}>
      <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
        <View className="flex-row items-center justify-between border-b border-[#eae6e1]/80 px-5 pb-3 pt-1">
          <View className="flex-row items-center gap-2.5">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#faeae3]">
              <MaterialIcons name="code" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text className="text-2xl font-medium text-[#1a1918]">Run Shell Command</Text>
            </View>
          </View>
        </View>

        <BottomSheetScrollView
          className="flex-1 px-4 pt-3"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
          <Input
            value={command}
            onChangeText={setCommand}
            placeholder="Enter shell command..."
          />
          <Button
            title={isPending ? 'Running...' : 'Run'}
            onPress={handleRun}
            disabled={isPending || !command.trim()}
          />
        </BottomSheetScrollView>
      </SafeAreaView>
    </CustomBottomSheet>
  );
});
