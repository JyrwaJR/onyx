import { useCommand } from '@/shared/hooks';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import {
  ChatSuggestionModal,
  type ChatSuggestionModalRef,
  type SuggestionItem,
} from './chat-suggestion-modal';
import { useFindFile } from '@/shared/hooks/use-find-file';

export interface TriggerInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

interface TriggerInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (text: string) => void;
}

interface ActiveTrigger {
  trigger: '@' | '/';
  query: string;
  start: number;
  end: number;
}

export const ChatAutocompleteInput = forwardRef<TriggerInputRef, TriggerInputProps>(
  function ChatAutocompleteInput(
    { value, onChangeText, placeholder = "Ask Agenyx or type '/' for commands...", ...props },
    ref
  ) {
    const inputRef = useRef<TextInput>(null);
    const suggestionModalRef = useRef<ChatSuggestionModalRef>(null);

    const [cursor, setCursor] = useState(0);
    const [focused, setFocused] = useState(false);
    const [activeTrigger, setActiveTrigger] = useState<ActiveTrigger | null>(null);

    const { data: commands, isFetching: isFetchingCommands } = useCommand();
    const query = value.slice(value.lastIndexOf('@') + 1);
    const { isFetching: isFetchingFile, data: files } = useFindFile(query);

    const fileItems = useMemo<SuggestionItem[]>(
      () =>
        files?.map((command) => ({
          id: command ?? '',
          label: command.split('/').pop()?.split('.')[0] ?? '',
          description: command,
        })) ?? [],
      [files]
    );

    const commandItems = useMemo<SuggestionItem[]>(
      () =>
        commands?.map((command) => ({
          id: command.name ?? '',
          label: command.name ?? '',
          description: command.description ?? '',
        })) ?? [],
      [commands]
    );

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),

      blur: () => inputRef.current?.blur(),

      clear: () => {
        onChangeText('');
        setCursor(0);
        setActiveTrigger(null);
        suggestionModalRef.current?.dismiss();
      },
    }));

    const findTrigger = useCallback((text: string, position: number): ActiveTrigger | null => {
      const beforeCursor = text.slice(0, position);

      const match = beforeCursor.match(/(?:^|\s)([@/])([^\s]*)$/);

      if (!match || match.index === undefined) {
        return null;
      }

      const trigger = match[1] as '@' | '/';
      const query = match[2] ?? '';

      const start = match[0].startsWith(' ') ? match.index + 1 : match.index;

      return {
        trigger,
        query,
        start,
        end: position,
      };
    }, []);

    /**
     * Determine the active trigger from the current text.
     */
    useEffect(() => {
      if (!focused) {
        setActiveTrigger(null);
        suggestionModalRef.current?.dismiss();
        return;
      }

      const trigger = findTrigger(value, cursor);

      if (!trigger) {
        setActiveTrigger(null);
        suggestionModalRef.current?.dismiss();
        return;
      }

      setActiveTrigger(trigger);
    }, [value, cursor, focused, findTrigger]);

    /**
     * Build suggestions based on the active trigger.
     */
    const suggestions = useMemo<SuggestionItem[]>(() => {
      if (!activeTrigger) {
        return [];
      }

      if (activeTrigger.trigger === '/') {
        const query = activeTrigger.query.toLowerCase();

        return commandItems.filter((item) => item.label.toLowerCase().includes(query));
      }

      if (activeTrigger.trigger === '@') {
        return fileItems;
      }

      return [];
    }, [activeTrigger, commandItems, fileItems]);

    /**
     * Show modal whenever a trigger becomes active.
     */
    useEffect(() => {
      if (!activeTrigger) {
        return;
      }

      suggestionModalRef.current?.present();
    }, [activeTrigger]);

    const handleSelect = useCallback(
      (item: SuggestionItem) => {
        if (!activeTrigger) {
          return;
        }

        const replacement = item.value ?? `${activeTrigger.trigger}${item.id}`;

        const before = value.slice(0, activeTrigger.start);

        const after = value.slice(activeTrigger.end);

        const newValue = before + replacement + ' ' + after;

        const newCursor = before.length + replacement.length + 1;

        onChangeText(newValue);
        setCursor(newCursor);
        setActiveTrigger(null);

        suggestionModalRef.current?.dismiss();

        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      },
      [activeTrigger, value, onChangeText]
    );

    return (
      <>
        <View className="flex-1">
          <ChatSuggestionModal
            ref={suggestionModalRef}
            trigger={activeTrigger?.trigger ?? '/'}
            query={activeTrigger?.query ?? ''}
            items={suggestions}
            loading={
              activeTrigger?.trigger === '/'
                ? isFetchingCommands
                : activeTrigger?.trigger === '@'
                  ? isFetchingFile
                  : false
            }
            onSelect={handleSelect}
          />
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={(text) => {
              onChangeText(text);
              setCursor(text.length);
            }}
            onSelectionChange={(event) => {
              setCursor(event.nativeEvent.selection.start);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            placeholderTextColor="#5e5c54"
            multiline
            {...props}
          />
        </View>
      </>
    );
  }
);
