/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════════════
      // Colors — Onyx Design System (DESIGN.md)
      // ═══════════════════════════════════════════════════════════════════
      colors: {
        // ── Surface — Onyx tokens ────────────────────────────────────────
        surface: {
          DEFAULT: '#fcf9f6',
          dim: '#dcd9d7',
          bright: '#fcf9f6',
          container: {
            lowest: '#ffffff',
            low: '#f6f3f1',
            DEFAULT: '#f0edeb',
            high: '#ebe8e5',
            highest: '#e5e2e0',
          },
          variant: '#e5e2e0',
          tint: '#924a31',
        },
        'on-surface': {
          DEFAULT: '#1c1c1a',
          variant: '#54433e',
        },
        'inverse-surface': '#31302f',
        'inverse-on-surface': '#f3f0ee',

        // ── Primary — Onyx tokens ──────────────────────────────────────
        primary: {
          DEFAULT: '#8f482f',
          on: '#ffffff',
          container: '#ad5f45',
          'on-container': '#fffbff',
          fixed: '#ffdbd0',
          'fixed-dim': '#ffb59d',
          'on-fixed': '#390c00',
          'on-fixed-variant': '#75331c',
          inverse: '#ffb59d',
          tint: '#924a31',
        },

        // ── Secondary — Onyx tokens ────────────────────────────────────
        secondary: {
          DEFAULT: '#605e58',
          on: '#ffffff',
          container: '#e6e2da',
          'on-container': '#66645e',
          fixed: '#e6e2da',
          'fixed-dim': '#cac6bf',
          'on-fixed': '#1c1c17',
          'on-fixed-variant': '#484741',
        },

        // ── Tertiary — Onyx tokens ─────────────────────────────────────
        tertiary: {
          DEFAULT: '#5e5c54',
          on: '#ffffff',
          container: '#77746c',
          'on-container': '#fffbff',
          fixed: '#e7e2d8',
          'fixed-dim': '#cac6bc',
          'on-fixed': '#1d1c15',
          'on-fixed-variant': '#49473f',
        },

        // ── Error — Onyx tokens ────────────────────────────────────────
        error: {
          DEFAULT: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          'on-container': '#93000a',
        },

        // ── Outline — Onyx tokens ──────────────────────────────────────
        outline: {
          DEFAULT: '#87736d',
          variant: '#dac1ba',
        },

        // ── Background — Onyx tokens ───────────────────────────────────
        background: {
          DEFAULT: '#fcf9f6',
          on: '#1c1c1a',
        },

        // ── Legacy/Compat — Preserved for existing components ───────────
        canvas: '#fcf9f6',
        'surface-soft': '#f6f3f1',
        'surface-card': '#f0edeb',
        hairline: {
          DEFAULT: '#dac1ba',
          soft: '#e5e2e0',
        },
        ink: '#1c1c1a',
        body: {
          DEFAULT: '#54433e',
          strong: '#1c1c1a',
        },
        muted: {
          DEFAULT: '#87736d',
          soft: '#dac1ba',
        },
        'on-dark': {
          DEFAULT: '#fcf9f6',
          soft: '#dcd9d7',
        },
        success: '#5db872',
        warning: '#d4a017',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Typography — Font Families (Onyx)
      // ═══════════════════════════════════════════════════════════════════
      fontFamily: {
        display: [
          'EB Garamond',
          'Tiempos Headline',
          'Cormorant Garamond',
          'Garamond',
          'Times New Roman',
          'serif',
        ],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },

      // ═══════════════════════════════════════════════════════════════════
      // Typography — Font Sizes & Line Heights (Onyx)
      // ═══════════════════════════════════════════════════════════════════
      fontSize: {
        // Headlines — EB Garamond, weight 500, negative tracking
        'headline-display': [
          '3rem',
          { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '500' },
        ],
        'headline-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' }],
        'headline-lg-mobile': [
          '1.75rem',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '500' },
        ],
        'headline-md': [
          '1.5rem',
          { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' },
        ],

        // Body — Inter
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],

        // Labels — Inter
        'label-md': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '600' }],

        // Code — Inter
        code: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
      },

      // ═══════════════════════════════════════════════════════════════════
      // Spacing — 4px base unit (Onyx)
      // ═══════════════════════════════════════════════════════════════════
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        xxl: '64px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '48px',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Border Radius — Onyx "Soft Geometry" (12px standard)
      // ═══════════════════════════════════════════════════════════════════
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
        pill: '9999px',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Box Shadow — None (Flat/Tonal Layering per Onyx)
      // ═══════════════════════════════════════════════════════════════════
      boxShadow: {
        none: 'none',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Max Width
      // ═══════════════════════════════════════════════════════════════════
      maxWidth: {
        content: '800px',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Breakpoints
      // ═══════════════════════════════════════════════════════════════════
      screens: {
        mobile: { max: '767px' },
        tablet: { min: '768px', max: '1023px' },
        desktop: { min: '1024px', max: '1439px' },
        wide: { min: '1440px' },
      },

      // ═══════════════════════════════════════════════════════════════════
      // Animations
      // ═══════════════════════════════════════════════════════════════════
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
