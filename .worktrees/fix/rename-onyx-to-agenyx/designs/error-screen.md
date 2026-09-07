# Error Screen — Design Tokens

> Full-screen error display with message and optional retry action. Used as a shared component.

---

## Screen Overview

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Component  | `ErrorView`                        |
| Background | `canvas` (#faf9f5)                 |
| Layout     | Centered vertically + horizontally |
| Safe Area  | Full                               |

---

## Layout Structure

```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│           ⚠️                │  ← Error emoji
│                             │
│   Failed to load messages.  │  ← Error message
│                             │
│      [  Retry  ]            │  ← Retry button (optional)
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

---

## Elements

### 1. Error Icon

| Property  | Value           |
| --------- | --------------- |
| Text      | `⚠️`            |
| Size      | 40px (text-4xl) |
| Alignment | Center          |

### 2. Error Message

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Text       | Dynamic — passed as `message` prop |
| Font       | `font-sans` (Inter)                |
| Size       | `body-md` — 16px                   |
| Weight     | 400                                |
| Color      | `body` (#3d3d3a)                   |
| Alignment  | Center                             |
| Margin Top | 16px                               |
| Max Width  | 80% (for text wrapping)            |

### 3. Retry Button (Optional)

Only shown when `onRetry` callback is provided.

| Property      | Value                          |
| ------------- | ------------------------------ |
| Text          | `Retry`                        |
| Font          | `font-sans` (Inter)            |
| Size          | `body-md` — 16px               |
| Weight        | 600 (semibold)                 |
| Color         | `on-primary` (#ffffff)         |
| Background    | `primary` (#cc785c)            |
| Border Radius | `radius-lg` — 12px             |
| Padding       | 12px vertical, 24px horizontal |
| Margin Top    | 24px                           |
| Alignment     | Center                         |

---

## Container

| Property           | Value                      |
| ------------------ | -------------------------- |
| Background         | `canvas` (#faf9f5)         |
| Layout             | Flex 1, centered both axes |
| Horizontal Padding | 24px (px-6)                |

---

## Usage Instances

| Screen            | Message               | Has Retry |
| ----------------- | --------------------- | --------- |
| Chat (load error) | Dynamic error message | No        |

---

## Navigation

| Action    | Target                                 |
| --------- | -------------------------------------- |
| Tap Retry | Calls `onRetry` callback (if provided) |
