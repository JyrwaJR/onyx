# Design: Chat Message Syncing via Polling

## Overview
Ensure chat messages stay synchronized across devices by implementing periodic polling in `useMessages`.

## Approach
Add `refetchInterval` to the `useInfiniteQuery` hook in `src/features/chat/hooks/use-chat.ts`.

## Implementation Details
- Configure `refetchInterval` (e.g., 30000ms - 30 seconds) in `useInfiniteQuery`.
- This will ensure the message list reconciles with the server periodically, keeping it in sync even when the user is idle or switches devices.

## Performance Considerations
- 30 seconds is a reasonable balance between responsiveness and network/battery usage.
- React Query will automatically pause polling if the window/app is unfocused, which helps mitigate performance impact.
