import { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindPresetMantine from 'tailwind-preset-mantine'
import { DEFAULT_THEME } from '@mantine/core'
import { colors } from '../mantine/colors'

const config: Config = {
  presets: [tailwindPresetMantine({ mantineBreakpoints: DEFAULT_THEME.breakpoints, mantineColors: colors })],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    spacing: mapSpacing(defaultTheme.spacing),
    extend: {
      fontFamily: {
        sans: 'var(--font-poppins)',
      },
      borderWidth: {
        px: '1px',
      },
    },
  },
}

function mapSpacing(_spacing: typeof defaultTheme.spacing) {
  const mappedEntries = Object.entries(_spacing).map(([_key, _value]) => {
    return [_key, `calc(${_value} * var(--mantine-scale))`]
  })
  return Object.fromEntries(mappedEntries)
}

export default config
