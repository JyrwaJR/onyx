# Chat Selection Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `ChatSelection` component to handle interactive questions, replacing `MessageInput` when active.

**Architecture:**
1. Update `MessageContentBlock` to support `selection` type.
2. Build `ChatSelection` UI component.
3. Update `ChatScreen` to manage interaction state.

**Tech Stack:** React Native, TypeScript

---

### Task 1: Update Data Model

**Files:**
- Modify: `src/shared/api/types.ts`

- [ ] **Step 1: Extend MessageContentBlock**

```ts
// src/shared/api/types.ts

export type MessageContentBlock =
  | { type: 'text'; id: string; text: string }
  | { type: 'reasoning'; id: string; text: string; time?: TimeSpan }
  | {
      type: 'tool';
      id: string;
      callID?: string;
      tool: string;
      state: {
        status: string;
        input?: Record<string, unknown>;
        output?: unknown;
        title?: string;
      };
    }
  | { type: 'selection'; id: string; question: string; options: string[] }; // Add this
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/api/types.ts
git commit -m "feat: add selection type to MessageContentBlock"
```

### Task 2: Create ChatSelection Component

**Files:**
- Create: `src/features/chat/components/ChatSelection.tsx`

- [ ] **Step 1: Build ChatSelection**

```tsx
// src/features/chat/components/ChatSelection.tsx
import { View, Text, TouchableOpacity } from 'react-native';

interface ChatSelectionProps {
  options: string[];
  onSelect: (option: string) => void;
}

export function ChatSelection({ options, onSelect }: ChatSelectionProps) {
  return (
    <View className="px-4 py-2 bg-[#fcf9f6] border-t border-[#dac1ba]/30">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          className="mb-2 p-3 rounded-lg bg-white border border-[#dac1ba]"
        >
          <Text className="text-center text-[#1c1c1a]">{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/chat/components/ChatSelection.tsx
git commit -m "feat: create ChatSelection component"
```

### Task 3: Update ChatScreen Interaction

**Files:**
- Modify: `src/features/chat/screens/ChatScreen.tsx`

- [ ] **Step 1: Add interaction state**

```tsx
// src/features/chat/screens/ChatScreen.tsx

// ...
export default function ChatScreen() {
  // ...
  const [activeInteraction, setActiveInteraction] = useState<{
    type: 'selection';
    question: string;
    options: string[];
  } | null>(null);
  // ...
```

- [ ] **Step 2: Conditionally render input area**

```tsx
// src/features/chat/screens/ChatScreen.tsx

// ... in the Render section ...
          {/* Bottom Input Area */}
          <View className="border-t border-[#dac1ba]/30 bg-[#fcf9f6]/95 pb-2">
            <ContextBar />
            {activeInteraction ? (
              <ChatSelection
                options={activeInteraction.options}
                onSelect={(option) => {
                  handleSend(option);
                  setActiveInteraction(null);
                }}
              />
            ) : (
              <MessageInput
                disabled={sendMessage.isPaused}
                sending={sendMessage.isPending}
                onSend={handleSend}
              />
            )}
          </View>
// ...
```

- [ ] **Step 3: Commit**

```bash
git add src/features/chat/screens/ChatScreen.tsx
git commit -m "feat: update ChatScreen to handle ChatSelection"
```
