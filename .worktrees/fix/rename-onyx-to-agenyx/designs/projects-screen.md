# Projects Screen — Design Tokens

> Displays the list of connected projects from the OpenCode server.

---

## Screen Overview

| Property   | Value                            |
| ---------- | -------------------------------- |
| Route      | `(tabs)/projects/`               |
| Header     | Shown — "Projects" title         |
| Background | `canvas` (#faf9f5)               |
| Layout     | Stack (header + scrollable list) |
| Safe Area  | Top (status bar)                 |

---

## Layout Structure

```
┌─────────────────────────────┐
│  ← Projects                 │  ← Navigation Header
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ Project Card 1        │  │
│  │ /path/to/project      │  │
│  │ git repository        │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ Project Card 2        │  │
│  │ /path/to/project2     │  │
│  │ git repository        │  │
│  └───────────────────────┘  │
│                             │
│         ...                 │
│                             │
│  ┌───────────────────────┐  │
│  │ Empty State           │  │  ← When no projects
│  │ 📁 No projects yet    │  │
│  └───────────────────────┘  │
│                             │
├─────────────────────────────┤
│  [Projects]  [Settings]     │  ← Tab Bar
└─────────────────────────────┘
```

---

## Elements

### 1. Navigation Header

| Property     | Value                             |
| ------------ | --------------------------------- |
| Title        | `Projects`                        |
| Background   | `canvas` (#faf9f5)                |
| Title Color  | `ink` (#141413)                   |
| Title Font   | Inter                             |
| Title Size   | 18px                              |
| Title Weight | 500                               |
| Shadow       | None (headerShadowVisible: false) |
| Tint Color   | `ink` (#141413) — for back button |
| Height       | ~44px (platform default)          |

### 2. Project Card

Each project is rendered as a `ProjectCard` component.

| Property       | Value                               |
| -------------- | ----------------------------------- |
| Background     | `surface-card` (#efe9de)            |
| Border         | 1px `hairline` (#e6dfd8)            |
| Border Radius  | `radius-lg` — 12px                  |
| Padding        | 16px                                |
| Margin Bottom  | Gap between cards (handled by list) |
| Active Opacity | 0.7                                 |
| Width          | 100% of container                   |

#### Project Title (inside card)

| Property        | Value                                                    |
| --------------- | -------------------------------------------------------- |
| Text            | Last segment of `project.worktree` path (e.g., `my-app`) |
| Font            | `font-sans` (Inter)                                      |
| Size            | `body-md` — 16px                                         |
| Weight          | 600 (semibold)                                           |
| Color           | `ink` (#141413)                                          |
| Number of Lines | 1 (truncated with ellipsis)                              |
| Margin Bottom   | 4px                                                      |

#### Project Path (inside card)

| Property        | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| Text            | Full `project.worktree` path (e.g., `/Users/me/projects/my-app`) |
| Font            | `font-sans` (Inter)                                              |
| Size            | `body-sm` — 14px                                                 |
| Weight          | 400                                                              |
| Color           | `muted` (#6c6a64)                                                |
| Number of Lines | 1 (truncated with ellipsis)                                      |
| Margin Top      | 4px                                                              |

#### VCS Badge (inside card, conditional)

| Property   | Value                                       |
| ---------- | ------------------------------------------- |
| Text       | `{vcs} repository` (e.g., `git repository`) |
| Font       | `font-sans` (Inter)                         |
| Size       | `caption-upper` — 12px                      |
| Weight     | 500                                         |
| Color      | `muted-soft` (#8e8b82)                      |
| Margin Top | 8px                                         |
| Display    | Only shown when `project.vcs` exists        |

### 3. Empty State (when no projects)

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| Icon           | `📁` (40px)                           |
| Title          | `No projects yet`                     |
| Subtitle       | `Connect to a server to see projects` |
| Background     | `canvas`                              |
| Layout         | Centered vertically + horizontally    |
| Title Color    | `ink`                                 |
| Title Size     | 18px / 500 weight                     |
| Subtitle Color | `muted`                               |
| Subtitle Size  | 14px / 400 weight                     |

### 4. Loading State

| Property      | Value               |
| ------------- | ------------------- |
| Component     | `ActivityIndicator` |
| Spinner Color | `primary` (#cc785c) |
| Spinner Size  | Large               |
| Background    | `canvas`            |
| Layout        | Centered            |

---

## List Behavior

| Property                        | Value                      |
| ------------------------------- | -------------------------- |
| Type                            | `FlatList` or `ScrollView` |
| Content Padding                 | 16px horizontal            |
| Shows Vertical Scroll Indicator | Default                    |
| Keyboard Dismiss Mode           | On drag                    |

---

## Navigation

| Action             | Target                                          |
| ------------------ | ----------------------------------------------- |
| Tap project card   | Push to `/(tabs)/projects/{projectId}/sessions` |
| Tab bar "Projects" | Already on this screen                          |
| Tab bar "Settings" | Switch to Settings tab                          |
