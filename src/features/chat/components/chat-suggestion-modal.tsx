import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface SuggestionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  value?: string;
}

export interface ChatSuggestionModalRef {
  present: () => void;
  dismiss: () => void;
}

interface ChatSuggestionModalProps {
  trigger: '@' | '/';
  query: string;
  items: SuggestionItem[];
  loading?: boolean;
  onSelect: (item: SuggestionItem) => void;
}

export const ChatSuggestionModal = forwardRef<ChatSuggestionModalRef, ChatSuggestionModalProps>(
  function ChatSuggestionModal({ trigger, query, items, loading = false, onSelect }, ref) {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      present: () => {
        setVisible(true);
      },

      dismiss: () => {
        setVisible(false);
      },
    }));

    if (!visible) {
      return null;
    }

    return (
      <View
        className="absolute bottom-full left-0 right-0 z-50 mb-3 w-full overflow-hidden rounded-md  bg-[#fcf9f6]"
        style={{
          height: 260,
        }}>
        <View
          className="w-full flex-1 overflow-hidden rounded-t-2xl"
          style={{
            backgroundColor: '#fcf9f6',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}>
          {/* Header */}
          <View className="flex-row items-center border-b border-[#dac1ba] px-4 py-3">
            <Text className="text-base font-semibold text-[#1c1c1a]">
              {trigger === '@' ? 'Files' : 'Commands'}
            </Text>

            {query ? (
              <Text numberOfLines={1} className="ml-2 flex-1 text-sm text-[#5e5c54]">
                {trigger}
                {query}
              </Text>
            ) : null}
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onSelect(item)}
                  className="flex-row items-center px-4 py-4">
                  {item.icon ? <Text className="mr-3 text-lg">{item.icon}</Text> : null}

                  <View className="flex-1">
                    <Text className="text-sm font-medium capitalize text-[#1c1c1a]">
                      {item.label}
                    </Text>

                    {item.description ? (
                      <Text numberOfLines={1} className="mt-1 text-xs text-[#5e5c54]">
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="items-center justify-center py-10">
                  <Text className="text-sm text-[#5e5c54]">No results</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    );
  }
);
