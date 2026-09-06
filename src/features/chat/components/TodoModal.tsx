import { Modal, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ternary } from '@/shared/components/ui/ternary';
import { Button } from '@/shared/components/ui/button';
import { useTodos } from '../hooks/use-todos';
import type { TodoPriority, TodoStatus } from '../../../shared/api/types';

type TodoModalProps = {
  visible: boolean;
  onClose: () => void;
  sessionId: string;
};

/** Onyx theme color tokens used by the todo bottom sheet. */
const COLORS = {
  surface: '#fcf9f6',
  surfaceDim: '#f0edeb',
  surfaceCard: '#ffffff',
  primary: '#cc785c',
  primaryHover: '#b56449',
  primarySoft: '#faeae3',
  border: '#eae6e1',
  borderMuted: '#f3efe9',
  textPrimary: '#1a1918',
  textSecondary: '#6e6962',
  textMuted: '#9e9992',
  danger: '#d64545',
  dangerSoft: '#fdf2f2',
  accentTag: '#f4ede6',
  grabber: '#d6d0c7',
} as const;

/** Human-readable labels for each server todo status. */
const statusLabel: Record<TodoStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/** Human-readable labels for each server todo priority. */
const priorityLabel: Record<TodoPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

/** Filter chip identifiers for the horizontal filter bar. */
type FilterKey = 'all' | 'in_progress' | 'completed';

/** A rendered task card derived from a server-returned `Todo`. */
type TaskItem = {
  /** Stable key derived from the todo fields (server items have no id). */
  key: string;
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  completed: boolean;
};

/**
 * Bottom sheet that lists the agent's todos for a session.
 *
 * Renders an Onyx-themed sheet with a drag grabber, a header showing pending
 * and completed counts, horizontal filter chips (All / In progress /
 * Completed), and grouped pending/completed task cards with custom checkboxes,
 * status badges, and priority metadata. Completion toggles are local-only UI
 * state because the server exposes no todo mutation endpoint. Shows loading,
 * error (with Retry), and empty ("No todos yet") states.
 */
export function TodoModal({ visible, onClose, sessionId }: TodoModalProps) {
  const { data: todos, isLoading, isError, refetch } = useTodos(sessionId, visible);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});

  const tasks = useMemo<TaskItem[]>(
    () =>
      (todos ?? []).map((todo, index) => {
        const key = `${todo.status}:${todo.priority}:${todo.content}:${index}`;
        return {
          key,
          title: todo.content,
          status: todo.status,
          priority: todo.priority,
          completed: completedOverrides[key] ?? todo.status === 'completed',
        };
      }),
    [todos, completedOverrides]
  );

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const showPending = activeFilter !== 'completed';
  const showCompleted = activeFilter !== 'in_progress';
  const shownCount =
    (showPending ? pendingTasks.length : 0) + (showCompleted ? completedTasks.length : 0);

  const chipLabels: Record<FilterKey, string> = {
    all: `All (${tasks.length})`,
    in_progress: `In progress (${pendingTasks.length})`,
    completed: `Completed (${completedTasks.length})`,
  };

  const toggleTaskCompletion = (task: TaskItem) => {
    setCompletedOverrides((prev) => ({ ...prev, [task.key]: !task.completed }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onDismiss={onClose}
      onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/35">
        {/* Bottom sheet container */}
        <SafeAreaView
          edges={['right', 'left']}
          className="max-h-[88%] w-full  max-w-[420px] self-center overflow-hidden rounded-t-md border-t border-[#eae6e1] bg-[#fcf9f6] py-2">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-[#eae6e1]/80 px-5 pb-3 pt-1">
            <View className="flex-row items-center gap-2.5">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#faeae3]">
                <MaterialIcons name="task-alt" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text className="text-2xl font-medium text-[#1a1918]">Session Tasks Preview</Text>
                <Text className="text-[11px] font-medium text-[#6e6962]">
                  {pendingTasks.length} pending · {completedTasks.length} completed
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#f0edeb] active:opacity-70">
              <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Ternary
            condition={isLoading}
            truthy={
              <View className="items-center py-10">
                <ActivityIndicator size="small" color={COLORS.primary} />
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
                        <MaterialIcons name="inbox" size={32} color={COLORS.primary} />
                        <Text className="mt-2 text-sm text-[#5e5c54]">No todos yet</Text>
                      </View>
                    }
                  />
                }
                falsy={
                  <>
                    {/* Horizontal filter chips bar */}
                    <View className="border-b border-[#eae6e1]/70 bg-white/70 px-4 py-2.5">
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center', gap: 6 }}>
                        <Text className="mr-1 text-[10px] font-medium uppercase tracking-wider text-[#9e9992]">
                          Filter:
                        </Text>
                        {(Object.keys(chipLabels) as FilterKey[]).map((key) => {
                          const isActive = activeFilter === key;
                          return (
                            <TouchableOpacity
                              key={key}
                              onPress={() => setActiveFilter(key)}
                              className={`rounded-full px-2.5 py-1 ${
                                isActive ? 'bg-[#cc785c]' : 'bg-[#f0edeb]'
                              }`}>
                              <Text
                                className={`text-[11px] font-medium ${
                                  isActive ? 'text-white' : 'text-[#6e6962]'
                                }`}>
                                {chipLabels[key]}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Scrollable todo list */}
                    <ScrollView
                      className="max-h-[58%] p-4"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
                      {shownCount === 0 && (
                        <View className="items-center py-8">
                          <Text className="text-sm text-[#9e9992]">No todos in this filter</Text>
                        </View>
                      )}

                      {/* Pending section */}
                      {showPending && pendingTasks.length > 0 && (
                        <>
                          <View className="flex-row items-center justify-between pb-0.5 pt-1">
                            <Text className="text-[10px] font-medium uppercase tracking-wider text-[#9e9992]">
                              Pending ({pendingTasks.length})
                            </Text>
                            <Text className="font-mono text-[10px] text-[#9e9992]">Onyx Queue</Text>
                          </View>

                          {pendingTasks.map((task) => (
                            <View
                              key={task.key}
                              className="flex-row items-center  gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                              {/* Custom checkbox */}
                              <TouchableOpacity
                                onPress={() => toggleTaskCompletion(task)}
                                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2 border-[#cc785c] bg-white">
                                <View className="h-2 w-2 rounded-[2px] bg-[#cc785c]" />
                              </TouchableOpacity>

                              {/* Content */}
                              <View className="flex-1">
                                <View className="flex-row items-center justify-between gap-2">
                                  <Text
                                    numberOfLines={1}
                                    className="flex-1 text-xs font-semibold text-[#1a1918]">
                                    {task.title}
                                  </Text>

                                  {/* Status badge */}
                                  <View
                                    className={`rounded px-2 py-0.5 ${
                                      task.status === 'in_progress'
                                        ? 'bg-[#faeae3]'
                                        : 'bg-[#f0edeb]'
                                    }`}>
                                    <Text
                                      className={`text-[10px] font-medium ${
                                        task.status === 'in_progress'
                                          ? 'text-[#cc785c]'
                                          : 'text-[#6e6962]'
                                      }`}>
                                      {statusLabel[task.status]}
                                    </Text>
                                  </View>
                                </View>

                                {/* Priority metadata */}
                                <View className="mt-2 flex-row items-center gap-2.5">
                                  <View className="flex-row items-center gap-1">
                                    <MaterialIcons
                                      name="flag"
                                      size={13}
                                      color={
                                        task.status === 'in_progress'
                                          ? COLORS.primary
                                          : COLORS.textMuted
                                      }
                                    />
                                    <Text className="text-[10px] text-[#9e9992]">
                                      {priorityLabel[task.priority]}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </>
                      )}

                      {/* Completed section */}
                      {showCompleted && completedTasks.length > 0 && (
                        <>
                          {showPending && pendingTasks.length > 0 && (
                            <View className="flex-row items-center justify-between pb-0.5 pt-3">
                              <Text className="text-[10px] font-medium uppercase tracking-wider text-[#9e9992]">
                                Completed ({completedTasks.length})
                              </Text>
                              <Text className="text-[11px] text-[#9e9992]">Verified</Text>
                            </View>
                          )}

                          {completedTasks.map((task) => (
                            <View
                              key={task.key}
                              className="flex-row items-start gap-3 rounded-md border border-[#eae6e1]/60 bg-[#f0edeb]/60 p-3 opacity-75">
                              {/* Checked box */}
                              <TouchableOpacity
                                onPress={() => toggleTaskCompletion(task)}
                                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md bg-[#cc785c]">
                                <MaterialIcons name="check" size={14} color="white" />
                              </TouchableOpacity>

                              {/* Strikethrough content */}
                              <View className="flex-1">
                                <Text className="text-xs font-medium leading-tight text-[#6e6962] line-through">
                                  {task.title}
                                </Text>
                                <Text className="mt-0.5 text-[10px] text-[#9e9992]">
                                  {priorityLabel[task.priority]}
                                </Text>
                              </View>

                              <MaterialIcons name="done-all" size={16} color={COLORS.textMuted} />
                            </View>
                          ))}
                        </>
                      )}
                    </ScrollView>
                  </>
                }
              />
            }
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
