import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
    runCommand.mutate({ command: 'skill', arguments: `load ${skillName}` });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Available Skills</Text>
          <ScrollView>
            {isLoading ? (
              <Text>Loading skills...</Text>
            ) : (
              skills?.map((skill) => (
                <TouchableOpacity
                  key={skill.name}
                  style={styles.skillItem}
                  onPress={() => handleLoadSkill(skill.name)}>
                  <Text>{skill.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  skillItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  closeButtonText: { fontWeight: 'bold' },
});
