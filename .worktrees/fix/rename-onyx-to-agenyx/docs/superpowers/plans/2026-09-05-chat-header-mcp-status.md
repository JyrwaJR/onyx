# MCP Status in Chat Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "12ms socket" text in `ChatHeaderBar.tsx` with a dynamic display of active/total MCP servers.

**Architecture:** Use the existing `useMcpStatus` hook to fetch server status. Calculate active (connected) vs total MCP servers. Display in the format `active/total servers`.

**Tech Stack:** React, TypeScript, React Query (for `useMcpStatus`).

---

### Task 1: Update `ChatHeaderBar` component

**Files:**
- Modify: `src/features/chat/components/ChatHeaderBar.tsx`
- File info: Uses `useSession`. Needs to add `useMcpStatus` from `@shared/hooks/use-mcp-status`.

- [ ] **Step 1: Import `useMcpStatus`**

```tsx
import { useMcpStatus } from '@shared/hooks/use-mcp-status';
```

- [ ] **Step 2: Add `useMcpStatus` to `ChatHeaderBar`**

```tsx
const { data: mcpServers, isLoading } = useMcpStatus();
const totalServers = mcpServers?.length ?? 0;
const activeServers = mcpServers?.filter(s => s.status === 'connected').length ?? 0;
```

- [ ] **Step 3: Update display text**

Change `src/features/chat/components/ChatHeaderBar.tsx:34` from:
```tsx
<Text className="text-[11px] text-[#5e5c54]">12ms socket</Text>
```
to:
```tsx
<Text className="text-[11px] text-[#5e5c54]">
  {isLoading ? '...' : `${activeServers}/${totalServers} servers`}
</Text>
```

- [ ] **Step 4: Commit**

```bash
git add src/features/chat/components/ChatHeaderBar.tsx
git commit -m "feat: show active/total mcp servers in chat header"
```
