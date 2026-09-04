# Tab Bar — Design Tokens

> Bottom tab navigation bar shared across all tab screens.

---

## Overview

| Property  | Value                  |
| --------- | ---------------------- |
| Component | Expo Router `Tabs`     |
| Tabs      | 2: Projects, Settings  |
| Position  | Bottom of screen       |
| Visible   | On all `(tabs)` routes |

---

## Layout Structure

```
┌─────────────────────────────┐
│                             │
│        Screen Content       │
│                             │
├─────────────────────────────┤
│  [Projects]  [Settings]     │  ← Tab Bar
└─────────────────────────────┘
```

---

## Tab Bar Container

| Property   | Value                                       |
| ---------- | ------------------------------------------- |
| Background | `canvas` (#faf9f5)                          |
| Border Top | 1px `hairline` (#e6dfd8)                    |
| Height     | Platform default (~49px iOS, ~56px Android) |
| Padding    | Platform default                            |
| Layout     | Row, evenly spaced                          |

---

## Tab Items

### Active Tab

| Property     | Value               |
| ------------ | ------------------- |
| Icon Color   | `primary` (#cc785c) |
| Label Color  | `primary` (#cc785c) |
| Label Font   | Inter               |
| Label Size   | `nav-link` — 14px   |
| Label Weight | 500                 |

### Inactive Tab

| Property     | Value             |
| ------------ | ----------------- |
| Icon Color   | `muted` (#6c6a64) |
| Label Color  | `muted` (#6c6a64) |
| Label Font   | Inter             |
| Label Size   | `nav-link` — 14px |
| Label Weight | 500               |

---

## Tab Definitions

### Projects Tab

| Property       | Value                            |
| -------------- | -------------------------------- |
| Label          | `Projects`                       |
| Icon Component | `TabBarIcon`                     |
| Icon Display   | Letter `P`                       |
| Icon Size      | 24px                             |
| Route          | `/(tabs)/projects`               |
| Header         | Hidden (handled by nested Stack) |

### Settings Tab

| Property       | Value                            |
| -------------- | -------------------------------- |
| Label          | `Settings`                       |
| Icon Component | `TabBarIcon`                     |
| Icon Display   | Letter `S`                       |
| Icon Size      | 24px                             |
| Route          | `/(tabs)/settings`               |
| Header         | Hidden (handled by nested Stack) |

---

## Header Style (Applied to all tab screens)

| Property                 | Value                             |
| ------------------------ | --------------------------------- |
| Background               | `canvas` (#faf9f5)                |
| Tint Color (back button) | `ink` (#141413)                   |
| Title Color              | `ink` (#141413)                   |
| Title Font               | Inter                             |
| Title Size               | 18px                              |
| Title Weight             | 500                               |
| Shadow                   | None (headerShadowVisible: false) |

---

## Tab Bar Icon Component

The `TabBarIcon` component renders a letter-based icon:

| Property | Value                                 |
| -------- | ------------------------------------- |
| Type     | Letter-based (not glyph/icon library) |
| Size     | 24px (passed as prop)                 |
| Color    | Passed from tab bar (active/inactive) |
| Label    | Single letter (`P` or `S`)            |

> **Design Note:** Consider replacing letter icons with proper icon glyphs (e.g., folder for Projects, gear for Settings) for better visual clarity.

---

## Navigation Behavior

| Action           | Behavior                                                 |
| ---------------- | -------------------------------------------------------- |
| Tap Projects tab | Switch to Projects tab (or go to root of Projects stack) |
| Tap Settings tab | Switch to Settings tab                                   |
| Active tab tap   | No action (already on screen)                            |

---

## Redirect Logic

| Condition          | Behavior                     |
| ------------------ | ---------------------------- |
| `!hydrated`        | Returns null (no tabs shown) |
| `!serverUrl`       | Redirects to `/(connection)` |
| `serverUrl` exists | Shows tabs normally          |
