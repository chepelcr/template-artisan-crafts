import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#C62828',
  brand2: '#1E49A6',
  surface: '#FBFAF6',
  // The raised reading surface is the least favorable dark background for accents.
  darkSurface: '#29323D',
  displayFont: '"Alegreya", "Noto Serif", Georgia, serif',
  bundledFonts: ['Alegreya', 'Alegreya Sans'],
  displayFallback: 'Georgia, serif',
};
