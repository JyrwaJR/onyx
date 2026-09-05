import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSkills } from '@/shared/hooks/use-skill';
import { useSendMessage } from '../hooks/use-send-message';

interface LoadSkillModalProps {
  sessionId: string;
  visible: boolean;
  onClose: () => void;
}

export const LoadSkillModal: React.FC<LoadSkillModalProps> = ({ sessionId, visible, onClose }) => {
  const { data: skills, isLoading } = useSkills();
  const sendMessage = useSendMessage(sessionId);

  const handleLoadSkill = (skillName: string) => {
    sendMessage.mutate(`/skill load ${skillName}`, {
      onSuccess: () => {
        console.log(`Successfully sent load skill message: ${skillName}`);
        onClose();
      },
      onError: (error) => {
        console.error(`Failed to send load skill message: ${skillName}`, error);
        alert(`Failed to load skill: ${skillName}. Check logs for details.`);
      },
    });
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
