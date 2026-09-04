# Settings Screen — Design Tokens

> Displays server connection info and provides disconnect functionality.

---

## Screen Overview

| Property   | Value                                                       |
| ---------- | ----------------------------------------------------------- |
| Route      | `(tabs)/settings/`                                          |
| Header     | Shown — "Settings" title                                    |
| Background | `white` (#ffffff) ⚠️ Note: Currently uses white, not canvas |
| Layout     | Stack (header + content + footer)                           |
| Safe Area  | Top (status bar)                                            |

> **Design Note:** The Settings screen currently uses `bg-white` instead of `bg-canvas` (#faf9f5). This is inconsistent with the rest of the app. Consider updating to `bg-canvas` for consistency.

---

## Layout Structure

```
┌─────────────────────────────┐
│  ← Settings                 │  ← Navigation Header
├─────────────────────────────┤
│                             │
│  Server URL                 │  ← Label
│  http://localhost:4096      │  ← Value
│                             │
│  ┌───────────────────────┐  │
│  │     Disconnect        │  │  ← Destructive button
│  └───────────────────────┘  │
│                             │
│                             │
│                             │
│                             │
│                             │
│     Onyx v1.0.0             │  ← Version footer
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
| Title        | `Settings`         |
| Background   | Default (platform) |
| Title Color  | `ink` (#141413)    |
| Title Font   | Inter              |
| Title Size   | 18px               |
| Title Weight | 500                |
| Shadow       | Default            |

### 2. Server URL Section

#### Label

| Property      | Value               |
| ------------- | ------------------- |
| Text          | `Server URL`        |
| Font          | `font-sans` (Inter) |
| Size          | `body-sm` — 14px    |
| Weight        | 500 (medium)        |
| Color         | `muted` (#6c6a64)   |
| Margin Bottom | 32px (mb-8)         |

#### Value

| Property   | Value                                     |
| ---------- | ----------------------------------------- |
| Text       | `serverUrl` from store or `Not connected` |
| Font       | `font-sans` (Inter)                       |
| Size       | `body-md` — 16px                          |
| Weight     | 400                                       |
| Color      | `ink` (gray-900 equivalent)               |
| Margin Top | 4px                                       |

### 3. Disconnect Button

| Property      | Value                                          |
| ------------- | ---------------------------------------------- |
| Text          | `Disconnect`                                   |
| Font          | `font-sans` (Inter)                            |
| Size          | `body-md` — 16px                               |
| Weight        | 500 (medium)                                   |
| Color         | `error` variant (#dc2626 / red-600)            |
| Background    | `error` variant bg (#fef2f2 / red-50)          |
| Border        | 1px `error` variant border (#fecaca / red-200) |
| Border Radius | `radius-lg` — 12px                             |
| Padding       | 12px vertical, 16px horizontal                 |
| Width         | 100%                                           |
| Alignment     | Center                                         |
| Margin Top    | 0 (below server URL section)                   |

> **Design Note:** This button uses red/warning colors instead of the Claude design system tokens. Consider aligning with `error` (#c64545) for consistency.

### 4. Version Footer

| Property       | Value                             |
| -------------- | --------------------------------- |
| Text           | `Onyx v1.0.0`                     |
| Font           | `font-sans` (Inter)               |
| Size           | `caption-upper` — 12px            |
| Weight         | 400                               |
| Color          | `muted-soft` (#9ca3af / gray-400) |
| Alignment      | Center                            |
| Position       | Bottom of screen (mt-auto)        |
| Bottom Padding | 24px (pb-6)                       |

---

## Container

| Property           | Value                 |
| ------------------ | --------------------- |
| Padding Top        | 24px (pt-6)           |
| Padding Horizontal | 24px (px-6)           |
| Layout             | Column                |
| Height             | Flex 1 (fills screen) |

---

## States

### Connected State

| Property          | Value                |
| ----------------- | -------------------- |
| Server URL        | Displayed from store |
| Disconnect Button | Enabled, visible     |

### Not Connected State

| Property          | Value                     |
| ----------------- | ------------------------- |
| Server URL        | `Not connected`           |
| Disconnect Button | Still visible (defensive) |

---

## Navigation

| Action             | Target                                           |
| ------------------ | ------------------------------------------------ |
| Tap Disconnect     | Call `disconnect()`, navigate to `/(connection)` |
| Tab bar "Projects" | Switch to Projects tab                           |
| Tab bar "Settings" | Already on this screen                           |
