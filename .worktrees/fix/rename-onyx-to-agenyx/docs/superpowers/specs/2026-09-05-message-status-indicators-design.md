# Design: Message Status Indicators (Pending/Sending)

## Overview
Add status indicators to chat messages to improve user feedback during the message sending process.

## Data Model
Add `status` field to `V2Message` type in `shared/api/types.ts`.

```ts
export type MessageStatus = 'pending' | 'sending' | 'sent';

export interface V2Message {
  // ... existing fields
  status?: MessageStatus;
}
```

## UI Changes
Update `UserMessage.tsx` to handle these states:
- `pending`: Desaturated look.
- `sending`: Display a loading spinner.
- `sent`: Default rendering.

## State Management
Optimistic update flow:
1. Message added to state with `status: 'pending'` (or `'sending'`).
2. `useSendMessage` API call triggered.
3. Message status updated in state upon success or error.
