import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSkills } from '@/shared/hooks/use-skill';
import { useRunCommand } from '../hooks/use-run-command';

interface LoadSkillModalProps {
  sessionId: string;
  visible: boolean;
  onClose: () => void;
}

export const LoadSkillModal: React.FC<LoadSkillModalProps> = ({ sessionId, visible, onClose }) => {
  const { data: skills, isLoading } = useSkills();
  const runCommand = useRunCommand(sessionId);

  const handleLoadSkill = (skillName: string) => {
    runCommand.mutate(
      { command: 'skill', arguments: `load ${skillName}` },
      {
        onSuccess: (data) => {
          console.log(`Successfully called load skill command: ${skillName}`, data);
          onClose();
        },
        onError: (error) => {
          console.error(`Failed to call load skill command: ${skillName}`, error);
          alert(`Failed to load skill: ${skillName}. Check logs for details.`);
        },
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[80%] rounded-t-md bg-white p-5">
          <Text className="mb-4 text-lg font-bold">Available Skills</Text>
          <ScrollView>
            {isLoading ? (
              <Text>Loading skills...</Text>
            ) : skills && skills.length > 0 ? (
              skills.map((skill) => (
                <TouchableOpacity
                  key={skill.name}
                  className="border-b border-gray-100 p-4"
                  onPress={() => handleLoadSkill(skill.name)}>
                  <Text>{skill.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No skills available.</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 items-center rounded-lg bg-gray-100 p-3">
            <Text className="font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
