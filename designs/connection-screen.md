# Connection Screen — Design Tokens

> Initial screen for connecting to a local AI agent. First screen the user sees.

---

## Screen Overview

| Property   | Value                              |
| ---------- | ---------------------------------- |
| Route      | `(connection)/`                    |
| Header     | Hidden (no navigation header)      |
| Background | `canvas` (#faf9f5)                 |
| Layout     | Centered vertically + horizontally |
| Safe Area  | Full (top + bottom)                |

---

## Layout Structure

```
┌─────────────────────────────┐
│         Safe Area           │
│                             │
│                             │
│       ┌─────────────┐       │
│       │    "Onyx"    │       │  ← App title
│       │  subtitle    │       │  ← Tagline
│       │              │       │
│       │  [  Input  ] │       │  ← Server URL input
│       │  [ Connect ] │       │  ← Primary CTA
│       │              │       │
│       │ Quick connect│       │  ← Section label
│       │ [suggestion] │       │  ← Quick connect chip
│       └─────────────┘       │
│                             │
│         Safe Area           │
└─────────────────────────────┘
```

---

## Elements

### 1. App Title

| Property       | Value                                                  |
| -------------- | ------------------------------------------------------ |
| Text           | `Onyx`                                                 |
| Font           | `font-display` (Tiempos Headline / Cormorant Garamond) |
| Size           | `display-md` — 36px                                    |
| Weight         | 400                                                    |
| Line Height    | 1.15                                                   |
| Letter Spacing | -0.5px                                                 |
| Color          | `ink` (#141413)                                        |
| Alignment      | Center                                                 |
| Margin Bottom  | 8px                                                    |

### 2. Subtitle / Tagline

| Property      | Value                            |
| ------------- | -------------------------------- |
| Text          | `Connect to your local AI agent` |
| Font          | `font-sans` (Inter)              |
| Size          | `body-md` — 16px                 |
| Weight        | 400                              |
| Line Height   | 1.55                             |
| Color         | `muted` (#6c6a64)                |
| Alignment     | Center                           |
| Margin Top    | 8px                              |
| Margin Bottom | 40px                             |

### 3. Server URL Input

| Property          | Value                          |
| ----------------- | ------------------------------ |
| Placeholder       | `http://localhost:3000`        |
| Placeholder Color | `muted-soft` (#8e8b82)         |
| Font              | `font-sans` (Inter)            |
| Size              | `body-md` — 16px               |
| Weight            | 400                            |
| Color             | `ink` (#141413)                |
| Background        | `canvas` (#faf9f5)             |
| Border            | 1px `hairline` (#e6dfd8)       |
| Border Radius     | `radius-lg` — 12px             |
| Padding           | 12px horizontal, 12px vertical |
| Height            | 48px (auto)                    |
| Width             | 100% of container (max ~320px) |
| Keyboard Type     | URL                            |
| Auto Capitalize   | none                           |
| Auto Correct      | false                          |

#### Input Focus State

| Property     | Value                        |
| ------------ | ---------------------------- |
| Border Color | `primary` (#cc785c)          |
| Ring         | 2px `primary` at 15% opacity |

#### Input Error State

| Property         | Value             |
| ---------------- | ----------------- |
| Error Text Color | `error` (#c64545) |
| Error Text Size  | `body-sm` — 14px  |
| Error Margin Top | 8px               |

### 4. Connect Button (Primary CTA)

| Property      | Value                          |
| ------------- | ------------------------------ |
| Text          | `Connect`                      |
| Font          | `font-sans` (Inter)            |
| Size          | `body-md` — 16px               |
| Weight        | 600 (semibold)                 |
| Color         | `on-primary` (#ffffff)         |
| Background    | `primary` (#cc785c)            |
| Border Radius | `radius-lg` — 12px             |
| Padding       | 12px vertical, 24px horizontal |
| Height        | 48px                           |
| Width         | 100% of container              |
| Margin Top    | 16px                           |
| Alignment     | Center                         |

#### Disabled State

| Property   | Value                                        |
| ---------- | -------------------------------------------- |
| Background | `hairline` (#e6dfd8)                         |
| Color      | `on-primary` (still white, but low contrast) |
| Opacity    | Reduced visual weight                        |

#### Active/Pressed State

| Property   | Value                      |
| ---------- | -------------------------- |
| Background | `primary-active` (#a9583e) |

### 5. Quick Connect Section

#### Section Label

| Property      | Value                  |
| ------------- | ---------------------- |
| Text          | `Quick connect`        |
| Font          | `font-sans` (Inter)    |
| Size          | `body-sm` — 14px       |
| Weight        | 400                    |
| Color         | `muted-soft` (#8e8b82) |
| Alignment     | Center                 |
| Margin Top    | 32px                   |
| Margin Bottom | 8px                    |

#### Quick Connect Chip / Suggestion Button

| Property       | Value                          |
| -------------- | ------------------------------ |
| Text           | `http://localhost:4096`        |
| Font           | `font-sans` (Inter)            |
| Size           | `body-sm` — 14px               |
| Weight         | 400                            |
| Color          | `body` (#3d3d3a)               |
| Background     | `surface-soft` (#f5f0e8)       |
| Border         | 1px `hairline` (#e6dfd8)       |
| Border Radius  | `radius-lg` — 12px             |
| Padding        | 12px vertical, 16px horizontal |
| Width          | 100% of container              |
| Margin Top     | 8px                            |
| Alignment      | Center                         |
| Active Opacity | 0.7                            |

---

## Error State (Connection Failed)

When `connectionStatus === 'error'`, the screen shows an error view:

### Error Emoji

| Property  | Value           |
| --------- | --------------- |
| Text      | `⚠️`            |
| Size      | 40px (text-4xl) |
| Alignment | Center          |

### Error Message

| Property   | Value                            |
| ---------- | -------------------------------- |
| Text       | Dynamic error message from store |
| Font       | `font-sans` (Inter)              |
| Size       | `body-md` — 16px                 |
| Weight     | 400                              |
| Color      | `body` (#3d3d3a)                 |
| Alignment  | Center                           |
| Margin Top | 16px                             |

### Try Again Button

| Property      | Value                          |
| ------------- | ------------------------------ |
| Text          | `Try Again`                    |
| Font          | `font-sans` (Inter)            |
| Size          | `body-md` — 16px               |
| Weight        | 600 (semibold)                 |
| Color         | `on-primary` (#ffffff)         |
| Background    | `primary` (#cc785c)            |
| Border Radius | `radius-lg` — 12px             |
| Padding       | 12px vertical, 24px horizontal |
| Margin Top    | 24px                           |

---

## Loading State

When `connectionStatus === 'connecting'` or `!hydrated`:

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Component     | `LoadingScreen`                           |
| Spinner Color | `primary` (#cc785c)                       |
| Spinner Size  | Large                                     |
| Message       | `Loading...` or `Connecting to server...` |
| Message Font  | `body-md` — 16px                          |
| Message Color | `muted` (#6c6a64)                         |
| Background    | `canvas` (#faf9f5)                        |
| Layout        | Centered vertically + horizontally        |

---

## Container

| Property           | Value                   |
| ------------------ | ----------------------- |
| Width              | 100%                    |
| Max Width          | ~320px (max-w-sm)       |
| Horizontal Padding | 24px (px-6)             |
| Alignment          | Center (items-center)   |
| Vertical Layout    | Center (justify-center) |

---

## Transitions

| Element          | Transition | Duration |
| ---------------- | ---------- | -------- |
| Screen → Error   | Instant    | 0ms      |
| Screen → Loading | Instant    | 0ms      |
| Button press     | Opacity    | 100ms    |
