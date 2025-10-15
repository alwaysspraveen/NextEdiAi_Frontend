import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AuraCustomPreset = definePreset(Aura, {
  semantic: {
    // keep the semantic indirection to your base blue scale
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },

    colorScheme: {
      light: {
        // Tip: prefer 600–700 for background + white text
        primary: {
          // If you need stronger contrast with white text, switch to {blue.700}
          color: '{blue.600}',
          inverseColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },

        // Use subtle tints for highlight so text remains readable
        highlight: {
          // replaced non-standard {blue.850}
          background: '{blue.50}', // subtle row/selection bg
          focusBackground: '{blue.100}', // stronger on focus/selected
          color: '{blue.800}', // text on highlight
          focusColor: '{blue.900}', // text on focused highlight
        },
      },

      dark: {
        // In dark, lighten the primary for hover; keep contrast on dark surfaces
        primary: {
          color: '{blue.500}', // can also use {blue.400} for a softer brand
          inverseColor: '#0b1220', // deep surface for chips/badges on primary
          hoverColor: '{blue.300}',
          activeColor: '{blue.200}',
        },

        // Use translucent overlays in dark mode to avoid heavy fills
        highlight: {
          background: 'rgba(59,130,246,.16)', // blue-500 @ 16%
          focusBackground: 'rgba(59,130,246,.24)', // blue-500 @ 24%
          color: 'rgba(255,255,255,.87)', // readable white
          focusColor: '{blue.50}',
        },
      },
    },

    tokens: {
      typography: {
        fontWeight: {
          buttonLabel: '500', // ✅ override to normal weight
        },
      },
    },
  },
});
