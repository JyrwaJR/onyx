import { Modal, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ternary } from '@/shared/components/ui/ternary';
import { Button } from '@/shared/components/ui/button';
import { useTodos } from '../hooks/use-todos';
import type { Todo } from '../../../shared/api/types';

type TodoModalProps = {
  visible: boolean;
  onClose: () => void;
  sessionId: string;
};

const statusPillStyles: Record<string, string> = {
  pending: 'bg-[#e8e6e0] text-[#5e5c54]',
  in_progress: 'bg-[#e3d9c8] text-[#8f482f]',
  completed: 'bg-[#d8e8d8] text-[#2d6a2d]',
  cancelled: 'bg-[#e8d8d8] text-[#8a3a3a]',
};

const priorityPillStyles: Record<string, string> = {
  high: 'bg-[#f0d8d8] text-[#a33a3a]',
  medium: 'bg-[#e8e0c8] text-[#8a6a2d]',
  low: 'bg-[#d8e0e8] text-[#3a5a7a]',
};

function TodoRow({ todo }: { todo: Todo }) {
  return (
    <View className="gap-1 rounded-xl border border-outline-variant/40 p-3">
      <View className="flex-row items-start gap-2">
        <MaterialIcons
          name={todo.status === 'completed' ? 'check-circle' : 'radio-button-unchecked'}
          size={18}
          color={todo.status === 'completed' ? '#2d6a2d' : '#5e5c54'}
          style={{ marginTop: 2 }}
        />
        <Text className="flex-1 text-body-md text-on-surface">{todo.content}</Text>
      </View>
      <View className="ml-7 flex-row gap-2">
        <View className={`rounded-full px-2 py-0.5 ${statusPillStyles[todo.status]}`}>
          <Text className="text-xs font-medium">{todo.status.replace('_', ' ')}</Text>
        </View>
        <View className={`rounded-full px-2 py-0.5 ${priorityPillStyles[todo.priority]}`}>
          <Text className="text-xs font-medium">{todo.priority}</Text>
        </View>
      </View>
    </View>
  );
}

export function TodoModal({ visible, onClose, sessionId }: TodoModalProps) {
  const { data: todos, isLoading, isError, refetch } = useTodos(sessionId, visible);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[70%] rounded-t-2xl bg-surface p-6 pb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-headline-md font-semibold text-on-surface">Todo</Text>
            <TouchableOpacity onPress={onClose} className="rounded-full p-1" hitSlop={8}>
              <MaterialIcons name="close" size={24} color="#5e5c54" />
            </TouchableOpacity>
          </View>

          <Ternary
            condition={isLoading}
            truthy={
              <View className="items-center py-10">
                <ActivityIndicator size="small" color="#8f482f" />
                <Text className="mt-2 text-sm text-[#5e5c54]">Loading todos…</Text>
              </View>
            }
            falsy={
              <Ternary
                // Prefer cached data over the error state when data exists
                // (e.g. a background refetch failed on a reopened modal).
                condition={!todos || todos.length === 0}
                truthy={
                  <Ternary
                    condition={!!isError}
                    truthy={
                      <View className="items-center py-10">
                        <MaterialIcons name="error-outline" size={32} color="#8a3a3a" />
                        <Text className="mt-2 text-sm text-[#5e5c54]">Failed to load todos</Text>
                        <Button
                          title="Retry"
                          variant="secondary"
                          size="sm"
                          className="mt-4"
                          onPress={() => refetch()}
                        />
                      </View>
                    }
                    falsy={
                      <View className="items-center py-10">
                        <MaterialIcons name="inbox" size={32} color="#8f482f" />
                        <Text className="mt-2 text-sm text-[#5e5c54]">No todos yet</Text>
                      </View>
                    }
                  />
                }
                falsy={
                  <ScrollView className="max-h-[55%]" showsVerticalScrollIndicator={false}>
                    <View className="gap-2">
                      {(todos ?? []).map((todo, index) => (
                        <TodoRow key={`${todo.status}-${todo.content}-${index}`} todo={todo} />
                      ))}
                    </View>
                  </ScrollView>
                }
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
}
