import { createTheme, rem, DEFAULT_THEME, type MantineThemeOverride } from '@mantine/core'
import { colors } from './colors'

export const theme: MantineThemeOverride = createTheme({
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(25),
    xl: rem(30),
  },
  radius: {
    xs: '4px',
    sm: '5px',
    md: '6px',
    lg: '10px',
    xl: '30px',
  },
  spacing: {
    xs: rem(10),
    sm: rem(12),
    md: rem(16),
    lg: rem(20),
    xl: rem(32),
  },
  fontFamily: `${DEFAULT_THEME.fontFamily}`,
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: `${DEFAULT_THEME.fontFamily}`,
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: rem(25),
      },
      h2: {
        fontSize: rem(16),
      },
      h3: {
        fontSize: rem(14),
      },
    },
  },
  black: '#0E0F11',
  scale: 1.6,
  defaultRadius: 'md',
  cursorType: 'pointer',
  fontSmoothing: true,
  focusRing: 'auto',
  primaryColor: 'primary',
  primaryShade: 7,
  ...colors,
})

export default theme
