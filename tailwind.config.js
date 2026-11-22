/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core neutrals using CSS variables for infallible theming
        bg: {
          canvas: 'var(--bg-canvas)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        brand: {
          primary: 'var(--accent)',
          'primary-hover': 'var(--accent-hover)',
          lime: 'var(--accent-lime)',
          'lime-hover': 'var(--accent-lime-hover)',
          sky: 'var(--accent-sky)',
          amber: 'var(--accent-amber)',
          coral: 'var(--accent-coral)',
        },
        focus: 'var(--focus)',
        success: 'var(--accent)',
        warning: 'var(--accent-amber)',
        error: 'var(--accent-coral)',

        // Legacy colors (kept for backward compat during transition)
        ivory: '#FAF9F6',
        white: '#FFFFFF',
        stone: {
          50: '#F8F7F4',
          100: '#F0EDE8',
          200: '#E2DED5',
          300: '#D1CDC0',
          400: '#B8B1A3',
          500: '#A8A296',
          600: '#8F887C',
          700: '#787165',
          800: '#625C51',
          900: '#514C42',
        },
        charcoal: {
          900: '#1C1B18',
          950: '#0F0E0D',
        },

        // Brand - Natural Greens (Sage/Forest)
        sage: {
          50: '#F0F5F0',
          100: '#DCE8DC',
          200: '#B9D1B9',
          300: '#8FAF8F',
          400: '#6B8E6B',
          500: '#5A7A5A',
          600: '#4A664A',
          700: '#3A523A',
          800: '#2D5A2D',
          900: '#244724',
        },
        forest: {
          500: '#6B8E6B',
          600: '#2D5A2D',
          700: '#244724',
          800: '#1B351B',
          900: '#142814',
        },

        // Brand - Sky Blues
        sky: {
          50: '#EFF6FF',
          100: '#D6E9F8',
          200: '#B3D4F4',
          300: '#7CB5EF',
          400: '#4A94E9',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#1E3A8A',
        },

        // Strategic Accents
        amber: {
          100: '#FEF3C7',
          200: '#FDE68A',
          500: '#F59E0B',
          600: '#D97706',
        },
        coral: {
          100: '#FFEDD5',
          200: '#FED3C5',
          500: '#F97316',
          600: '#EA580C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        violet: {
          500: '#8B5CF6',
          600: '#7C3AED',
        },
      },

      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
        h1: ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.25', fontWeight: '600' }],
        h3: ['clamp(1.125rem, 1.5vw, 1.375rem)', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        lg: ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        base: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        sm: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        xs: ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.02em' }],
        mono: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px',
      },

      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        xs: '0 1px 2px rgb(15 23 42 / 0.04)',
        sm: '0 1px 3px rgb(15 23 42 / 0.06), 0 1px 2px rgb(15 23 42 / 0.04)',
        md: '0 4px 6px -1px rgb(15 23 42 / 0.06), 0 2px 4px -2px rgb(15 23 42 / 0.04)',
        lg: '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.04)',
        xl: '0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.04)',
        '2xl': '0 25px 50px -12px rgb(15 23 42 / 0.15)',
      },

      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'counter': 'counter 1.2s ease-out',
        'stagger-in': 'staggerIn 0.4s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        counter: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'ease-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2rem',
          '2xl': '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1440px',
        },
      },
    },
  },
  plugins: [],
}