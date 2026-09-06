import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ToggleAgentProps = {
  onToggleAgent: (value: 'build' | 'plan') => void;
  sessionId: string;
};

export const ToggleAgent = ({ onToggleAgent, sessionId }: ToggleAgentProps) => {
  const [agent, setAgent] = useState<'plan' | 'build'>('plan');
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center gap-1 rounded-full bg-[#f6f3f1] px-2.5 py-1">
        <MaterialIcons name="support-agent" size={14} color="#5e5c54" />
        <Text className="text-xs text-[#5e5c54]">Agent: {agent.toUpperCase()}</Text>
      </TouchableOpacity>
    </>
  );
};
