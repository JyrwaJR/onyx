# Loading Screen — Design Tokens

> Full-screen centered loading spinner with optional message. Used as a shared component across all screens.

---

## Screen Overview

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Component  | `LoadingScreen`                    |
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
│           ◌                 │  ← Spinner (ActivityIndicator)
│                             │
│      Loading...             │  ← Message text
│                             │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

---

## Elements

### 1. Activity Indicator (Spinner)

| Property  | Value                       |
| --------- | --------------------------- |
| Component | `ActivityIndicator`         |
| Size      | `large`                     |
| Color     | `primary` (#cc785c)         |
| Animation | Rotating (platform default) |

### 2. Loading Message

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Text         | Dynamic — passed as `message` prop |
| Default Text | `Loading...`                       |
| Font         | `font-sans` (Inter)                |
| Size         | `body-md` — 16px                   |
| Weight       | 400                                |
| Color        | `muted` (#6c6a64)                  |
| Alignment    | Center                             |
| Margin Top   | 16px (below spinner)               |

---

## Usage Instances

| Screen                  | Message                   |
| ----------------------- | ------------------------- |
| Connection (hydrating)  | `Loading...`              |
| Connection (connecting) | `Connecting to server...` |
| Chat (loading messages) | `Loading messages...`     |
| Projects (loading)      | `Loading...`              |

---

## Container

| Property   | Value                          |
| ---------- | ------------------------------ |
| Background | `canvas` (#faf9f5)             |
| Layout     | Flex 1, centered both axes     |
| Padding    | 20px (for error text wrapping) |
