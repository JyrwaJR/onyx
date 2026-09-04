# Onyx App — Design Tokens for Google Stitch

> Comprehensive design token documentation for every screen in the Onyx app.
> Use these tokens when designing screens in Google Stitch.

---

## Design System

**App:** Onyx — Local AI Agent Client
**Framework:** Expo / React Native
**Design Language:** Anthropic Claude (Cream + Coral + Dark Navy)

---

## Token Files

| File                                           | Screen     | Description                                      |
| ---------------------------------------------- | ---------- | ------------------------------------------------ |
| [global-tokens.md](./global-tokens.md)         | All        | Shared colors, typography, spacing, components   |
| [connection-screen.md](./connection-screen.md) | Connection | Server URL input, connect button, quick connect  |
| [projects-screen.md](./projects-screen.md)     | Projects   | Project list with cards                          |
| [sessions-screen.md](./sessions-screen.md)     | Sessions   | Session list, FAB, new session modal             |
| [chat-screen.md](./chat-screen.md)             | Chat       | Message bubbles, input bar, markdown, tool calls |
| [settings-screen.md](./settings-screen.md)     | Settings   | Server info, disconnect button, version          |
| [loading-screen.md](./loading-screen.md)       | Loading    | Full-screen spinner (shared component)           |
| [error-screen.md](./error-screen.md)           | Error      | Error display with retry (shared component)      |
| [tab-bar.md](./tab-bar.md)                     | Tab Bar    | Bottom navigation with Projects + Settings       |

---

## Screen Map

```
App Entry
├── (connection)/
│   └── Connection Screen ─── server URL input + connect
│
└── (tabs)/
    ├── projects/
    │   ├── Projects Screen ─── project list
    │   └── [projectId]/sessions/
    │       ├── Sessions Screen ─── session list + FAB
    │       └── [sessionId]/
    │           └── Chat Screen ─── real-time chat
    │
    └── settings/
        └── Settings Screen ─── server info + disconnect
```

---

## Quick Reference — Colors

| Token          | Hex       | Where Used                                       |
| -------------- | --------- | ------------------------------------------------ |
| `primary`      | `#cc785c` | CTAs, FAB, active tab, user bubbles, send button |
| `canvas`       | `#faf9f5` | Page backgrounds (warm cream)                    |
| `surface-card` | `#efe9de` | Card backgrounds, AI message bubbles             |
| `surface-dark` | `#181715` | Dark surfaces                                    |
| `ink`          | `#141413` | Headlines, primary text                          |
| `body`         | `#3d3d3a` | Body text                                        |
| `muted`        | `#6c6a64` | Secondary text, labels                           |
| `muted-soft`   | `#8e8b82` | Captions, timestamps, placeholders               |
| `error`        | `#c64545` | Error states, validation                         |
| `hairline`     | `#e6dfd8` | Borders, dividers                                |

---

## Quick Reference — Typography

| Token           | Size | Weight | Use                |
| --------------- | ---- | ------ | ------------------ |
| `display-md`    | 36px | 400    | App name "Onyx"    |
| `title-lg`      | 22px | 500    | Modal titles       |
| `title-md`      | 18px | 500    | Header titles      |
| `title-sm`      | 16px | 500    | Card titles        |
| `body-md`       | 16px | 400    | Body text, inputs  |
| `body-sm`       | 14px | 400    | Secondary text     |
| `caption`       | 13px | 500    | Badges             |
| `caption-upper` | 12px | 500    | Timestamps, tags   |
| `button`        | 14px | 500    | Button labels      |
| `code`          | 14px | 400    | Code blocks (mono) |

---

## Quick Reference — Spacing

| Token     | Value |
| --------- | ----- |
| `xxs`     | 4px   |
| `xs`      | 8px   |
| `sm`      | 12px  |
| `md`      | 16px  |
| `lg`      | 24px  |
| `xl`      | 32px  |
| `xxl`     | 48px  |
| `section` | 96px  |

---

## Google Stitch Usage

1. Open Google Stitch
2. Create a new project for "Onyx"
3. Reference the `global-tokens.md` for shared values
4. Reference individual screen files for screen-specific tokens
5. Each screen file contains: layout structure, element properties, states, and navigation

---

## Design Notes

- **Warm cream canvas** (#faf9f5) is the brand differentiator — never use pure white
- **Coral primary** (#cc785c) is used sparingly on individual elements, generously on full-bleed surfaces
- **Border radius** is hierarchical: 8px buttons → 12px cards → 16px+ containers
- **No shadows** on most elements — depth comes from color contrast
- **Font split**: Serif display (Tiempos Headline) for brand, Sans (Inter) for UI
