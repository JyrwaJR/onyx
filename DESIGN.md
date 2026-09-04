---
name: Onyx
colors:
  surface: '#fcf9f6'
  surface-dim: '#dcd9d7'
  surface-bright: '#fcf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f1'
  surface-container: '#f0edeb'
  surface-container-high: '#ebe8e5'
  surface-container-highest: '#e5e2e0'
  on-surface: '#1c1c1a'
  on-surface-variant: '#54433e'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f3f0ee'
  outline: '#87736d'
  outline-variant: '#dac1ba'
  surface-tint: '#924a31'
  primary: '#8f482f'
  on-primary: '#ffffff'
  primary-container: '#ad5f45'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59d'
  secondary: '#605e58'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2da'
  on-secondary-container: '#66645e'
  tertiary: '#5e5c54'
  on-tertiary: '#ffffff'
  tertiary-container: '#77746c'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#75331c'
  secondary-fixed: '#e6e2da'
  secondary-fixed-dim: '#cac6bf'
  on-secondary-fixed: '#1c1c17'
  on-secondary-fixed-variant: '#484741'
  tertiary-fixed: '#e7e2d8'
  tertiary-fixed-dim: '#cac6bc'
  on-tertiary-fixed: '#1d1c15'
  on-tertiary-fixed-variant: '#49473f'
  background: '#fcf9f6'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2e0'
typography:
  headline-display:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  code:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system centers on a "Digital Paper" aesthetic—a sophisticated, editorial-inspired environment for interacting with local AI. It prioritizes focus, legibility, and a sense of calm reliability.

The style is **Minimalist** with a focus on high-quality typography and a deliberate lack of artificial depth. By eschewing shadows and gradients, the UI relies on a strict spatial hierarchy and subtle tonal shifts to define boundaries. The emotional response should be one of "quiet intelligence"—a tool that feels more like a well-crafted notebook than a complex software application.

## Colors

The palette is rooted in organic, warm neutrals to reduce eye strain during long AI interactions.

- **Background (#faf9f5):** A warm cream that serves as the canvas for all interactions.
- **Primary / Accent (#cc785c):** A muted coral used sparingly for call-to-actions, active states, and focus indicators.
- **Typography (#141413):** A deep charcoal (not pure black) to maintain a soft, ink-on-paper contrast.
- **Secondary / Muted (#6c6a64, #8e8b82):** Stone tones used for metadata, secondary labels, and inactive icons.
- **Border (#e6dfd8):** A light cream used for structural definition, keeping the interface feeling open and airy.

## Typography

This design system employs a pairing of a classical serif for expression and a functional sans-serif for utility.

- **Headlines:** Set in **EB Garamond**. To achieve a premium editorial feel, headlines use negative letter-spacing and tight line heights. This provides a "dense" visual weight that contrasts beautifully with the open background.
- **Body & UI:** Set in **Inter**. Inter handles all functional text, including AI responses and control labels. Its high x-height ensures clarity at small sizes.
- **Scale:** Maintain a generous vertical rhythm. Long-form AI responses should prioritize `body-lg` for maximum comfort.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for the central chat/interaction area to maintain focus, while utility sidebars are fluid.

- **Desktop:** A centered 800px content column is recommended for AI chat threads to prevent excessive line lengths.
- **Grid:** Use a 12-column grid for dashboard views with 24px gutters.
- **Rhythm:** Vertical spacing should be generous. Use `xl` (40px) or `xxl` (64px) to separate major sections, and `md` (16px) for internal component spacing.
- **Adaptation:** On mobile, margins reduce to 16px and the 12-column grid collapses to a single-column flow.

## Elevation & Depth

This design system uses a **Flat / Tonal Layering** approach. There are no shadows.

- **Level 0 (Base):** The Cream background (#faf9f5).
- **Level 1 (Containers):** Defined by a 1px border (#e6dfd8). Surfaces remain the same color as the background, or slightly lighter if necessary for contrast.
- **Depth through Isolation:** Instead of shadows, use wide margins and distinct border strokes to separate elements.
- **Active States:** Use the Coral accent (#cc785c) or a subtle shift in border weight (from 1px to 2px) to indicate focus or selection.

## Shapes

The shape language is "Soft Geometry."

A consistent **12px (0.75rem)** radius is applied to all interactive elements—buttons, input fields, and card containers. This specific radius softens the rigid grid without veering into a playful/bubbly aesthetic.

- **Small elements (Chips/Tags):** Use the standard 12px radius or a full pill shape for high contrast.
- **Containers:** Large sections or full-page modals maintain the same 12px radius to preserve a cohesive vocabulary.

## Components

- **Buttons:** Solid Coral (#cc785c) with White text for primary actions. Secondary buttons use a 1px Stone border (#6c6a64) with Charcoal text. All buttons use a 12px radius.
- **Input Fields:** 1px Light Cream border (#e6dfd8). Upon focus, the border transitions to Stone (#6c6a64) or Coral (#cc785c). No inner shadows.
- **Cards:** Defined by a 1px Light Cream border. Use a vertical stack: EB Garamond for titles, Inter for metadata and body.
- **Chips:** Small, 12px rounded containers with a #e6dfd8 background and #6c6a64 text. Used for model tags (e.g., "Llama 3", "GPT-4").
- **Lists:** Unstyled or minimal. Separate list items with a 1px horizontal rule in the border color (#e6dfd8) rather than using background blocks.
- **AI Response Bubbles:** Do not use "bubbles." Instead, use simple vertical dividers or distinct spacing to separate User and AI messages, keeping the editorial look intact.
