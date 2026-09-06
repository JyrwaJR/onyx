import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ternary } from '@/shared/components/ui/ternary';
import { Button } from '@/shared/components/ui/button';
import { useTodos } from '../hooks/use-todos';
import { MaterialIcons } from '@expo/vector-icons';
import { TodoPriority, TodoStatus } from '@/shared/api';

type TodoModalProps = {
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
type FilterKey = 'all' | 'in_progress' | 'completed' | 'pending';

/** A rendered task card derived from a server-returned `Todo`. */
type TaskItem = {
  key: string;
  title: string;
  status: TodoStatus;
  priority: TodoPriority;
  completed: boolean;
};

export const TodoModal = forwardRef<BottomSheetModal, TodoModalProps>(function TodoModal(
  { sessionId },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});
  const { data: todos, isLoading, isError, refetch } = useTodos(sessionId, isOpen);
  const snapPoints = useMemo(() => ['22', '44', '88%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        opacity={0.35}
      />
    ),
    []
  );

  const tasks = useMemo<TaskItem[]>(
    () =>
      (todos ?? []).map((todo, index) => {
        // Stable key using immutable content + index rather than mutable status
        const key = `todo:${todo.priority}:${todo.content}:${index}`;
        const isCompleted = completedOverrides[key] ?? todo.status === 'completed';
        const effectiveStatus: TodoStatus = isCompleted ? 'completed' : todo.status;

        return {
          key,
          title: todo.content,
          status: effectiveStatus,
          priority: todo.priority,
          completed: isCompleted,
        };
      }),
    [todos, completedOverrides]
  );

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const progressTasks = tasks.filter((task) => task.status === 'in_progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const showPending = activeFilter === 'all' || activeFilter === 'pending';
  const showProgress = activeFilter === 'all' || activeFilter === 'in_progress';
  const showCompleted = activeFilter === 'all' || activeFilter === 'completed';

  const shownCount =
    (showProgress ? progressTasks.length : 0) +
    (showPending ? pendingTasks.length : 0) +
    (showCompleted ? completedTasks.length : 0);

  const chipLabels: Record<FilterKey, string> = {
    all: `All (${tasks.length})`,
    pending: `Pending (${pendingTasks.length})`,
    in_progress: `In progress (${progressTasks.length})`,
    completed: `Completed (${completedTasks.length})`,
  };

  const toggleTaskCompletion = (task: TaskItem) => {
    setCompletedOverrides((prev) => ({ ...prev, [task.key]: !task.completed }));
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={(index) => setIsOpen(index >= 0)}
      handleIndicatorStyle={{ backgroundColor: COLORS.grabber, width: 36 }}
      backgroundStyle={{ backgroundColor: COLORS.surface }}>
      <BottomSheetView className="flex-1">
        <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-[#eae6e1]/80 px-5 pb-3 pt-1">
            <View className="flex-row items-center gap-2.5">
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#faeae3]">
                <MaterialIcons name="task-alt" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text className="text-2xl font-medium text-[#1a1918]">Session Tasks Preview</Text>
                <Text className="text-[11px] font-medium text-[#6e6962]">
                  {pendingTasks.length + progressTasks.length} active · {completedTasks.length}{' '}
                  completed
                </Text>
              </View>
            </View>
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
                condition={!todos || todos.length === 0 || !!isError}
                truthy={
                  <Ternary
                    condition={!!isError}
                    truthy={
                      <View className="items-center py-10">
                        <MaterialIcons name="error-outline" size={32} color={COLORS.danger} />
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
                  <View className="flex-1">
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

                    {/* Scrollable task list */}
                    <BottomSheetScrollView
                      className="flex-1 px-4 pt-3"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 24, gap: 10 }}>
                      {shownCount === 0 && (
                        <View className="items-center py-8">
                          <Text className="text-sm text-[#9e9992]">No todos in this filter</Text>
                        </View>
                      )}

                      {/* In Progress section */}
                      {showProgress && progressTasks.length > 0 && (
                        <>
                          <View className="flex-row items-center justify-between pb-0.5 pt-1">
                            <Text className="text-[10px] font-medium uppercase tracking-wider text-[#9e9992]">
                              Progress ({progressTasks.length})
                            </Text>
                            <Text className="font-mono text-[10px] text-[#9e9992]">Onyx Queue</Text>
                          </View>
                          {progressTasks.map((task) => (
                            <View
                              key={task.key}
                              className="flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                              <TouchableOpacity
                                onPress={() => toggleTaskCompletion(task)}
                                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2 border-[#cc785c] bg-white">
                                <View className="h-2 w-2 rounded-[2px] bg-[#cc785c]" />
                              </TouchableOpacity>
                              <View className="flex-1">
                                <View className="flex-row items-center justify-between gap-2">
                                  <Text
                                    numberOfLines={1}
                                    className="flex-1 text-xs font-semibold text-[#1a1918]">
                                    {task.title}
                                  </Text>
                                  <View className="rounded bg-[#faeae3] px-2 py-0.5">
                                    <Text className="text-[10px] font-medium text-[#cc785c]">
                                      {statusLabel[task.status]}
                                    </Text>
                                  </View>
                                </View>
                                <View className="mt-2 flex-row items-center gap-2.5">
                                  <View className="flex-row items-center gap-1">
                                    <MaterialIcons name="flag" size={13} color={COLORS.primary} />
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
                              className="flex-row items-center gap-3 rounded-md border border-[#eae6e1] bg-white p-3.5">
                              <TouchableOpacity
                                onPress={() => toggleTaskCompletion(task)}
                                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border-2 border-[#eae6e1] bg-white"
                              />
                              <View className="flex-1">
                                <View className="flex-row items-center justify-between gap-2">
                                  <Text
                                    numberOfLines={1}
                                    className="flex-1 text-xs font-semibold text-[#1a1918]">
                                    {task.title}
                                  </Text>
                                  <View className="rounded bg-[#f0edeb] px-2 py-0.5">
                                    <Text className="text-[10px] font-medium text-[#6e6962]">
                                      {statusLabel[task.status]}
                                    </Text>
                                  </View>
                                </View>
                                <View className="mt-2 flex-row items-center gap-2.5">
                                  <View className="flex-row items-center gap-1">
                                    <MaterialIcons name="flag" size={13} color={COLORS.textMuted} />
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
                          <View className="flex-row items-center justify-between pb-0.5 pt-3">
                            <Text className="text-[10px] font-medium uppercase tracking-wider text-[#9e9992]">
                              Completed ({completedTasks.length})
                            </Text>
                            <Text className="text-[11px] text-[#9e9992]">Verified</Text>
                          </View>
                          {completedTasks.map((task) => (
                            <View
                              key={task.key}
                              className="flex-row items-start gap-3 rounded-md border border-[#eae6e1]/60 bg-[#f0edeb]/60 p-3 opacity-75">
                              <TouchableOpacity
                                onPress={() => toggleTaskCompletion(task)}
                                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md bg-[#cc785c]">
                                <MaterialIcons name="check" size={14} color="white" />
                              </TouchableOpacity>
                              <View className="flex-1">
                                <View className="flex-row items-center justify-between gap-2">
                                  <Text
                                    numberOfLines={1}
                                    className="flex-1 text-xs font-medium text-[#6e6962] line-through">
                                    {task.title}
                                  </Text>
                                  <View className="rounded bg-[#eae6e1] px-2 py-0.5">
                                    <Text className="text-[10px] font-medium text-[#6e6962]">
                                      {statusLabel[task.status]}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </>
                      )}
                    </BottomSheetScrollView>
                  </View>
                }
              />
            }
          />
        </SafeAreaView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
