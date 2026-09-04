# Global Design Tokens — Onyx App

> Shared design tokens used across all screens. Reference this file from individual screen token files.

---

## Brand Identity

| Property      | Value            | Usage                          |
| ------------- | ---------------- | ------------------------------ |
| App Name      | `Onyx`           | Displayed on Connection screen |
| App Version   | `v1.0.0`         | Displayed in Settings footer   |
| Design System | Anthropic Claude | Cream + Coral + Dark Navy      |

---

## Color Palette

### Brand & Accent

| Token              | Hex       | RGB             | HSL           | Usage                                                            |
| ------------------ | --------- | --------------- | ------------- | ---------------------------------------------------------------- |
| `primary`          | `#cc785c` | `204, 120, 92`  | `16 55% 58%`  | Primary CTAs, FAB, active tab, send button, user message bubbles |
| `primary-active`   | `#a9583e` | `169, 88, 62`   | `16 55% 48%`  | Pressed state for primary buttons                                |
| `primary-disabled` | `#e6dfd8` | `230, 223, 216` | `28 20% 88%`  | Disabled primary buttons                                         |
| `accent-teal`      | `#5db8a6` | `93, 184, 166`  | `162 40% 54%` | Status indicators, active connections                            |
| `accent-amber`     | `#e8a55a` | `232, 165, 90`  | `34 75% 63%`  | Category badges, inline highlights                               |

### Surface

| Token                   | Hex       | RGB             | HSL          | Usage                                                               |
| ----------------------- | --------- | --------------- | ------------ | ------------------------------------------------------------------- |
| `canvas`                | `#faf9f5` | `250, 249, 245` | `45 40% 97%` | Default page background (warm cream)                                |
| `surface-soft`          | `#f5f0e8` | `245, 240, 232` | `38 30% 94%` | Section dividers, soft bands, code block backgrounds in markdown    |
| `surface-card`          | `#efe9de` | `239, 233, 222` | `36 28% 91%` | Card backgrounds (project cards, session cards, AI message bubbles) |
| `surface-cream-strong`  | `#e8e0d2` | `232, 224, 210` | `36 26% 88%` | Selected category tabs, emphasized bands                            |
| `surface-dark`          | `#181715` | `24, 23, 21`    | `30 10% 9%`  | Dark surfaces, footer, dark cards                                   |
| `surface-dark-elevated` | `#252320` | `37, 35, 32`    | `28 8% 13%`  | Elevated elements inside dark surfaces                              |
| `surface-dark-soft`     | `#1f1e1b` | `31, 30, 27`    | `30 10% 11%` | Slightly lighter dark, code block backgrounds                       |
| `hairline`              | `#e6dfd8` | `230, 223, 216` | `28 20% 88%` | 1px borders, dividers                                               |
| `hairline-soft`         | `#ebe6df` | `235, 230, 223` | `30 18% 90%` | Barely-visible internal dividers                                    |

### Text

| Token          | Hex       | RGB             | HSL          | Usage                                              |
| -------------- | --------- | --------------- | ------------ | -------------------------------------------------- |
| `ink`          | `#141413` | `20, 20, 19`    | `60 6% 8%`   | Headlines, primary text, card titles               |
| `body-strong`  | `#252523` | `37, 37, 35`    | `60 6% 14%`  | Emphasized paragraphs, lead text, tool call titles |
| `body`         | `#3d3d3a` | `61, 61, 58`    | `60 5% 23%`  | Default running text, body copy                    |
| `muted`        | `#6c6a64` | `108, 106, 100` | `40 8% 42%`  | Sub-headings, breadcrumbs, form labels             |
| `muted-soft`   | `#8e8b82` | `142, 139, 130` | `40 7% 53%`  | Captions, timestamps, fine print, placeholders     |
| `on-primary`   | `#ffffff` | `255, 255, 255` | `0 0% 100%`  | Text on coral buttons, send arrow                  |
| `on-dark`      | `#faf9f5` | `250, 249, 245` | `45 40% 97%` | Text on dark surfaces                              |
| `on-dark-soft` | `#a09d96` | `160, 157, 150` | `30 6% 63%`  | Secondary text on dark surfaces                    |

### Semantic

| Token     | Hex       | Usage                                  |
| --------- | --------- | -------------------------------------- |
| `success` | `#5db872` | Success states, "available" indicators |
| `warning` | `#d4a017` | Warning callouts                       |
| `error`   | `#c64545` | Validation errors, error states        |

---

## Typography

### Font Families

| Token          | Fonts                                                                               | Usage                            |
| -------------- | ----------------------------------------------------------------------------------- | -------------------------------- |
| `font-display` | Tiempos Headline, Cormorant Garamond, EB Garamond, Garamond, Times New Roman, serif | Display headlines (app name)     |
| `font-sans`    | Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif              | Body text, UI labels, navigation |
| `font-mono`    | JetBrains Mono, SF Mono, Fira Code, Consolas, monospace                             | Code blocks, terminal text       |

### Type Scale

| Token           | Size             | Weight | Line Height | Letter Spacing | Font Family   | Usage                         |
| --------------- | ---------------- | ------ | ----------- | -------------- | ------------- | ----------------------------- |
| `display-md`    | 36px / 2.25rem   | 400    | 1.15        | -0.5px         | Display serif | App name "Onyx"               |
| `title-lg`      | 22px / 1.375rem  | 500    | 1.3         | 0              | Sans          | Section titles                |
| `title-md`      | 18px / 1.125rem  | 500    | 1.4         | 0              | Sans          | Card titles, header titles    |
| `title-sm`      | 16px / 1rem      | 500    | 1.4         | 0              | Sans          | List item titles              |
| `body-md`       | 16px / 1rem      | 400    | 1.55        | 0              | Sans          | Default body text, input text |
| `body-sm`       | 14px / 0.875rem  | 400    | 1.55        | 0              | Sans          | Secondary body, suggestions   |
| `caption`       | 13px / 0.8125rem | 500    | 1.4         | 0              | Sans          | Badge labels                  |
| `caption-upper` | 12px / 0.75rem   | 500    | 1.4         | 1.5px          | Sans          | Uppercase tags                |
| `button`        | 14px / 0.875rem  | 500    | 1.0         | 0              | Sans          | Button labels                 |
| `nav-link`      | 14px / 0.875rem  | 500    | 1.4         | 0              | Sans          | Tab labels, nav items         |
| `code`          | 14px / 0.875rem  | 400    | 1.6         | 0              | Mono          | Code blocks                   |

---

## Spacing

Base unit: **4px**

| Token             | Value | Usage                       |
| ----------------- | ----- | --------------------------- |
| `spacing-xxs`     | 4px   | Tight gaps, icon padding    |
| `spacing-xs`      | 8px   | Small gaps, inline spacing  |
| `spacing-sm`      | 12px  | Compact padding             |
| `spacing-md`      | 16px  | Standard padding, list gaps |
| `spacing-lg`      | 24px  | Card padding, section gaps  |
| `spacing-xl`      | 32px  | Large card padding          |
| `spacing-xxl`     | 48px  | Major section padding       |
| `spacing-section` | 96px  | Between major sections      |

---

## Border Radius

| Token         | Value  | Usage                                            |
| ------------- | ------ | ------------------------------------------------ |
| `radius-xs`   | 4px    | Badge accents, tiny elements                     |
| `radius-sm`   | 6px    | Small inline buttons                             |
| `radius-md`   | 8px    | Standard buttons, text inputs, code blocks       |
| `radius-lg`   | 12px   | Cards, modals                                    |
| `radius-xl`   | 16px   | Large containers, message bubbles (24px in chat) |
| `radius-pill` | 9999px | Badge pills, circular buttons, FAB               |
| `radius-full` | 50%    | Circular elements, avatars                       |

---

## Shadows

| Token           | Value                              | Usage                        |
| --------------- | ---------------------------------- | ---------------------------- |
| `shadow-subtle` | `0 1px 3px rgba(20, 20, 19, 0.08)` | Hover-elevated states (rare) |
| `shadow-lg`     | Platform default large shadow      | FAB on sessions screen       |
| `shadow-none`   | `none`                             | Default for most elements    |

---

## Layout

| Property                    | Value                        | Usage                       |
| --------------------------- | ---------------------------- | --------------------------- |
| Max content width           | 1200px                       | Web container max-width     |
| Screen padding (horizontal) | 24px (16px on small screens) | Standard horizontal padding |
| Safe area top               | Platform dependent           | Status bar + notch          |
| Safe area bottom            | Platform dependent           | Home indicator              |

---

## Breakpoints

| Name    | Width       | Changes                              |
| ------- | ----------- | ------------------------------------ |
| Mobile  | < 768px     | Single column, compact spacing       |
| Tablet  | 768–1024px  | 2-column layouts where applicable    |
| Desktop | 1024–1440px | Full layout                          |
| Wide    | > 1440px    | Same as desktop, more breathing room |

---

## Animations

| Token      | Keyframes                      | Duration | Easing   | Usage                              |
| ---------- | ------------------------------ | -------- | -------- | ---------------------------------- |
| `fade-in`  | opacity 0→1                    | 300ms    | ease-out | Screen transitions, element reveal |
| `slide-up` | translateY(8px)→0, opacity 0→1 | 300ms    | ease-out | Card entrance, list items          |

---

## Component Classes

### Buttons

| Class                   | Background                   | Text                 | Border         | Height   | Radius | Padding   |
| ----------------------- | ---------------------------- | -------------------- | -------------- | -------- | ------ | --------- |
| `btn-primary`           | `primary` (#cc785c)          | `on-primary` (white) | none           | 40px min | 8px    | 12px 20px |
| `btn-primary:active`    | `primary-active` (#a9583e)   | `on-primary`         | none           | 40px min | 8px    | 12px 20px |
| `btn-primary[disabled]` | `primary-disabled` (#e6dfd8) | `on-primary`         | none           | 40px min | 8px    | 12px 20px |
| `btn-secondary`         | `canvas`                     | `ink`                | 1px `hairline` | 40px min | 8px    | 12px 20px |
| `btn-secondary-on-dark` | `surface-dark-elevated`      | `on-dark`            | none           | 40px min | 8px    | 12px 20px |
| `btn-text`              | transparent                  | `primary`            | none           | auto     | 0      | 0         |
| `btn-icon-circular`     | `canvas`                     | `ink` icon           | 1px `hairline` | 36px     | 50%    | 0         |

### Cards

| Class                      | Background     | Border         | Radius | Padding |
| -------------------------- | -------------- | -------------- | ------ | ------- |
| `feature-card`             | `surface-card` | none           | 12px   | 32px    |
| `product-mockup-card-dark` | `surface-dark` | none           | 12px   | 32px    |
| `code-window-card`         | `surface-dark` | none           | 12px   | 24px    |
| `model-comparison-card`    | `canvas`       | 1px `hairline` | 12px   | 32px    |
| `pricing-tier-card`        | `canvas`       | 1px `hairline` | 12px   | 32px    |
| `callout-card-coral`       | `primary`      | none           | 12px   | 48px    |
| `connector-tile`           | `canvas`       | 1px `hairline` | 12px   | 20px    |

### Inputs

| Class              | Background | Text  | Border               | Height | Radius | Padding   |
| ------------------ | ---------- | ----- | -------------------- | ------ | ------ | --------- |
| `text-input`       | `canvas`   | `ink` | 1px `hairline`       | 40px   | 8px    | 10px 14px |
| `text-input:focus` | `canvas`   | `ink` | 1px `primary` + ring | 40px   | 8px    | 10px 14px |

### Badges

| Class         | Background     | Text         | Type          | Radius | Padding  |
| ------------- | -------------- | ------------ | ------------- | ------ | -------- |
| `badge-pill`  | `surface-card` | `ink`        | caption       | pill   | 4px 12px |
| `badge-coral` | `primary`      | `on-primary` | caption-upper | pill   | 4px 12px |

### Tabs

| Class                 | Background     | Text    | Radius | Padding  |
| --------------------- | -------------- | ------- | ------ | -------- |
| `category-tab`        | transparent    | `muted` | 8px    | 8px 14px |
| `category-tab-active` | `surface-card` | `ink`   | 8px    | 8px 14px |
