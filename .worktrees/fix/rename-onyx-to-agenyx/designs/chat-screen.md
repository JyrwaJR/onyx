# Chat Screen — Design Tokens

> Real-time chat interface with SSE streaming, message history, and markdown rendering.

---

## Screen Overview

| Property   | Value                                                   |
| ---------- | ------------------------------------------------------- |
| Route      | `(tabs)/projects/[projectId]/sessions/[sessionId]/chat` |
| Header     | Shown — "Chat" title with back button                   |
| Background | `canvas` (#faf9f5)                                      |
| Layout     | Stack (header + message list + input bar)               |
| Safe Area  | Top (status bar) + Bottom (keyboard area)               |

---

## Layout Structure

````
┌─────────────────────────────┐
│  ← Back  Chat               │  ← Navigation Header
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ AI Message Bubble     │  │  ← Left-aligned, cream card
│  │ Hello! How can I      │  │
│  │ help you today?       │  │
│  │ 2m ago                │  │
│  └───────────────────────┘  │
│                             │
│      ┌───────────────────┐  │
│      │ User Message      │  │  ← Right-aligned, coral
│      │ Hello!            │  │
│      │ 2m ago            │  │
│      └───────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ AI Message Bubble     │  │
│  │ [Tool Call Block]     │  │  ← Collapsible tool call
│  │ ```code block```      │  │  ← Markdown code block
│  │ 1m ago                │  │
│  └───────────────────────┘  │
│                             │
├─────────────────────────────┤
│  [  Type a message...  ] [▶]│  ← Message Input Bar
└─────────────────────────────┘
````

---

## Elements

### 1. Navigation Header

| Property     | Value              |
| ------------ | ------------------ |
| Title        | `Chat`             |
| Background   | `canvas` (#faf9f5) |
| Title Color  | `ink` (#141413)    |
| Title Font   | Inter              |
| Title Size   | 18px               |
| Title Weight | 500                |
| Shadow       | None               |
| Tint Color   | `ink` (#141413)    |

#### Back Button (left side)

| Property                   | Value                 |
| -------------------------- | --------------------- |
| Layout                     | Row (arrow + text)    |
| Arrow                      | `←` (18px, ink color) |
| Text                       | `Back`                |
| Text Font                  | Inter                 |
| Text Size                  | `body-md` — 16px      |
| Text Weight                | 500 (medium)          |
| Text Color                 | `ink` (#141413)       |
| Gap between arrow and text | 4px                   |
| Padding Left               | 8px                   |
| Active Opacity             | 0.7                   |

---

### 2. Message List

| Property         | Value                             |
| ---------------- | --------------------------------- |
| Component        | `FlatList`                        |
| Content Padding  | 16px horizontal, 8px bottom       |
| Scroll Direction | Vertical                          |
| Auto Scroll      | Scrolls to bottom on new messages |
| Keyboard Dismiss | On drag                           |

---

### 3. Message Bubble — User

| Property       | Value                          |
| -------------- | ------------------------------ |
| Alignment      | Right (self-end)               |
| Max Width      | 85% of screen                  |
| Background     | `primary` (#cc785c)            |
| Border Radius  | 24px (`rounded-2xl`)           |
| Padding        | 12px vertical, 16px horizontal |
| Margin Bottom  | 12px                           |
| Active Opacity | 0.7                            |

#### User Message Text

| Property    | Value                  |
| ----------- | ---------------------- |
| Font        | `font-sans` (Inter)    |
| Size        | 15px                   |
| Weight      | 400                    |
| Line Height | 22px                   |
| Color       | `on-primary` (#ffffff) |

#### User Message Timestamp

| Property   | Value                                      |
| ---------- | ------------------------------------------ |
| Text       | Relative time (e.g., `Just now`, `5m ago`) |
| Font       | `font-sans` (Inter)                        |
| Size       | `caption-upper` — 12px                     |
| Weight     | 500                                        |
| Color      | `muted-soft` (#8e8b82)                     |
| Alignment  | Right                                      |
| Margin Top | 4px                                        |

#### Long Press Behavior (User messages only)

| Property | Value                         |
| -------- | ----------------------------- |
| Trigger  | Long press                    |
| Action   | Alert dialog                  |
| Title    | `Delete Message`              |
| Message  | `Delete this message?`        |
| Cancel   | `Cancel` (style: cancel)      |
| Delete   | `Delete` (style: destructive) |

---

### 4. Message Bubble — AI / Assistant

| Property       | Value                          |
| -------------- | ------------------------------ |
| Alignment      | Left (self-start)              |
| Max Width      | 85% of screen                  |
| Background     | `surface-card` (#efe9de)       |
| Border Radius  | 24px (`rounded-2xl`)           |
| Padding        | 12px vertical, 16px horizontal |
| Margin Bottom  | 12px                           |
| Active Opacity | 1 (no press effect)            |

#### AI Message Text Container

| Property | Value           |
| -------- | --------------- |
| Color    | `ink` (#141413) |

#### AI Message Timestamp

| Property   | Value                  |
| ---------- | ---------------------- |
| Text       | Relative time          |
| Font       | `font-sans` (Inter)    |
| Size       | `caption-upper` — 12px |
| Weight     | 500                    |
| Color      | `muted-soft` (#8e8b82) |
| Alignment  | Left                   |
| Margin Top | 4px                    |

---

### 5. Markdown Renderer (inside AI bubbles)

#### Body Text

| Property    | Value               |
| ----------- | ------------------- |
| Font        | `font-sans` (Inter) |
| Size        | 15px                |
| Line Height | 22px                |
| Color       | `ink` (#141413)     |

#### Code Block (fenced)

| Property      | Value                        |
| ------------- | ---------------------------- |
| Background    | `surface-soft` (#f5f0e8)     |
| Padding       | 12px                         |
| Border Radius | `radius-md` — 8px            |
| Font          | `font-mono` (JetBrains Mono) |
| Size          | 13px                         |

#### Inline Code

| Property      | Value                        |
| ------------- | ---------------------------- |
| Background    | `hairline` (#e6dfd8)         |
| Padding       | 0px vertical, 4px horizontal |
| Border Radius | `radius-xs` — 4px            |
| Font          | `font-mono` (JetBrains Mono) |
| Size          | 13px                         |

#### Links

| Property   | Value               |
| ---------- | ------------------- |
| Color      | `primary` (#cc785c) |
| Decoration | Underline on press  |

#### Headings

| Level | Size | Weight     | Margin Top | Margin Bottom |
| ----- | ---- | ---------- | ---------- | ------------- |
| H1    | 22px | 700 (bold) | 12px       | 8px           |
| H2    | 18px | 700 (bold) | 10px       | 6px           |
| H3    | 16px | 700 (bold) | 8px        | 4px           |

#### Lists

| Property      | Value |
| ------------- | ----- |
| Margin Top    | 4px   |
| Margin Bottom | 4px   |

#### Blockquote

| Property          | Value                    |
| ----------------- | ------------------------ |
| Border Left       | 3px `hairline` (#e6dfd8) |
| Padding Left      | 12px                     |
| Margin Left       | 0                        |
| Margin Top/Bottom | 4px                      |

---

### 6. Tool Call Block (inside AI bubbles)

| Property        | Value                    |
| --------------- | ------------------------ |
| Background      | `surface-soft` (#f5f0e8) |
| Border          | 1px `hairline` (#e6dfd8) |
| Border Radius   | `radius-md` — 8px        |
| Padding         | 8px                      |
| Margin Vertical | 4px                      |

#### Tool Call Header

| Property     | Value                                  |
| ------------ | -------------------------------------- |
| Layout       | Row (title + expand icon)              |
| Title        | `part.state.title` or `part.tool` name |
| Title Font   | Inter                                  |
| Title Size   | 12px                                   |
| Title Weight | 500                                    |
| Title Color  | `body-strong` (#252523)                |
| Expand Icon  | `▶` / `▼` (12px, `muted-soft`)         |

#### Tool Call Arguments (expanded)

| Property              | Value                                       |
| --------------------- | ------------------------------------------- |
| Label                 | `Arguments:`                                |
| Label Color           | `muted` (#6c6a64)                           |
| Label Size            | 12px                                        |
| Content Background    | `canvas` (#faf9f5)                          |
| Content Padding       | 8px                                         |
| Content Border Radius | 4px                                         |
| Content Font          | Mono                                        |
| Content Size          | 12px                                        |
| Content Color         | `body` (#3d3d3a)                            |
| Content               | `JSON.stringify(part.state.input, null, 2)` |
| Selectable            | true                                        |

#### Tool Call Result (expanded)

| Property              | Value              |
| --------------------- | ------------------ |
| Label                 | `Result:`          |
| Label Color           | `muted` (#6c6a64)  |
| Label Size            | 12px               |
| Margin Top            | 8px                |
| Content Background    | `canvas` (#faf9f5) |
| Content Padding       | 8px                |
| Content Border Radius | 4px                |
| Content Font          | Mono               |
| Content Size          | 12px               |
| Content Color         | `body` (#3d3d3a)   |
| Selectable            | true               |

---

### 7. Reasoning Block (inside AI bubbles)

| Property        | Value                    |
| --------------- | ------------------------ |
| Background      | `surface-soft` (#f5f0e8) |
| Padding         | 8px                      |
| Border Radius   | 4px                      |
| Margin Vertical | 4px                      |
| Text            | `part.text`              |
| Font Style      | Italic                   |
| Font Size       | 12px                     |
| Color           | `muted-soft` (#8e8b82)   |

---

### 8. Message Input Bar

| Property   | Value                          |
| ---------- | ------------------------------ |
| Background | `canvas` (#faf9f5)             |
| Border Top | 1px `hairline` (#e6dfd8)       |
| Padding    | 12px vertical, 16px horizontal |
| Layout     | Row (input + send button)      |
| Gap        | 8px                            |
| Alignment  | Bottom (items-end)             |

#### Text Input

| Property          | Value                          |
| ----------------- | ------------------------------ |
| Placeholder       | `Type a message...`            |
| Placeholder Color | `muted-soft` (#8e8b82)         |
| Font              | `font-sans` (Inter)            |
| Size              | `body-md` — 16px               |
| Weight            | 400                            |
| Color             | `ink` (#141413)                |
| Background        | `surface-soft` (#f5f0e8)       |
| Border            | 1px `hairline` (#e6dfd8)       |
| Border Radius     | `radius-xl` — 16px             |
| Padding           | 12px vertical, 16px horizontal |
| Min Height        | 44px                           |
| Max Height        | 132px                          |
| Multiline         | true                           |
| Max Length        | 10000 characters               |
| Flex              | 1 (fills available space)      |

#### Send Button

| Property              | Value                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| Size                  | 44px × 44px                                                               |
| Border Radius         | `radius-full` (50%)                                                       |
| Background (active)   | `primary` (#cc785c)                                                       |
| Background (inactive) | `hairline` (#e6dfd8)                                                      |
| Icon                  | Send arrow (CSS triangle: `border-b-[6px] border-l-[8px] border-t-[6px]`) |
| Icon Color            | `on-primary` (#ffffff)                                                    |
| Active Opacity        | 0.7                                                                       |

#### Send Button — Sending State

| Property      | Value               |
| ------------- | ------------------- |
| Component     | `ActivityIndicator` |
| Spinner Size  | Small               |
| Spinner Color | `#FFFFFF`           |

#### Send Button — Inactive State

| Property   | Value                |
| ---------- | -------------------- |
| Background | `hairline` (#e6dfd8) |
| Disabled   | true                 |
| Opacity    | Reduced              |

---

## Empty State (when no messages)

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Icon       | `💬` (40px)                        |
| Title      | `No messages yet`                  |
| Subtitle   | `Send a message to start chatting` |
| Background | `canvas`                           |
| Layout     | Centered vertically + horizontally |

---

## Loading State

| Property      | Value                 |
| ------------- | --------------------- |
| Component     | `LoadingScreen`       |
| Message       | `Loading messages...` |
| Spinner Color | `primary` (#cc785c)   |
| Background    | `canvas`              |

---

## Error State

| Property      | Value                 |
| ------------- | --------------------- |
| Component     | `ErrorView`           |
| Icon          | `⚠️` (40px)           |
| Message       | Dynamic error message |
| Message Color | `body` (#3d3d3a)      |
| Background    | `canvas`              |

---

## SSE Streaming Behavior

| Property        | Value                                         |
| --------------- | --------------------------------------------- |
| Protocol        | Server-Sent Events (SSE)                      |
| Stream Endpoint | `/session/{sessionId}/log`                    |
| Event Format    | JSON with `id`, `parts`, `role`, `time`       |
| Merge Strategy  | Streaming messages merge into fetched history |
| Sort Order      | By `time.created` ascending                   |

---

## Navigation

| Action                  | Target                                    |
| ----------------------- | ----------------------------------------- |
| Tap back button         | `router.back()` — return to sessions list |
| Long press user message | Delete confirmation dialog                |
