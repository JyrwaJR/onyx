# Design: Chat Selection Component

## Overview
Implement an interactive selection component that replaces the `MessageInput` when the server sends an interactive question to the user.

## Data Model
- Add a new block type to `MessageContentBlock` in `src/shared/api/types.ts`:
  ```ts
  | { type: 'selection'; id: string; question: string; options: string[] }
  ```

## UI/UX Changes
- **New Component**: `ChatSelection` component to render the selection options.
- **`ChatScreen` state**: Add `activeInteraction` state to track the active selection question.
- **Conditional Rendering**: Replace `MessageInput` with `ChatSelection` when `activeInteraction` is set.

## Interaction Flow
1. Server sends a message containing a `selection` block.
2. `ChatScreen` detects this block and sets `activeInteraction`.
3. UI switches to `ChatSelection` component.
4. User selects an option:
   - `handleSend(selectedOption)` is called.
   - `activeInteraction` is reset to `null` to restore `MessageInput`.
