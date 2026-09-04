/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ═══════════════════════════════════════════════════════════════════
      // Colors — Merged: Original Claude tokens + Stitch MD3 tokens
      // ═══════════════════════════════════════════════════════════════════
      colors: {
        // ── Brand & Accent (Original) ───────────────────────────────────
        primary: {
          DEFAULT: '#cc785c',
          active: '#a9583e',
          disabled: '#e6dfd8',
          // Stitch MD3 additions
          container: '#ad5f45',
          fixed: '#ffdbd0',
          'fixed-dim': '#ffb59d',
        },
        accent: {
          teal: '#5db8a6',
          amber: '#e8a55a',
        },

        // ── Surface — Original tokens (preserved) ───────────────────────
        canvas: '#faf9f5',
        'surface-soft': '#f5f0e8',
        'surface-card': '#efe9de',
        'surface-cream-strong': '#e8e0d2',
        'surface-dark': {
          DEFAULT: '#181715',
          elevated: '#252320',
          soft: '#1f1e1b',
        },
        hairline: {
          DEFAULT: '#e6dfd8',
          soft: '#ebe6df',
        },

        // ── Text — Original tokens (preserved) ──────────────────────────
        ink: '#141413',
        body: {
          DEFAULT: '#3d3d3a',
          strong: '#252523',
        },
        muted: {
          DEFAULT: '#6c6a64',
          soft: '#8e8b82',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
        },
        'on-dark': {
          DEFAULT: '#faf9f5',
          soft: '#a09d96',
        },

        // ── Semantic — Original tokens (preserved) ──────────────────────
        success: '#5db872',
        warning: '#d4a017',
        error: {
          DEFAULT: '#c64545',
          // Stitch MD3 additions
          container: '#ffdad6',
        },

        // ═════════════════════════════════════════════════════════════════
        // Stitch MD3 — Material Design 3 Tokens
        // ═════════════════════════════════════════════════════════════════

        // ── Stitch Surface ──────────────────────────────────────────────
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

        // ── Stitch Outline ──────────────────────────────────────────────
        outline: {
          DEFAULT: '#87736d',
          variant: '#dac1ba',
        },

        // ── Stitch Background ───────────────────────────────────────────
        background: {
          DEFAULT: '#fcf9f6',
        },

        // ── Stitch Secondary ────────────────────────────────────────────
        secondary: {
          DEFAULT: '#605e58',
          container: '#e6e2da',
          fixed: '#e6e2da',
          'fixed-dim': '#cac6bf',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#66645e',
          fixed: '#1c1c17',
          'fixed-variant': '#484741',
        },

        // ── Stitch Tertiary ─────────────────────────────────────────────
        tertiary: {
          DEFAULT: '#5e5c54',
          container: '#77746c',
          fixed: '#e7e2d8',
          'fixed-dim': '#cac6bc',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#fffbff',
          fixed: '#1d1c15',
          'fixed-variant': '#49473f',
        },

        // ── Stitch on-primary-container (for MD3 surfaces) ──────────────
        'on-primary-container': '#fffbff',

        // ── Stitch inverse ──────────────────────────────────────────────
        'inverse-primary': '#ffb59d',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Typography — Font Families
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
        // Stitch font aliases
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'body-lg': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'headline-lg': ['EB Garamond', 'serif'],
        'headline-md': ['EB Garamond', 'serif'],
        'headline-display': ['EB Garamond', 'serif'],
        label: ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
      },

      // ═══════════════════════════════════════════════════════════════════
      // Typography — Font Sizes & Line Heights
      // ═══════════════════════════════════════════════════════════════════
      fontSize: {
        // Display — Copernicus/Tiempos serif, weight 400, negative tracking
        'display-xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-1.5px', fontWeight: '400' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '400' }],
        'display-md': [
          '2.25rem',
          { lineHeight: '1.15', letterSpacing: '-0.5px', fontWeight: '400' },
        ],
        'display-sm': [
          '1.75rem',
          { lineHeight: '1.2', letterSpacing: '-0.3px', fontWeight: '400' },
        ],

        // Title — StyreneB/Inter sans
        'title-lg': ['1.375rem', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '500' }],
        'title-md': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'title-sm': ['1rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],

        // Body — StyreneB/Inter sans
        'body-md': ['1rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],

        // Caption — StyreneB/Inter sans
        caption: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'caption-upper': [
          '0.75rem',
          { lineHeight: '1.4', letterSpacing: '1.5px', fontWeight: '500' },
        ],

        // Code — JetBrains Mono
        code: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],

        // UI — StyreneB/Inter sans
        button: ['0.875rem', { lineHeight: '1.0', letterSpacing: '0', fontWeight: '500' }],
        'nav-link': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
      },

      // ═══════════════════════════════════════════════════════════════════
      // Spacing — 4px base unit
      // ═══════════════════════════════════════════════════════════════════
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
        section: '96px',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Border Radius
      // ═══════════════════════════════════════════════════════════════════
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
        full: '9999px',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Box Shadow — Minimal, color-block first approach
      // ═══════════════════════════════════════════════════════════════════
      boxShadow: {
        subtle: '0 1px 3px rgba(20,20,19,0.08)',
        none: 'none',
      },

      // ═══════════════════════════════════════════════════════════════════
      // Max Width
      // ═══════════════════════════════════════════════════════════════════
      maxWidth: {
        content: '1200px',
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
