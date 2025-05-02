import { DEFAULT_THEME, type MantineThemeColorsOverride } from '@mantine/core'

export const colors: MantineThemeColorsOverride = {
  colors: {
    ...DEFAULT_THEME.colors,
    primary: [
      '#FAFBFE',
      '#cce4ff',
      '#9bc6ff',
      '#65a6fe',
      '#388afc',
      '#1b79fc',
      '#0271fd',
      '#005fe2',
      '#0055cb',
      '#0049b4',
    ],
    yellow: [
      '#FFF6E1', // 50
      '#FFECCB', // 100
      '#FFD89A', // 200
      '#FFC364', // 300
      '#FFB137', // 300
      '#FFA51B', // 500
      '#FF9C00', // 600
      '#E38B00', // 700
      '#CB7B00', // 800
      '#B06900', // 900
    ],
    green: [
      '#E8FEF4', // 50
      '#D5FAE9', // 100
      '#AAF3D1', // 200
      '#7CECB7', // 300
      '#57E7A2', // 300
      '#41E494', // 500
      '#33E28D', // 600
      '#25C979', // 700
      '#17B26A', // 800
      '#009A59', // 900
    ],
    red: [
      '#FFEAECFF', // 50
      '#FCD5D7', // 100
      '#F2A8AC', // 200
      '#EA797E', // 300
      '#E35157', // 300
      '#E0383E', // 500
      '#DF2A32', // 600
      '#D21F27', // 700
      '#B1161F', // 800
      '#9B0919', // 900
    ],
    gray: [
      '#f1f3f5',
      '#f0f4ff',
      '#e4e7ee',
      '#c9ccd3',
      '#9497a0',
      '#858892',
      '#7c808d',
      '#6a6e7b',
      '#5d626f',
      '#4e5465',
    ],
  },
}
