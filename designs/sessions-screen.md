# Sessions Screen — Design Tokens

> Displays the list of sessions for a selected project, with a FAB to create new sessions.

---

## Screen Overview

| Property   | Value                                          |
| ---------- | ---------------------------------------------- |
| Route      | `(tabs)/projects/[projectId]/sessions/`        |
| Header     | Shown — "Sessions" title                       |
| Background | `canvas` (#faf9f5)                             |
| Layout     | Stack (header + scrollable list + FAB + modal) |
| Safe Area  | Top (status bar)                               |

---

## Layout Structure

```
┌─────────────────────────────┐
│  ← Sessions                 │  ← Navigation Header
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ Session Card 1        │  │
│  │ Session Title         │  │
│  │ 2h ago                │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ Session Card 2        │  │
│  │ Untitled              │  │
│  │ 5m ago                │  │
│  └───────────────────────┘  │
│                             │
│         ...                 │
│                             │
│                      [+]   │  ← FAB (Floating Action Button)
│                             │
├─────────────────────────────┤
│  [Projects]  [Settings]     │  ← Tab Bar
└─────────────────────────────┘
```

---

## Elements

### 1. Navigation Header

| Property     | Value              |
| ------------ | ------------------ |
| Title        | `Sessions`         |
| Background   | `canvas` (#faf9f5) |
| Title Color  | `ink` (#141413)    |
| Title Font   | Inter              |
| Title Size   | 18px               |
| Title Weight | 500                |
| Shadow       | None               |
| Tint Color   | `ink` (#141413)    |
| Height       | ~44px              |

### 2. Session Card

Each session is rendered as a `SessionCard` component.

| Property       | Value                    |
| -------------- | ------------------------ |
| Background     | `surface-card` (#efe9de) |
| Border         | 1px `hairline` (#e6dfd8) |
| Border Radius  | `radius-lg` — 12px       |
| Padding        | 16px                     |
| Width          | 100% of container        |
| Active Opacity | 0.7                      |

#### Session Title (inside card)

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| Text            | `session.title` or `Untitled` if empty |
| Font            | `font-sans` (Inter)                    |
| Size            | `body-md` — 16px                       |
| Weight          | 600 (semibold)                         |
| Color           | `ink` (#141413)                        |
| Number of Lines | 1 (truncated with ellipsis)            |
| Margin Bottom   | 4px                                    |

#### Session Timestamp (inside card)

| Property   | Value                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| Text       | Relative time (e.g., `Just now`, `5m ago`, `2h ago`, `3d ago`, or date) |
| Font       | `font-sans` (Inter)                                                     |
| Size       | `caption-upper` — 12px                                                  |
| Weight     | 500                                                                     |
| Color      | `muted-soft` (#8e8b82)                                                  |
| Margin Top | 4px                                                                     |

#### Long Press Behavior

| Property       | Value                                  |
| -------------- | -------------------------------------- |
| Trigger        | Long press on session card             |
| Action         | Show `Alert.alert` confirmation dialog |
| Dialog Title   | `Delete Session`                       |
| Dialog Message | `Delete "{session.title                |     | 'Untitled'}"?` |
| Cancel Button  | `Cancel` (style: cancel)               |
| Delete Button  | `Delete` (style: destructive)          |

### 3. Floating Action Button (FAB)

| Property       | Value                               |
| -------------- | ----------------------------------- |
| Text           | `+`                                 |
| Font Size      | 24px (text-2xl)                     |
| Font Weight    | 700 (bold)                          |
| Color          | `on-primary` (#ffffff)              |
| Background     | `primary` (#cc785c)                 |
| Size           | 56px × 56px (h-14 w-14)             |
| Border Radius  | `radius-full` (50%)                 |
| Position       | Bottom-right corner                 |
| Bottom Offset  | 24px (bottom-6)                     |
| Right Offset   | 24px (right-6)                      |
| Shadow         | `shadow-lg` (platform large shadow) |
| Active Opacity | 0.8                                 |
| Alignment      | Center (content centered)           |

### 4. New Session Modal (Bottom Sheet)

Triggered by FAB press.

#### Modal Overlay

| Property   | Value                          |
| ---------- | ------------------------------ |
| Background | `black/50` (50% opacity black) |
| Animation  | Slide up from bottom           |
| Dismiss    | Tap overlay or Cancel button   |

#### Modal Content Container

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Background    | `canvas` (#faf9f5)                        |
| Border Radius | Top corners only — 16px (`rounded-t-2xl`) |
| Padding       | 24px horizontal, 24px top, 32px bottom    |
| Position      | Bottom of screen                          |
| Width         | 100%                                      |

#### Modal Title

| Property      | Value               |
| ------------- | ------------------- |
| Text          | `New Session`       |
| Font          | `font-sans` (Inter) |
| Size          | `title-lg` — 22px   |
| Weight        | 600 (semibold)      |
| Color         | `ink` (#141413)     |
| Margin Bottom | 16px                |

#### Session Title Input (in modal)

| Property          | Value                          |
| ----------------- | ------------------------------ |
| Placeholder       | `Session title (optional)`     |
| Placeholder Color | `muted-soft` (#8e8b82)         |
| Font              | `font-sans` (Inter)            |
| Size              | `body-md` — 16px               |
| Weight            | 400                            |
| Color             | `ink` (#141413)                |
| Background        | `canvas` (#faf9f5)             |
| Border            | 1px `hairline` (#e6dfd8)       |
| Border Radius     | `radius-lg` — 12px             |
| Padding           | 12px vertical, 16px horizontal |
| Height            | 48px (auto)                    |
| Auto Focus        | true                           |

#### Validation Error (in modal)

| Property   | Value                       |
| ---------- | --------------------------- |
| Text       | Dynamic from Zod validation |
| Color      | `error` (#c64545)           |
| Size       | `body-sm` — 14px            |
| Margin Top | 4px                         |

#### Modal Button Row

| Property   | Value                       |
| ---------- | --------------------------- |
| Layout     | Row, 2 buttons side by side |
| Gap        | 12px                        |
| Margin Top | 24px                        |

#### Cancel Button (in modal)

| Property      | Value                    |
| ------------- | ------------------------ |
| Text          | `Cancel`                 |
| Font          | `font-sans` (Inter)      |
| Size          | `body-md` — 16px         |
| Weight        | 500 (medium)             |
| Color         | `body` (#3d3d3a)         |
| Background    | transparent              |
| Border        | 1px `hairline` (#e6dfd8) |
| Border Radius | `radius-lg` — 12px       |
| Padding       | 12px vertical            |
| Width         | 50% (flex-1)             |
| Alignment     | Center                   |

#### Start Button (in modal)

| Property       | Value                  |
| -------------- | ---------------------- |
| Text           | `Start`                |
| Font           | `font-sans` (Inter)    |
| Size           | `body-md` — 16px       |
| Weight         | 600 (semibold)         |
| Color          | `on-primary` (#ffffff) |
| Background     | `primary` (#cc785c)    |
| Border Radius  | `radius-lg` — 12px     |
| Padding        | 12px vertical          |
| Width          | 50% (flex-1)           |
| Alignment      | Center                 |
| Active Opacity | 0.7                    |

---

## Empty State (when no sessions)

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Icon       | `💬` (40px)                        |
| Title      | `No sessions yet`                  |
| Subtitle   | `Tap + to start a new session`     |
| Background | `canvas`                           |
| Layout     | Centered vertically + horizontally |

---

## Navigation

| Action                  | Target                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| Tap session card        | Push to `/(tabs)/projects/{projectId}/sessions/{sessionId}/chat` |
| Tap FAB                 | Open New Session modal                                           |
| Tap Cancel (modal)      | Close modal                                                      |
| Tap Start (modal)       | Navigate to chat with optional title param                       |
| Long press session card | Delete confirmation dialog                                       |
